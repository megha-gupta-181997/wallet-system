const Joi = require('joi');
const helper = require('../lib/helper')

const validateWalletInitializePayload = async (req, res, next) => {
    const JoiSchema = Joi.object({
        balance: Joi.number()
            .precision(4).prefs({ convert: false })
            .required(),
        name: Joi.string()
            .min(5)
            .max(15)
            .required(),
    }).unknown(false).options({ abortEarly: false });
    const { error } = JoiSchema.validate(req.body)
    if (error) {
        return res.status(400).send(helper.sendErrorResponse(error.details[0].message));
    }
    next()
}

const validateCreditDebitWalletPayload = async (req, res, next) => {
    const JoiSchema = Joi.object({
        amount: Joi.number()
            .precision(4).prefs({ convert: false })
            .required(),
        description: Joi.string()
            .min(0)
            .max(50)
            .required(),
    }).unknown(false).options({ abortEarly: false });

    const { error } = JoiSchema.validate(req.body)
    if (error) {
        return res.status(400).send(helper.sendErrorResponse(error.details[0].message));
    }
    next()
}

const validateCreditDebitWalletParam = async (req, res, next) => {
    const JoiSchema = Joi.object({
        walletId: Joi.string().min(24).max(24).required()
    }).unknown(false).options({ abortEarly: false });

    const { error } = JoiSchema.validate(req.params)
    if (error) {
        return res.status(400).send(helper.sendErrorResponse(error.details[0].message));
    }
    next()
}

const validateGetWallet = async (req, res, next) => {
    const JoiSchema = Joi.object({
        id: Joi.string().min(24).max(24).required()
    }).unknown(false).options({ abortEarly: false });

    const { error } = JoiSchema.validate(req.params)
    if (error) {
        return res.status(400).send(helper.sendErrorResponse(error.details[0].message));
    }
    next()
}

const validateGetTransactions = async (req, res, next) => {
    const JoiSchema = Joi.object({
        walletId: Joi.string().min(24).max(24).required(),
        skip: Joi.string().required(),
        limit: Joi.string().required(),
    }).unknown(false).options({ abortEarly: false });

    const { error } = JoiSchema.validate(req.query)
    if (error) {
        return res.status(400).send(helper.sendErrorResponse(error.details[0].message));
    }
    next()
}

module.exports = {
    validateWalletInitializePayload,
    validateCreditDebitWalletPayload,
    validateCreditDebitWalletParam,
    validateGetWallet,
    validateGetTransactions,
}