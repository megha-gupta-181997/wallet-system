const logger = (level, message, file, func, error) => {
    const log = {
        level, timestamp: new Date(), message, file, func, label: process.env.appName
    };
    console.log(JSON.stringify(log));
    if (error) console.error(error.stack || error);
};
module.exports =  logger;
