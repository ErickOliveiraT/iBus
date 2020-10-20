const database = require('./database');
const jwt = require('jsonwebtoken');
const cred = require('../credentials');

//Generate a Json Web Token
function getJWT(login) {
    const token = jwt.sign({login: login}, cred.secret, {expiresIn: 2592000});
    return token;
}

//Get owner of a Json Web Token
function getJWTOwner(token) {
    let owner = null;
    jwt.verify(token, cred.secret, (err, dec) => {
        if (err) return err;
        owner = dec.login;
    });
    return owner;
}

//Check if a JWT belongs to an user
async function checkJWT(user, token) {
    try {
        const owner = await getJWTOwner(token);
        if (!owner || owner == null || owner == undefined || owner === undefined) return false;
        return (owner==user);
    } catch {
        return false;
    }
}


// Check API Key
function checkAPIKey(user, api_key) {
    /* return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        
        con.connect(function(err) {
            if (err) reject(false);
            let qry = `SELECT api_key FROM users WHERE login = '${user}'`;
            con.query(qry, function (err, result, fields) {
              if (err) return reject(false);
              resolve(result[0].api_key == api_key);
            });
        });
    }); */
}

module.exports = {checkAPIKey, checkJWT, getJWTOwner, getJWT}