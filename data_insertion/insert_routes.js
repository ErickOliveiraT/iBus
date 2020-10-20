const csvwp = require('csv-wp');
const axios = require('axios');
 
const options = {
    encoding: 'UTF-8',
    delimiter: ';'
}

async function run() {
    let routes = csvwp.getLines('./data/routes_csv.csv', options);
    
    for (let i = 1; i < routes.length-1; i++) {
        let line = routes[i].split(';')[0].trim();
        let service = routes[i].split(';')[1];
        let route = routes[i].split(';')[2];
        let data = {line, service, route};
        /* let options = {
            method: 'post',
            url: 'localhost:4000/routes',
            data: JSON.stringify(data)
        } */
        console.log(`('${line}','${service}','${route}'),`);
        //axios(options);
    }
}

run();