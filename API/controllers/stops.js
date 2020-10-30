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

function getStop(stop_id) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = `SELECT * FROM bus_stops WHERE stop = '${stop_id}'`;

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

function getStops(stop_id) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = `SELECT * FROM bus_stops`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                resolve(result);
            });
        });
    });
}

module.exports = {storeStop, getStop, getStops}