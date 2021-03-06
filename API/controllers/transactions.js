const database = require('./database');

function storeTransaction(transaction) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        const now = new Date();
        let datetime = now.toLocaleString().replace('T',' ').split('.')[0];

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO transactions (user_email, done_at, value, type) VALUES('
                + `'${transaction.email}', '${datetime}', ${transaction.value}, '${transaction.type}')`;
            if (transaction.desc) {
                sql = 'INSERT INTO transactions (user_email, done_at, value, type, description) VALUES('
                + `'${transaction.email}', '${datetime}', ${transaction.value}, '${transaction.type}', '${transaction.desc}')`;
            }

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

function getTransactions(email) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ valid: false, error: err });

            let sql = 'SELECT * from transactions where user_email='
                + `'${email}';`;

            con.query(sql, function (err, result) {
                if (err) {
                    return reject({ valid: false, error: err });
                }
                resolve({ valid: true, result: result });
            });
        });
    });
}

module.exports = {storeTransaction, getTransactions}