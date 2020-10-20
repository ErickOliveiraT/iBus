const express = require('express');
const cors = require('cors');
const md5 = require('md5');
require('dotenv').config();

//Controllers
const users = require('./controllers/users');
const lines = require('./controllers/lines');
const stops = require('./controllers/stops');
const routes = require('./controllers/routes');
const stopSequence = require('./controllers/stop_sequence');

//Express
const app = express();
app.use(express.json());
app.use(cors());

//Indica se a API está online
app.get('/', function (req, res) {
  return res.sendStatus(200);
});

//Adiciona um novo usuário
app.post('/users', (req, res) => {
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

//Consulta informações de um Usuário
app.get('/users/:email?', (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(400).send({ error: 'Email não informado' });

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
  if (!email) return res.status(400).send({ error: 'Email não informado' });
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

//Altera informações de um Usuário
app.delete('/users/:email?', (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(400).send({ error: 'Email não informado' });

  users.deleteUser(email)
    .then((response) => {
      if (response.valid) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(JSON.stringify(response));
    })
    .catch((error) => { res.status(500).send(error) });
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

//Adiciona uma linhas
app.post('/lines', (req, res) => {
  const line = {
    line: req.body.line,
    agency: req.body.agency,
    name: req.body.name
  }

  lines.storeLine(line)
    .then((response) => {
      if (response.stored) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});

//Adiciona uma parada
app.post('/stops', (req, res) => {
  const stop = {
    stop: req.body.stop,
    address: req.body.address,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }

  stops.storeStop(stop)
    .then((response) => {
      if (response.stored) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});

//Adiciona uma rota
app.post('/routes', (req, res) => {
  const route = {
    line: req.body.line,
    route: req.body.route,
    service: req.body.service
  }

  stops.storeRoute(route)
    .then((response) => {
      if (response.stored) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});

const csvwp = require('csv-wp');
const options = {
  encoding: 'UTF-8',
  delimiter: ';'
}

async function run() {
  let stops = csvwp.getLines('../data_insertion/data/stop_sequence_csv.csv', options);

  for (let i = 1; i < stops.length-1; i++) {
    console.log(`Adicionando ${i+1} de ${stops.length-1}`);
    let route = stops[i].split(';')[0];
    let arrival = stops[i].split(';')[1];
    let departure = stops[i].split(';')[2];
    let stop = stops[i].split(';')[3];
    let sequence = stops[i].split(';')[4];
    let info = {route,arrival,departure,stop,sequence};
    console.log(info);
    try {
      await stopSequence.storeStopSequence(info);
    } catch (e) {
      console.log(e);
      break;
    } 
  }

  console.log('Total: ', stops.length-1);
}

run();

let port = process.env.PORT || '4000';
app.listen(port);
console.log('Server running on port ', port);