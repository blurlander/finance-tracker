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
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204 // HTTP status code to respond with for successful OPTIONS requests
};

app.use(cors(corsOptions));
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