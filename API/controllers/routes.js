const database = require('./database');

function storeRoute(route) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO bus_routes (line,service,route) VALUES('
                + `'${route.line}', '${route.service}', '${route.route}')`;

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

module.exports = {storeRoute}