const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev')); //middlewares
app.use(cookieParser());
app.use(express.json());

const {ValidationError} = require('sequelize')

if(!isProduction) {
    app.use(cors());
    //cors will only be used when in development
    //it is not needed in prod because React and Express resources will come from the same origin
}

app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
    //helmet sets a variety of headers to help secure the application
);

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && 'Lax',
            httpOnly: true
        }
    })
    //this is seeting up the csrf token and creating the method which is used for any server res
);

const routes = require('./routes');

app.use(routes);

//below is if we dont match any routes, we will hit this middleware
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.")
    err.title = "Resource Not Found";
    err.errors = {message: "The requested resource couldn't be found."}
    err.status = 404;
    next(err)
})

//this is to catch sequelize errors
//sequelize errors will become an instance of the ValidationError from the sequelize package
app.use((err, _req, _res, next) => {
    if(err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err);
})

//this is to format all the errors and should be the very last middleware

//adding underscore to the paramaters to signify that those params are not being used but are required. 

app.use((err, _req, res, _next) => {
    res.status(err.status || 500); //set the status code to whatever the status code is on the err obj OR to 500 if it is not available
    console.log(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    })

})

module.exports = app;




