const dotenv = require('dotenv');

const setEnviromentVariables = () => {
    if (process.env.ENV && process.env.ENV === 'production')  {
            dotenv.config({
                path: './config/production.env',
            });
    } else {
        dotenv.config({
            path: './config/dev.env',
        });
    }
};
module.exports = {
    setEnviromentVariables
}
