const User = require("../models/user")

const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")

const {
    createErrorWithStatusCode,
    throwAsyncError,
} = require("../utils/errorHandling")

exports.putSignUp = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        createErrorWithStatusCode(
            "The entred data are Incorrect.",
            422,
            errors.array()
        )
    }

    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    console.log(name)

    const hashedPassword = bcrypt.hashSync(password, 12)

    const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
    })
    user.save()
        .then((result) => {
            res.status(201).json({
                message: "User created.",
                userId: result._id,
            })
        })
        .catch((err) => {
            throwAsyncError(err, next)
        })
}
