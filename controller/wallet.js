const mongoose = require('mongoose');
const transactionModel = require('../models/transaction');
const walletModel = require("../models/wallet")
const ClientError = require("../lib/clientError")

const initializeWallet = async (payload) => {
    const session = await mongoose.startSession()

    payload.name = payload.name.toLowerCase()

    let wallet = await walletModel.findOne({ name: payload.name });
    if (wallet) {
        throw new ClientError(400, 'Given wallet name exist');
    }

    wallet = new walletModel(payload);
    await wallet.save({ session });

    const transactionPayload = {
        wallet_id: wallet._id,
        description: "Setup",
        amount: payload.balance,
        balance: payload.balance,
        type: "CREDIT"
    }
    const transaction = new transactionModel(transactionPayload);
    await transaction.save({ session });
    const responsePayload = {
        id: wallet._id,
        balance: parseFloat(wallet.balance),
        transactionId: transaction._id,
        name: wallet.name,
        date: transaction.createdAt
    }
    return responsePayload;
}

const creditDebitWallet = async (payload, walletId) => {
    const session = await mongoose.startSession()
    const wallet = await walletModel.findOne({ _id: walletId })
    if (!wallet) {
        throw new ClientError(400, 'Wallet does not exist');
    }

    wallet.balance = parseFloat(wallet.balance) + payload.amount
    await wallet.save({ session })

    let type = ""

    if (payload.amount < 0) {
        type = "DEBIT"
    } else {
        type = "CREDIT"
    }

    const transactionPayload = {
        wallet_id: wallet._id,
        description: payload.description,
        amount: payload.amount,
        balance: wallet.balance,
        type,
    }
    const transaction = new transactionModel(transactionPayload);
    await transaction.save({ session });
    const responsePayload = {
        balance: parseFloat(wallet.balance),
        transactionId: transaction._id
    }
    return responsePayload;
}

const getWallet = async (walletId) => {
    const wallet = await walletModel.findOne({ _id: walletId });
    if (!wallet) {
        throw new ClientError(400, 'Wallet does not exist');
    }
    wallet.balance = parseFloat(wallet.balance);
    wallet.id = wallet._id;
    const responsePayload = {
        id: wallet._id,
        balance: parseFloat(wallet.balance),
        name: wallet.name,
        date: wallet.date
    }
    return responsePayload
}

const getTransactions = async (query) => {
    const transactions = await transactionModel.find({ wallet_id: query.walletId }).skip(query.skip).limit(query.limit);
    const responsePayload = []
    for (let i = 0; i < transactions.length; i++) {
        responsePayload.push({
            id: transactions[i]._id,
            walletId: transactions[i].wallet_id,
            amount: parseFloat(transactions[i].amount),
            balance: parseFloat(transactions[i].balance),
            description: transactions[i].description,
            type: transactions[i].type,
            date: transactions[i].createdAt
        })
    }
    return responsePayload
}

module.exports = {
    initializeWallet,
    creditDebitWallet,
    getWallet,
    getTransactions,
}