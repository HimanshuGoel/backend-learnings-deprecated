require('source-map-support').install();

import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./certificate.pem')
};

import app from './app';
import Logger from './utilities/logger.utility';

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (reason: Error) => {
  Logger.error('Unhandled Promise Rejection: reason:', reason.message);
  Logger.error(reason.stack);
});

// const server = app.listen(PORT, () => {
//   Logger.log(`listening on port ${PORT}`);
// });

const server = https.createServer(options, app).listen(PORT, function () {
  console.log('Express server listening on port ' + PORT);
  console.log(
    'env = ' + app.get('env') + '\n__dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd()
  );
});

export default server;
