import express from 'express';

const app = express();
const PORT = 4000;

app.get('/', (_, res) => {
  res.send('Сервер работает');
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
