const database = require('./database');
const token = require('./token');

function storeUser(user) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO users(name, cpf, email, birth_date, password, is_admin, balance) VALUES('
                + `'${user.name}', '${user.cpf}', '${user.email}', '${user.birth_date}', '${user.password}',`
                + `${user.is_admin}, ${user.balance});`;

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

            var sql = `SELECT password,name FROM users WHERE email = '${user.email}'`

            con.query(sql, async function (err, result) {
                if (err) resolve({ valid: false, error: err });

                if (result[0] == undefined || result[0] === undefined) resolve({ valid: false, error: "Usuário não existe" });
                else {
                    if (result[0].password === user.password_hash) { //Senha certa
                        const tk = token.getJWT(user.email);
                        resolve({ valid: true, name: result[0].name, token: tk });
                    } else { //Senha errada
                        resolve({ valid: false, error: "Senha incorreta" })
                    }
                }
            });
        });
    });
}

module.exports = { storeUser, authenticate }