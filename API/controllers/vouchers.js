const database = require('./database');
const users = require('./users');
const nanoID = require('nano-id');

function generateVoucher(value) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        let voucher = {
            voucher: nanoID(10),
            value: value,
            redeemed: 0
        }

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO vouchers (voucher,value,redeemed) VALUES('
                + `'${voucher.voucher}', ${voucher.value}, ${voucher.redeemed})`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ stored: false, error: error });
                }
                resolve({ voucher: voucher.voucher, value: voucher.value });
            });
        });
    });
}

function getVoucher(voucher) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = `SELECT * FROM vouchers WHERE voucher='${voucher}'`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                resolve(result[0]);
            });
        });
    });
}

async function redeemVoucher(voucher, email) {
    return new Promise(async (resolve, reject) => {
        const user = await users.getUser(email);
        if (!user.valid) return reject({redeemed: false, error: 'Usuário não encontrado'});
        const voucher_data = await getVoucher(voucher);
        if (!voucher_data || voucher_data.error) return reject({redeemed: false, error: 'Voucher não encontrado'});
        if (voucher_data.redeemed == 1) return reject({redeemed: false, error: 'Esse voucher já foi resgatado'});
        const new_balance = user.data.balance + voucher_data.value;
        
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = `UPDATE vouchers SET redeemed = 1,user_email = '${email}' WHERE voucher='${voucher}'`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                resolve({redeemed: true, new_balance: new_balance});
            });
        });
    });
}

module.exports = {generateVoucher,redeemVoucher}