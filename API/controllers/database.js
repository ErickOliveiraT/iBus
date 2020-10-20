const mysql = require('mysql');
const cred = require('../credentials.js');

async function getConnection() {
    return mysql.createConnection({
        host: cred.host,
        user: cred.user,
        password: cred.password,
        database: cred.database
    });
}

module.exports = {getConnection}