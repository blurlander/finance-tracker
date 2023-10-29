const router = require('express').Router();
const User = require('./users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    const checkUser = await User.findOne({ email: req.body.email })

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
        balance: 0,
        categories: [],
    });


    const result = await user.save();

    const { password, ...data } = await result.toJSON();

    res.send(data);


})

router.post('/login', async (req, res) => {

    console.log('Received login request:', req.body); // Log the request body
    const user = await User.findOne({ email: req.body.email })

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

    const token = jwt.sign({ _id: user._id }, "secret")

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

        const user = await User.findOne({ _id: claims._id })

        const { password, ...data } = await user.toJSON()

        res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })

    res.send({
        message: 'success'
    })
})

router.post('/addExpense', async (req, res) => {
    try {
        const userExpenses = await User.findOne({ _id: req.body.userId });
        const expense = req.body.expense;

        // Check if the category already exists in userExpenses.categories
        const existingCategoryIndex = userExpenses.categories.findIndex(category => category.name === expense.category);

        // If the category exists, update its color value; otherwise, add it to the categories array
        if (existingCategoryIndex !== -1) {
            userExpenses.categories[existingCategoryIndex].color = expense.color;

            // Update color of expenses with the same category name
            userExpenses.expenses.forEach(expenseItem => {
                if (expenseItem.category === expense.category) {
                    expenseItem.color = expense.color;
                }
            });
        } else {
            // If the category doesn't exist, add it to the categories array
            userExpenses.categories.push({ name: expense.category, color: expense.color });
        }


        userExpenses.expenses.push(expense);

        // Update the categories array and expenses array together
        await User.updateOne(
            { _id: req.body.userId },
            {
                $set: {
                    categories: userExpenses.categories,
                    expenses: userExpenses.expenses,
                    balance: userExpenses.balance - parseFloat(expense.amount) // Ensure amount is converted to a number
                }
            }
        );

        const updatedUserExpenses = await User.findOne({ _id: req.body.userId });
        const data = await updatedUserExpenses.toJSON();
        res.send(data);
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});

router.post('/addIncome', async (req, res) => {
    try {
        const userIncome = await User.findOne({ _id: req.body.userId });
        const newIncome = req.body.income;
        // Update the income property on the userIncome object
        userIncome.income.push(newIncome);
        userIncome.balance += newIncome.amount;

        // Save the updated userIncome object to the database
        await userIncome.save();

        // Respond with the updated user data (excluding income for security reasons)
        const { income, ...data } = await userIncome.toJSON();
        res.send(data);
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});


router.post('/editExpense', async (req, res) => {
    try {
        const { userId, updatedExpense, expenseIndex } = req.body;
        console.log(req.body);

        // Find the user by userId
        const userExpenses = await User.findOne({ _id: userId });

        // Get the old expense and category
        const oldExpense = userExpenses.expenses[expenseIndex];
        const oldCategory = oldExpense.category;

        // Calculate the difference between the old expense amount and the updated expense amount
        const amountDifference = updatedExpense.amount - oldExpense.amount;

        // Update the expense and balance
        userExpenses.expenses[expenseIndex] = updatedExpense;
        userExpenses.balance -= amountDifference;

        // Find the index of the old category in categories array
        const categoryIndex = userExpenses.categories.findIndex(category => category.name === updatedExpense.category);

        if (categoryIndex !== -1) {
            // Update the color of the existing category
            userExpenses.categories[categoryIndex].color = updatedExpense.color;
        } else {
            // If the category doesn't exist, create a new category
            userExpenses.categories.push({ name: updatedExpense.category, color: updatedExpense.color });
        }


        // Update category color and all expenses' colors with the same category
        userExpenses.categories.forEach(category => {
            if (category.name === oldCategory) {
                // Update the color of the old category
                category.color = updatedExpense.color;
            }
        });

        // Update all expenses' colors with the same category
        userExpenses.expenses.forEach(expenseItem => {
            if (expenseItem.category === oldCategory) {
                expenseItem.color = updatedExpense.color;
            }
        });

        // Update the userExpenses object using $set
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    'expenses': userExpenses.expenses,
                    'categories': userExpenses.categories,
                    'balance': userExpenses.balance
                }
            }
        );

        const updatedUserExpenses = await User.findOne({ _id: userId });
        const data = await updatedUserExpenses.toJSON();
        res.send(data);

    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});


router.post('/editIncome', async (req, res) => {
    try {
        const { userId, updatedIncome, incomeIndex } = req.body;



        // Find the user by userId
        const userIncome = await User.findOne({ _id: userId });


        // Calculate the difference between the old income amount and the updated income amount
        const amountDifference = updatedIncome.amount - userIncome.income[incomeIndex].amount;

        // Update the income 
        userIncome.income[incomeIndex] = updatedIncome;

        // Update the balance by adding the amount difference
        userIncome.balance += amountDifference;

        // Save the updated userIncome object to the database
        await userIncome.save();

        const data = await userIncome.toJSON();
        res.send(data);

    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});

router.post('/deleteExpense', async (req, res) => {
    try {
        const { userId, expenseIndex } = req.body;



        // Find the user by userId
        const userExpenses = await User.findOne({ _id: userId });

        // Ensure the user is found
        if (!userExpenses) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Calculate the amount to be deducted from balance
        const deletedExpenseAmount = userExpenses.expenses[expenseIndex].amount;

        // Remove the expense at the specified index
        userExpenses.expenses.splice(expenseIndex, 1);

        // Update the balance by subtracting the deleted expense amount
        userExpenses.balance += parseFloat(deletedExpenseAmount);

        // Save the updated userExpenses object
        await userExpenses.save();

        const data = await userExpenses.toJSON();
        res.send(data);
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});

router.post('/deleteIncome', async (req, res) => {
    try {
        const { userId, incomeIndex } = req.body;

        console.log(req.body);

        // Find the user by userId
        const userIncome = await User.findOne({ _id: userId });

        // Ensure the user is found
        if (!userIncome) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Calculate the amount to be deducted from balance
        const deletedIncomeAmount = userIncome.income[incomeIndex].amount;

        // Remove the expense at the specified index
        userIncome.income.splice(incomeIndex, 1);

        // Update the balance by subtracting the deleted expense amount
        userIncome.balance -= parseFloat(deletedIncomeAmount);

        // Save the updated userExpenses object
        await userIncome.save();

        const data = await userIncome.toJSON();
        res.send(data);
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});

router.post('/deleteCategory', async (req, res) => {
    try {
        const { userId, category} = req.body;

        console.log(req.body);

        // Find the user by userId
        const user = await User.findOne({ _id: userId });

        // Ensure the user is found
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const index = user.categories.findIndex(item => item.name === category);


        // Remove the category at the specified index
        user.categories.splice(index, 1);


        // Save the updated user object
        await user.save();

        const data = await userIncome.toJSON();
        res.send(data);
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        res.status(400).json({ error: error.message });
    }
});



module.exports = router;