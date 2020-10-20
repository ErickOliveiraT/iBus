const csvwp = require('csv-wp');
 
const options = {
    encoding: 'UTF-8',
    delimiter: ';'
}

async function run() {
    let stops = csvwp.getLines('./data/stop_sequence_csv.csv', options);
    
    for (let i = 1; i < stops.length-1; i++) {
        let route = stops[i].split(';')[0];
        let arrival = stops[i].split(';')[1];
        let departure = stops[i].split(';')[2];
        let stop = stops[i].split(';')[3];
        let sequence = stops[i].split(';')[4];
        console.log(`(${stop},${arrival},${departure}),${route},${sequence}`);
    }
}

run();