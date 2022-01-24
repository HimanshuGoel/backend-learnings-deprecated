// require('source-map-support').install();

import app from './app';
import Logger from './utilities/logger.utility';

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (reason: Error) => {
  Logger.error('Unhandled Promise Rejection: reason:', reason.message);
  Logger.error(reason.stack);
});

const server = app.listen(PORT, () => {
  Logger.log(`listening on port ${PORT}`);
});

export default server;
