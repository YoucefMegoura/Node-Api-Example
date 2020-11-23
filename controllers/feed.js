const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const { create } = require("../models/post");
const Post = require("../models/post");
const User = require("../models/user");
const {
    throwAsyncError,
    createErrorWithStatusCode,
} = require("../utils/errorHandling");

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find()
        .countDocuments()
        .then((count) => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then((posts) => {
            res.status(200).json({
                message: "Fetched posts successfully.",
                posts: posts,
                totalItems: totalItems,
            });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};

exports.postPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        createErrorWithStatusCode(
            "Validation failed, entred data are incorrect.",
            422,
            errors.array()
        );
    }

    if (!req.file) {
        createErrorWithStatusCode("No image provided.", 422);
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\", "/");
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
    });
    post.save()
        .then((result) => {
            return User.findById(req.userId);
        })
        .then((user) => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then((result) => {
            res.status(201).json({
                message: "Post succefully created.",
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name,
                },
            });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error("Could not find post.");
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: "Post fetched.",
                post: post,
            });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};

exports.putUpdatePost = (req, res, next) => {
    const postId = req.params.postId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        createErrorWithStatusCode(
            "Validation failed, entred data are incorrect.",
            422,
            errors.array()
        );
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }
    if (!imageUrl) {
        createErrorWithStatusCode("No file picked.", 422);
    }

    Post.findById(postId)
        .then((post) => {
            if (!post) {
                createErrorWithStatusCode("Could not find the post.", 404);
            }

            if (post.creator.toString() !== req.userId) {
                createErrorWithStatusCode("Not authorize.", 401);
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then((post) => {
            res.status(200).json({
                message: "Post Updated",
                post: post,
            });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    console.log(postId);
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                createErrorWithStatusCode("Could not find the post.", 404);
            }
            console.log("post.creator.toString() :: ", post.creator.toString());
            console.log("req.userId :: ", req.userId);
            if (post.creator.toString() !== req.userId.toString()) {
                createErrorWithStatusCode("Not authorize.", 401);
            }
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then((result) => {
            return User.findById(req.userId)
                .then((user) => {
                    user.posts.pull(postId);
                    return user.save();
                })
                .then((result) => {
                    console.log(result);
                    res.status(200).json({
                        message: "Post deleted succeessfuly.",
                        result: result,
                    });
                });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};


