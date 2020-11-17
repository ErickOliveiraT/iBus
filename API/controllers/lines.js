const database = require('./database');

function storeLine(line) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO bus_lines (line, agency, name) VALUES('
                + `'${line.id}', '${line.agency}', '${line.name}')`;

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

function getLineFromRoute(route) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = 'SELECT line from bus_routes WHERE route='
                + `'${route}';`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                if (!result[0]) resolve(null)
                else resolve(result[0].line);
            });
        });
    });
}

function getLine(id) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = 'SELECT * from bus_lines WHERE line='
                + `'${id}';`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                resolve({line: result[0].line, agency: result[0].agency, name: result[0].name});
            });
        });
    });
}

module.exports = {storeLine, getLineFromRoute, getLine}