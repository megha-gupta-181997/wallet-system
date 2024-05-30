import dotenv from 'dotenv';

export const setEnviromentVariables = () => {
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

setEnviromentVariables();
