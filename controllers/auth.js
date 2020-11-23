const User = require("../models/user");

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    createErrorWithStatusCode,
    throwAsyncError,
} = require("../utils/errorHandling");

exports.putSignUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        createErrorWithStatusCode(
            "The entred data are Incorrect.",
            422,
            errors.array()
        );
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    console.log(name);

    const hashedPassword = bcrypt.hashSync(password, 12);

    const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
    });
    user.save()
        .then((result) => {
            res.status(201).json({
                message: "User created.",
                userId: result._id,
            });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                createErrorWithStatusCode(
                    "This email could not be found.",
                    401
                );
            }
            console.log('password::', password)
            if (bcrypt.compareSync(password, user.password)) {
                createErrorWithStatusCode("Wrong password.");
            }

            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id.toString(),
                },
                "secret",
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token: token,
                userId: user._id.toString(),
            });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};
