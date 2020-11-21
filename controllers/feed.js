exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            title: 'First posts',
            content: 'This is the first post!'
        }]
    })
}

exports.postPost = (req, res, next) => {
    const title = req.body.title
    const content = req.body.content
    res.status(201).json({
        message: 'Posts created!',
        post : {
            id: Date.now(),
            title: title,
            content: content
        }
    })
}