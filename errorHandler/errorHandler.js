module.exports = {
    errorLogger: (err, req, res, next) => {
        if (process.env.NODE_ENV === 'development'){ 
            console.error('\x1b[31m', err);
        }
        next(err);
    },
    errorResponder: (err, req, res, next) => {
        res.header("Content-Type", 'application/json');
        res.status(err.statusCode).send(err);
    },
    error: (statusCode, message, at) => {
        console.log(process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'development'){ 
            return {statusCode,message,at};
        } else  {
            return {statusCode,message};
        }
    },
};