// App Dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todohandler');
const userHandler = require('./routeHandler/userHandler');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());

// database connection with mongoose
mongoose
    .connect('mongodb://localhost/todos')
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log(err);
    });

// application routes
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// default error Handler
// eslint-disable-next-line consistent-return
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.sendStatus(err);
};

app.use(errorHandler);
// server setup
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
