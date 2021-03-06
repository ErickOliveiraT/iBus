const express = require('express');
const cors = require('cors');
const md5 = require('md5');
require('dotenv').config();

//Controllers
const users = require('./controllers/users');
const lines = require('./controllers/lines');
const stops = require('./controllers/stops');
const routes = require('./controllers/routes');
const vouchers = require('./controllers/vouchers');
const stopSequence = require('./controllers/stop_sequence');
const transactions = require('./controllers/transactions');
const e = require('express');
const purchases = require('./controllers/purchases');

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
      if (response.valid) return res.status(200).send(JSON.stringify(response.data));
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
      if (response.changed) return res.status(200).send(JSON.stringify(response));
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
      if (response.deleted) return res.status(200).send(JSON.stringify(response));
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

//Adiciona uma linha
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

//Adiciona um ponto de parada
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

//Consulta pontos de parada
app.get('/stops/:id?', (req, res) => {
  const stop_id = req.params.id;

  if (stop_id) {
    stops.getStop(stop_id)
      .then((response) => {
        if (!response.error) return res.status(200).send(JSON.stringify(response));
        res.status(400).send(response);
      })
      .catch((error) => { res.status(400).send(error) });
  }
  else if (!stop_id || stop_id == '') {
    stops.getStops(stop_id)
      .then((response) => {
        if (!response.error) return res.status(200).send(JSON.stringify(response));
        res.status(400).send(response);
      })
      .catch((error) => { res.status(400).send(error) });
  }
});

//Adiciona uma rota
app.post('/routes', (req, res) => {
  const route = {
    line: req.body.line,
    route: req.body.route,
    service: req.body.service
  }

  routes.storeRoute(route)
    .then((response) => {
      if (response.stored) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});

//Gera um voucher de recarga
app.get('/voucher/:value?', (req, res) => {
  if (!req.params.value) return res.status(400).send({ error: 'Valor não informado ou mal formatado' });
  const value = Number(req.params.value.replace(',', '.'));
  if (value == 0) return res.status(400).send({ error: 'O valor do voucher não por ser zero' });

  vouchers.generateVoucher(value)
    .then((response) => {
      if (!response.error) return res.status(200).send(JSON.stringify(response));
      res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});

//Utiliza um voucher de regarga
app.post('/voucher/redeem', (req, res) => {
  const voucher = req.body.voucher;
  const email = req.body.user;
  if (!voucher) return res.status(400).send({ error: 'Voucher não informado' });
  if (!email) return res.status(400).send({ error: 'Usuário não informado' });

  vouchers.redeemVoucher(voucher, email)
    .then((response) => {
      if (response.redeemed) {
        users.updateBalance(email, response.new_balance, response.voucher_value)
        .then((response) => {
          if (response.updated) return res.status(200).send(JSON.stringify(response));
          res.status(400).send(JSON.stringify(response));
        })
        .catch((error) => { res.status(500).send(error) });
      }
      else return res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});

//Consultar linhas
app.get('/lines/:stop_id?', (req, res) => {
  const stop_id = req.params.stop_id;
  
  stops.getLinesFromStop(stop_id)
  .then((response) => {
    return res.status(200).send(JSON.stringify(response));
  })
  .catch((error) => { res.status(500).send(error) });
});

//Comprar passagem
app.post('/purchase', (req, res) => {
  const email = req.body.user;
  const desc = req.body.description || null;
  if (!email) return res.status(400).send(JSON.stringify({error: 'Usuário não informado'}));
  
  purchases.buyTicket(email, desc)
  .then((response) => {
    if (response.error) res.status(500).send(JSON.stringify(response.error));
    else return res.status(200).send(JSON.stringify(response));
  })
  .catch((error) => { res.status(500).send(error) });
});

//Consultar transações
app.get('/transactions/:email?', (req, res) => {
  const email = req.params.email;
  
  transactions.getTransactions(email)
  .then((response) => {
    if (response.valid) return res.status(200).send(JSON.stringify(response.result));
    else return res.status(500).send(JSON.stringify(response.error));
  })
  .catch((error) => { res.status(500).send(error) });
});

let port = process.env.PORT || '4000';
app.listen(port);
console.log('Server running on port ', port);