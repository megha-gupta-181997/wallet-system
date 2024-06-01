
const mongoose = require('mongoose');
const ClientError = require('../lib/clientError');

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    balance: {
        type: mongoose.Types.Decimal128,
        required: true
    }
}, {
    collection: 'wallet',
    timestamps: false,
    versionKey: false,
});

const walletModel = mongoose.model('wallet', walletSchema);

module.exports = walletModel;
