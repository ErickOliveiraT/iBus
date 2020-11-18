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

module.exports = {storeTransaction}