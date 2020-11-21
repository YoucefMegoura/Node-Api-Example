const {
    validationResult
} = require('express-validator')
const Post = require('../models/post')
const {throwAsyncError, createErrorWithStatusCode} = require('../utils/errorHandling')

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200)
                .json({
                    message: 'Fetched posts successfully.',
                    posts: posts
                })
        })
        .catch(err => {
            throwAsyncError(err)
        })
}

exports.postPost = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        createErrorWithStatusCode('Validation failed, entred data are incorrect.', 422)
    }
    
    if (!req.file) {
        createErrorWithStatusCode('No image provided.', 422)
    }

    const title = req.body.title
    const content = req.body.content
    const imageUrl = req.file.path.replace('\\', '/')
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: 'Youcef Megoura'
    })
    post.save()
        .then(result => {
            console.log(result)
            res.status(201)
                .json({
                    message: 'Post succefully created.',
                    post: result
                })
        })
        .catch(err => {
            throwAsyncError(err)
        })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.')
                error.statusCode = 404
                throw error
            }

            res.status(200)
                .json({
                    message: 'Post fetched.',
                    post: post
                })
        })
        .catch(err => {
            throwAsyncError(err)
        })

}

