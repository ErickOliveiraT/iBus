const database = require('./database');
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
module.exports = {generateVoucher}