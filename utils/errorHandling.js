exports.createErrorWithStatusCode = (err, statusCode) => {
    const error = new Error(err)
    error.statusCode = statusCode
    throw error;
}

exports.throwAsyncError = (err) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    next(err)
}