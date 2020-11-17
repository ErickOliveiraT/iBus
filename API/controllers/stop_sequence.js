const database = require('./database');

function storeStopSequence(info) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO stop_sequence (route,stop,stop_sequence,arrival,departure) VALUES('
                + `'${info.route}', '${info.stop}', ${info.sequence}, '${info.arrival}', '${info.departure}')`;

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

function getRoutesFromStop(stop) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            sql = 'SELECT route from stop_sequence WHERE stop='
                + `'${stop}';`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                let routes = new Array();
                result.forEach(data => {
                    routes.push(data.route);
                });
                resolve(routes);
            });
        });
    });
}

module.exports = {storeStopSequence, getRoutesFromStop}