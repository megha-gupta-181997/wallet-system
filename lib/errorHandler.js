const logger = require("./logger");
const helper = require("./helper")
const ClientError  = require('./clientError'); 

const clientErrorHandler = (err, req, res, next) => {
    if (err instanceof ClientError) {
    logger('Error', err.message, err.filename, err.func, err);
    res.status(err.statusCode).send(helper.sendErrorResponse(err.message));
        return next();
    }
    return next(err);
};

const errHandler = (err, req, res, next) => {
    logger('Error', err.message, err.filename, err.func, err);
    res.status(500).send(helper.sendErrorResponse(err.message));
    return next();
};

module.exports = { clientErrorHandler, errHandler }