const database = require('./database');
const token = require('./token');

function storeUser(user) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO users(name, cpf, email, birth_date, password, type, balance) VALUES('
                + `'${user.name}', '${user.cpf}', '${user.email}', '${user.birth_date}', '${user.password}',`
                + `'${user.type}', ${user.balance});`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ stored: false, error: error });
                }
                resolve({ stored: true, result: result });
            });
        });
    });
}

function authenticate(user) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ valid: false, error: err });

            var sql = `SELECT * FROM users WHERE email = '${user.email}'`

            con.query(sql, async function (err, result) {
                if (err) resolve({ valid: false, error: err });

                if (result[0] == undefined || result[0] === undefined) resolve({ valid: false, error: "Usuário não existe" });
                else {
                    if (result[0].password === user.password_hash) { //Senha certa
                        const tk = token.getJWT(user.email);
                        resolve({ valid: true, name: result[0].name, token: tk, name: result[0].name, cpf: result[0].cpf, birth_date: result[0].birth_date,
                                email: result[0].email, type: result[0].type, balance: result[0].balance });
                    }
                    else resolve({ valid: false, error: "Senha incorreta" });
                }
            });
        });
    });
}

function getUser(email) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ valid: false, error: err });

            var sql = `SELECT * FROM users WHERE email = '${email}'`;

            con.query(sql, async function (err, result) {
                if (err) resolve({ valid: false, error: err });
                if (result[0] == undefined || result[0] === undefined) resolve({ valid: false, error: "Usuário não existe" });
                else {
                    delete result[0].password;
                    resolve({valid: true, data: result[0]});
                }
            });
        });
    });
}

function alterUser(email, user) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ valid: false, error: err });

            var sql = `UPDATE users SET name='${user.name}', cpf='${user.cpf}', email='${user.email}',`
                + `birth_date='${user.birth_date}', type='${user.type}' WHERE email = '${email}'`

            con.query(sql, async function (err, result) {
                if (err) resolve({ changed: false, error: err });
                resolve({changed: true, result: result});
            });
        });
    });
}

function updateBalance(email, balance) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ valid: false, error: err });

            var sql = `UPDATE users SET balance=${balance} WHERE email='${email}'`

            con.query(sql, async function (err, result) {
                if (err) resolve({ updated: false, error: err });
                resolve({updated: true, result: result});
            });
        });
    });
}

function deleteUser(email) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ deleted: false, error: err });

            var sql = `DELETE FROM users WHERE email='${email}'`;

            con.query(sql, async function (err, result) {
                if (err) resolve({ deleted: false, error: err });
                resolve({deleted: true, result: result});
            });
        });
    });
}

module.exports = { storeUser, authenticate, getUser, alterUser, deleteUser, updateBalance }