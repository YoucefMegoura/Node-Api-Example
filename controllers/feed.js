const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const { create } = require("../models/post");
const Post = require("../models/post");
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
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: "Youcef Megoura",
    });
    post.save()
        .then((post) => {
            console.log(post);
            res.status(201).json({
                message: "Post succefully created.",
                post: post,
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
                createErrorWithStatusCode(
                    "Could not find the post.",
                    404
                );
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
            //check logged in user
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: "Post deleted succeessfuly.",
                result: result,
            });
        })
        .catch((err) => {
            throwAsyncError(err, next);
        });
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => {
        console.log(err);
    });
};
