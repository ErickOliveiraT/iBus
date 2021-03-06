const users = require('./users');
const transactions = require('./transactions');

function buyTicket(email, desc) {
    return new Promise(async (resolve, reject) => {
        const ticket_price = 4;
        let user_balance = null;
        try {
            const user = await users.getUser(email);
            if (!user.valid) reject({ done: false, stored: false, error: 'Usuário não encontrado'});
            const new_balance = user.data.balance - ticket_price;
            if (new_balance < 0) reject({ done: false, stored: false, error: 'Não há saldo suficiente'});
            users.updateBalance(email, new_balance);
            user_balance = new_balance;
        } catch (e) {
            reject({ done: false, stored: false, error: e }); 
        }
        
        const transaction = {
            email: email,
            value: ticket_price,
            type: 'purchase',
            desc: desc
        }
        transactions.storeTransaction(transaction)
        .then(() => {
            resolve({ done: true, stored: true, new_balance: user_balance }); 
        })
        .catch((e) => {
            reject({ done: true, stored: false, error: e }); 
        })
    });
}

module.exports = {buyTicket}