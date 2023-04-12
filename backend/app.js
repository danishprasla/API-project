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

module.exports = app;




