const router = require('express').Router();
const User = require('./users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    const checkUser = await User.findOne({email: req.body.email})

    if (checkUser) {
        return res.status(404).send({
            message: 'this email has already been used'
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        expenses: [],
        income: [],
    });


    const result = await user.save();

    const {password, ...data} = await result.toJSON();

    res.send(data);


})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return res.status(404).send({
            message: 'user not found'
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }

    const token = jwt.sign({_id: user._id}, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'success'
    })
})

router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'secret')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }

        const user = await User.findOne({_id: claims._id})

        const {password, ...data} = await user.toJSON()

        res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'success'
    })
})

router.post('/addExpense', async (req, res) => {
    try {
        const userExpenses = await User.findOne({ userId: req.body.userId });
        const expense = req.body.expense;
        userExpenses.expenses = userExpenses.expenses.concat(expense);

        await userExpenses.save();

        const { expenses, ...data } = await userExpenses.toJSON();
        res.send(data);
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});

router.post('/addIncome', async (req, res) => {
    try {
        const userIncome = await User.findOne({ userId: req.body.userId });
        const newIncome = req.body.expense;
        userIncome.income = userIncome.income.concat(newIncome);

        await userIncome.income.save();

        const { income, ...data } = await userIncome.toJSON();
        res.send(data);
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});


router.get('/expenses', async (req, res) => {
    try {
        const userId = req.query.userId; // Extract userId from query parameters
        const userExpenses = await User.findOne({ userId });

        const {expenses, ...data} = await userExpenses.toJSON()

        res.send(expenses)
    } catch (e) {
        console.error("Error: ", e);
        return res.status(500).send({
          message: 'Error in get expenses',
        });
    }
})

router.get('/income', async (req, res) => {
    try {
        const userId = req.query.userId; // Extract userId from query parameters
        const userIncome = await User.findOne({ userId });

        const {income, ...data} = await userIncome.toJSON()

        res.send(income)
    } catch (e) {
        console.error("Error: ", e);
        return res.status(500).send({
          message: 'Error in get income',
        });
    }
})

module.exports = router;