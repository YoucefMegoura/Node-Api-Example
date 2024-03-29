const express = require('express')
const feedController = require('../controllers/feed')
const {
    body
} = require('express-validator')
const isAuth = require('../middlewares/is-auth')

const router = express.Router()

// GET: /feed/posts
router.get('/posts', isAuth, feedController.getPosts)

// POST: /feed/posts
router.post('/post', isAuth, [
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
router.get('/post/:postId', isAuth, feedController.getPost)

//PUT: /feed/post/:postId
router.put('/post/:postId', isAuth, [
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

router.delete('/post/:postId', isAuth ,feedController.deletePost)

module.exports = router