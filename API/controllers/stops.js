const database = require('./database');

function storeStop(stop) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO bus_stops (stop,address,latitude,longitude) VALUES('
                + `'${stop.stop}', '${stop.address}', ${stop.latitude}, ${stop.longitude})`;

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

module.exports = {storeStop}