const csvwp = require('csv-wp');
const axios = require('axios');
 
const options = {
    encoding: 'UTF-8',
    delimiter: ';'
}

async function run() {
    let stops = csvwp.getLines('./data/stops_csv.csv', options);
    
    for (let i = 1; i < stops.length-1; i++) {
        let stop = stops[i].split(';')[0].trim();
        let address = stops[i].split(';')[1];
        let latitude = stops[i].split(';')[2];
        let longitude = stops[i].split(';')[3];
        let data = {stop, address, latitude, longitude};
        /* let options = {
            method: 'post',
            url: 'localhost:4000/stops',
            data: JSON.stringify(data)
        } */
        console.log(`('${stop}','${address}',${latitude.replace(',','.')},${longitude.replace(',','.')}),`);
        //axios(options);
    }
}

run();