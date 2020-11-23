const express = require('express')
const feedController = require('../controllers/feed')
const {
    body
} = require('express-validator')

const router = express.Router()

// GET: /feed/posts
router.get('/posts', feedController.getPosts)

// POST: /feed/posts
router.post('/post', [
    body('title')
    .trim()
    .isLength({
        min: 5
    }),
    body('content')
    .trim()
    .isLength({
        min: 5
    }),

], feedController.postPost)

// GET: /feed/post/:postId
router.get('/post/:postId', feedController.getPost)

//PUT: /feed/post/:postId
router.put('/post/:postId', [
    body('title')
    .trim()
    .isLength({
        min: 5
    }),
    body('content')
    .trim()
    .isLength({
        min: 5
    })

], feedController.putUpdatePost)

router.delete('/post/:postId', feedController.deletePost)

module.exports = router