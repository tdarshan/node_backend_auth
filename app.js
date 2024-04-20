require("dotenv").config();

const cors = require('cors');


const express = require("express");
const morgan = require("morgan")
const createError = require('http-errors');
require('./helpers/init_mongodb');

const AuthRoute = require('./Routes/auth.route');
const { verifyAccessToken } = require("./helpers/jwt_helper");
const User = require("./Models/User.model");

const app = express();


// Allow all origins
app.use(cors({
    origin: '*'
  }));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/",verifyAccessToken, async (req, res, next) => {
    // console.log(req.headers['authorization']);
    const {id} = req;

    const user = await User.findById(id);

    console.log({...user, password: '' });

    // console.log(id);
    res.send("Hello World1!")
});

app.use('/auth', AuthRoute);


app.use(async (req, res, next) => {
    // const error = new Error('Not found!');
    // error.status = 404;
    // next(error);
    next(createError.NotFound("Route does not exists"));
});

app.use((err, req, res, next) => {

    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

