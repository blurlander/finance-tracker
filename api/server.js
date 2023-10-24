const express = require("express");
const app = express();
const PORT = "8000";
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./modules/routes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config({ path: './config.env' });



const url = process.env.DATABASE;
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'https://finance-tracker-app-kappa.vercel.app/'
}));
app.use(express.json());
app.use('/api', routes);


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.error('Connection error:', error);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});