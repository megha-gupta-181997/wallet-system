const mongoose = require('mongoose');
const logger = require('../lib/logger');

const initDB = () => new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_DB_CONNECT_STRING, {
        connectTimeoutMS: 60000,
    });
    mongoose.connection.once('open', () => {
        logger('Info', 'connected to DB', 'mongoose.js', 'initDB');
        resolve(true);
    }).on('error', (err) => {
        logger('Error', 'Failed to connect to Mongodb', 'mongoose.js', 'initDB', err);
        reject(err);
    });
});

module.exports = initDB;
