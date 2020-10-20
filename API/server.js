const express = require('express');
const cors = require('cors');
const md5 = require('md5');
require('dotenv').config();

//Controllers
const users = require('./controllers/users');

//Express
const app = express();
app.use(express.json());
app.use(cors());

//Indica se a API está online
app.get('/', function (req, res) {
  return res.sendStatus(200);
});

//Adiciona um novo usuário
app.post('/adduser', (req, res) => {
  const user = {
    name: req.body.name,
    cpf: req.body.cpf,
    email: req.body.email,
    birth_date: req.body.birth_date,
    password: md5(req.body.password),
    is_admin: req.body.is_admin,
    balance: 0
  };

  users.storeUser(user)
    .then((response) => {
      if (response.stored) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});







let port = process.env.PORT || '4000';
app.listen(port);
console.log('Server running on port ', port);