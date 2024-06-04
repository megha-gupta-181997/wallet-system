const initDB = require('./connections/mongo-client');
const cors = require("cors");
const helmet = require("helmet");
const express = require('express');
const { setEnviromentVariables } = require('./config/environment');
const app = express();
const walletRoutes = require('./routes/routes');
const logger = require('./lib/logger');
const { mongooseErrorHandler } = require('./lib/helper');
const { clientErrorHandler, errHandler } = require('./lib/errorHandler');
setEnviromentVariables();

const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server listening at http://${process.env.HOST}:${port}`);
});

const addMiddlewares = () => {
  app.use(cors({ credentials: true, origin: true }));
  app.use(helmet());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: false }));
};

const addRoutes = () => {
  app.use('/health', (req, res) => res.send('OK'));
  app.use('/', walletRoutes)
}

const addErrorHandlers = () => {
  app.use(mongooseErrorHandler);
  app.use(clientErrorHandler);
  app.use(errHandler);
};

const start = async () => {
  try {
    initDB();
    addMiddlewares();
    addRoutes();
    addErrorHandlers();
  } catch (error) {
    logger('Fatal', 'Error starting server', 'app.js', 'start', error);
  }
};

start()
module.exports = app
