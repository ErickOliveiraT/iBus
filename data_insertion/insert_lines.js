const csvwp = require('csv-wp');
const axios = require('axios');
 
const options = {
    encoding: 'UTF-8',
    delimiter: ';'
}

async function run() {
    let lines = csvwp.getLines('./data/lines_csv.csv', options);
    
    for (let i = 1; i < lines.length-1; i++) {
        let id = lines[i].split(';')[0];
        let agency = lines[i].split(';')[1];
        let name = lines[i].split(';')[2].split(' - ')[1];
        let data = {id, agency, name};
        console.log(data);
    }
}

run();