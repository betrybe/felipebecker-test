require('express-async-errors');
const express = require('express');
const routes = require('./routes');
const uploadConfig = require('./config/multer');
const AppError = require('./errors/appError');

const app = express();

app.use(express.json());

app.use('/images', express.static(uploadConfig.directory));

app.use(routes);

app.use((err, _request, response, _) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  return response.status(500).json({
    message: 'Internal error of the system',
  });
});

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
