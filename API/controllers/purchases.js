const database = require('./database');
const users = require('./users');
const transactions = require('./transactions');
const { response } = require('express');

function buyTicket(email) {
    return new Promise(async (resolve, reject) => {
        const ticket_price = 4;
        try {
            const user = await users.getUser(email);
            if (!user.valid) reject({ done: false, stored: false, error: 'Usuário não encontrado'});
            const new_balance = user.data.balance - ticket_price;
            users.updateBalance(email, new_balance);
        } catch (e) {
            reject({ done: false, stored: false, error: e }); 
        }
        
        const transaction = {
            email: email,
            value: ticket_price,
            type: 'purchase'
        }
        transactions.storeTransaction(transaction)
        .then(() => {
            resolve({ done: true, stored: true }); 
        })
        .catch((e) => {
            reject({ done: true, stored: false, error: e }); 
        })
    });
}

module.exports = {buyTicket}