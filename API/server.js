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
    type: req.body.type,
    balance: 0
  };

  users.storeUser(user)
    .then((response) => {
      if (response.stored) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});

//Autentica um usuário
app.post('/auth', (req, res) => {
  const user = {
    email: req.body.email,
    password_hash: md5(req.body.password)
  };

  users.authenticate(user)
    .then((response) => {
      if (response.valid) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(JSON.stringify(response));
    })
    .catch((error) => { res.status(500).send(error) });
});

//Consulta informações de um Usuário
app.get('/users/:email?', (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(400).send({error: 'Email não informado'});

  users.getUser(email)
    .then((response) => {
      if (response.valid) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(JSON.stringify(response));
    })
    .catch((error) => { res.status(500).send(error) });
});

//Altera informações de um Usuário
app.put('/users/:email?', (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(400).send({error: 'Email não informado'});
  const user = {
    name: req.body.name,
    cpf: req.body.cpf,
    email: req.body.email,
    birth_date: req.body.birth_date,
    type: req.body.type
  };

  users.alterUser(email, user)
    .then((response) => {
      if (response.valid) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(JSON.stringify(response));
    })
    .catch((error) => { res.status(500).send(error) });
});



let port = process.env.PORT || '4000';
app.listen(port);
console.log('Server running on port ', port);