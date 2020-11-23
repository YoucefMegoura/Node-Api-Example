const User = require("../models/user");
const Post = require("../models/post")
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    createErrorWithStatusCode,
    throwAsyncError,
} = require("../utils/errorHandling");


exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if(!user) {
                createErrorWithStatusCode('User not found.', 404)
            }
            res.status(200)
                .json({
                    status: user.status
                })
        }).catch(err => {
            throwAsyncError(err, next)
        })
}


exports.putUpdateUserStatus = (req, res, next) => {
    const newStatus = req.body.status

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                createErrorWithStatusCode('User not found.', 404)
            }
            user.status = newStatus
            return user.save()
        })
        .then(result => {
            res.status(201)
                .json({
                    message: 'User status updated successfully.',
                    result: result
                })
        })
        .catch(err => {
            throwAsyncError(err, next)
        })
}





exports.putUpdateUserStatus = (req, res, next) => {
    
}
