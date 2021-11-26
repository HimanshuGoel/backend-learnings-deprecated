import app from './app';
import Logger from './utilities/logger.utility';

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (reason: Error) => {
  Logger.error('Unhandled Promise Rejection: reason:', reason.message);
  Logger.error(reason.stack);
});

app.listen(PORT, () => {
  Logger.log(`listening on port ${PORT}`);
});

export default app;
