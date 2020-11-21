exports.get404 = (req, res, next) => {
    res.status(200)
        .send('Our new API is under maintenance. Please come back later')
}