module.exports = {
    errorLogger: (err, req, res, next) => {
        console.error('\x1b[31m', err); // adding some color to our logs
        next(err); // calling next middleware
    },
    errorResponder: (err, req, res, next) => {
        res.header("Content-Type", 'application/json')
        res.status(err.statusCode).json(err, null, 4) // pretty print
    },
    error: (statusCode, message, at) => {
        return {statusCode,message,at}
    }

};