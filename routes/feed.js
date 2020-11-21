const express = require('express')
const feedController = require('../controllers/feed')
const {
    body
} = require('express-validator')

const router = express.Router()

// GET: /feed/posts
router.get('/posts', feedController.getPosts)

// POST: /feed/posts
router.post('/posts', [
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


module.exports = router