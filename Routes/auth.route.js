const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require('../Models/User.model');
const { authSchema } = require("../helpers/validation_schema");
const Joi = require('@hapi/joi');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../helpers/jwt_helper");

router.post("/register", async (req, res, next) => {

        try {

                const { name, email, password } = req.body;
                // if (!email || !name || !password) {
                //         throw createError.BadRequest();
                // }

                const result = await authSchema.validateAsync(req.body);

                const isExists = await User.findOne({ email: result.email });

                if (isExists) {
                        throw createError.Conflict("Email already exists");
                }

                const user = new User(result);
                const savedUser = await user.save();

                const accessToken = await signAccessToken(savedUser.id);
                const refreshToken = await signRefreshToken(savedUser.id);

                res.send({ accessToken, refreshToken });

        } catch (err) {

                if (err.isJoi) {
                        err.status = 422;
                }

                next(err);
        }
});

router.post("/login", async (req, res, next) => {

        try {
                const result = await authSchema.validateAsync(req.body);

                const user = await User.findOne({email: result.email});

                if(!user){
                        throw createError.NotFound("User not found");
                }

                const isMatch = await user.isValidPassword(result.password);

                if(!isMatch){
                        throw createError.Unauthorized("Username/Password does not match");
                }

                const accessToken = await signAccessToken(user.id);
                const refreshToken = await signRefreshToken(user.id);

                res.send({accessToken, refreshToken});
        } catch (err) {

                if(err.isJoi){
                        return next(createError.BadRequest("Invalid username/password"));
                }

                next(err);
        }

});

router.post("/refresh-token", async (req, res, next) => {
        
        try {
             
                const {refreshToken} = req.body;

                if(!refreshToken){
                        throw createError.BadRequest();
                }

                const userId = await verifyRefreshToken(refreshToken);

                const newAccessToken = await signAccessToken(userId);
                const newRefreshYoken = await signRefreshToken(userId);

                res.send({accessToken : newAccessToken, refreshToken : newRefreshYoken});
        } catch (err) {
                next(err);
        }
});

router.delete("/logout", async (req, res, next) => {
        res.send("Logout route here");
});

module.exports = router;
