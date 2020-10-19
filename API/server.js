const express = require('express');
//const cors = require('cors');
require('dotenv').config();

const app = express();
 
app.get('/', function (req, res) {
  return res.sendStatus(200);
})
 
app.listen(3000);
console.log('Server running on port ', process.env.PORT);