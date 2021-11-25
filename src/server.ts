import app from './app';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});

app.get('/', (req, res) => res.send('Hello World2!'));

export default app;
