const database = require('./database');
const stopSequence = require('./stop_sequence');
const lines = require('./lines');

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

async function getLinesFromStop(stop) {
    return new Promise(async (resolve, reject) => {
        if (stop) {
            const routes = await stopSequence.getRoutesFromStop(stop);
            let lines_id = new Array();
            let lines_info = new Array();

            for (let i = 0; i <= routes.length; i++) {
                let line = await lines.getLineFromRoute(routes[i]);
                if (line) {
                    if (!line.error && !lines_id.includes(line)) lines_id.push(line);
                }
            }
            
            for (let i = 0; i < lines_id.length; i++) {
                let line_data = await lines.getLine(lines_id[i]);
                if (line_data) lines_info.push(line_data);
            }

            return resolve(lines_info);
        }
        
        let con = await database.getConnection();
        
        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = `SELECT * FROM bus_lines`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                let lines_info = new Array();
                result.forEach(line => {
                    lines_info.push({line: line.line, agency: line.agency, name: line.name});
                });
                resolve(lines_info);
            });
        });
    });
}

module.exports = {storeStop, getStop, getStops, getLinesFromStop}