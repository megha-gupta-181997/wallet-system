
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    wallet_id: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
    },
    amount: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    balance: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
    }
}, {
    collection: 'transaction',
    timestamps: {createdAt: true, updatedAt: false},
    versionKey: false,
});

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;
