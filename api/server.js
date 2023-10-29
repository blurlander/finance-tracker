const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./modules/routes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 8000;

dotenv.config({ path: './config.env' });

const url = process.env.DATABASE;
const corsOptions = {
    origin: 'https://653e4ec9b4c3ec69c7263324--legendary-shortbread-5a0972.netlify.app',
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  };
  
app.use(cors(corsOptions));
app.use(cookieParser());
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
