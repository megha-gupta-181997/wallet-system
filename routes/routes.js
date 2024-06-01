const express = require('express');
const { initializeWallet, creditDebitWallet, getWallet, getTransactions } = require('../controller/wallet');
const { validateWalletInitializePayload, validateCreditDebitWalletPayload, validateCreditDebitWalletParam, validateGetWallet, validateGetTransactions } = require('../middleware/validation');
const router = express.Router();
const helper = require('../lib/helper')


router.post('/setup', validateWalletInitializePayload, async (req, res, next) => {
    try {
        const response = await initializeWallet(req.body);
        return res.status(201).send(helper.sendSuccessResponse(response));
    } catch (error) {
        error.filename = 'routes.js';
        error.func = 'router.initializeWallet';
        return next(error);
    }
});

router.post('/transact/:walletId', validateCreditDebitWalletParam, validateCreditDebitWalletPayload, async (req, res, next) => {
    try {
        const response = await creditDebitWallet(req.body, req.params.walletId);
        return res.status(201).send(helper.sendSuccessResponse(response));
    } catch (error) {
        error.filename = 'routes.js';
        error.func = 'router.creditDebitWallet';
        return next(error);
    }
});

router.get('/wallet/:id', validateGetWallet, async (req, res, next) => {
    try {
        const response = await getWallet(req.params.id);
        return res.status(201).send(helper.sendSuccessResponse(response));
    } catch (error) {
        error.filename = 'routes.js';
        error.func = 'router.getWallet';
        return next(error);
    }
});

router.get('/transactions', validateGetTransactions, async (req, res, next) => {
    try {
        const response = await getTransactions(req.query);
        return res.status(201).send(helper.sendSuccessResponse(response));
    } catch (error) {
        error.filename = 'routes.js';
        error.func = 'router.getWallet';
        return next(error);
    }
});
module.exports = router