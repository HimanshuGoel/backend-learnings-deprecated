import app from './app';

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Promise Rejection: reason:', reason.message);
  console.error(reason.stack);
});

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});

export default app;
