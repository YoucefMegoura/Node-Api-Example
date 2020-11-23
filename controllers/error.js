exports.get404 = (req, res, next) => {
    res.status(400)
        .json({
            hello: "Welcom to the Feeds API",
            error: 'request not found, please contact the administrator for more information'
        })
}


exports.getErrors = (error, req, res, next) => {
    console.log(error)
    const statusCode = error.statusCode || 500
    const message = error.message
    const errorData = error.data
    res.status(statusCode)
        .json({
            message: message,
            errorData: errorData
        })
}