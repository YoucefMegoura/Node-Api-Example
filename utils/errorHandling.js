exports.createErrorWithStatusCode = (err, statusCode, data) => {
    const error = new Error(err)
    if (statusCode){
        error.statusCode = statusCode
    }
    if (data) {
        error.data = data
    }
    throw error;
}

exports.throwAsyncError = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    next(err)
}