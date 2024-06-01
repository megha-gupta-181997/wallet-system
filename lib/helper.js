
const ClientError = require("./clientError")
const sendSuccessResponse = (data) => {
    return {
        data,
        error: '',
    }
};

const sendErrorResponse = (error) => ({
    data: '',
    error,
});

const mongooseErrorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const parsedError = handleValidationError(err);
        return next(parsedError);
    }
    if (err.code && err.code === 11000) {
        const parsedError = handleDuplicateKeyError(err);
        return next(parsedError);
    }
    if (err.name === 'CastError') {
        const parsedError = handleCastError(err);
        return next(parsedError);
    }

    return next(err);
};

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((error) => error.message);
    if (errors.length > 1) {
        const formattedErrors = errors.join(' ');
        return new ClientError(400, formattedErrors);
    }
    return new ClientError(400, errors);
};

const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue);
    return new ClientError(400, `An account with that ${field} already exists.`);
};

const handleCastError = (err) => new ClientError(400, `Invalid ${err.path}`);


module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
    mongooseErrorHandler
}
