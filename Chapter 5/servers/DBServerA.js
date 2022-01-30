import express from "express";
import bodyParser from 'body-parser'
import pg from "pg"
import requestObj from 'request'
import {v4 as uuidv4} from 'uuid'
const app = express();

const conString = "postgres://bankauser:password@localhost:5432/banka";
const conStringB = "postgres://bankbuser:password@localhost:5432/bankb"
//const compString = "postgres://bank1:bank1@localhost:5432/compliancea";
//const fetch = require('node-fetch');
const client = new pg.Client(conString);
const clientB = new pg.Client(conStringB);
//const bankclient = new pg.Client(compString);
client.connect();
clientB.connect()
//bankclient.connect();
const USD = 'USD';
const issuer = 'GAIHBCB57M2SDFQYUMANDBHW4YYMD3FJVK2OGHRKKCNF2HBZIRBKRX6E';
var txid = uuidv4()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var server = app.listen(process.env.PORT || 3600, function() {
    var port = server.address().port;
    console.log("App now running on port", port);

});



app.post('/userdet', function(request, response) {
    console.log("request", request.body.friendlyid);
    var idParts = request.body.friendlyid.split('*');
    var friendlyId = idParts[0];
    const domain = idParts[1]
    console.log("ID", friendlyId, request.body.friendlyid);
    // You need to create `accountDatabase.findByFriendlyId()`. It should look
    // up a customer by their Stellar account and return account information.

    client.query('SELECT name,address,dob,balance from users where friendlyid = $1 AND domain = $2', [friendlyId, domain], (error, results) => {
        if (error) {
            throw error
        }

        if (results && results.rows[0]) {
            response.json({
                name: results.rows[0].name,
                address: results.rows[0].address,
                date_of_birth: results.rows[0].dob,
                balance: results.rows[0].balance
            });

            response.end();

        } else {
            console.error("userdet: No matching user")
            response.statusMessage = "Could not find any matching user"
            response.status(500).send("Could not find any matching user")
        }
    });
});

app.post('/userbal', function(request, response) {
    console.log("request", request.body.friendlyid);
    var idParts = request.body.friendlyid.split('*');
    var friendlyId = idParts[0];

    // You need to create `accountDatabase.findByFriendlyId()`. It should look
    // up a customer by their Stellar account and return account information.

    client.query('SELECT balance from users where friendlyid = $1', [friendlyId], (error, results) => {
        if (error) {
            throw error
        }

        if (results && results.rows[0]) {
            response.json({
                balance: results.rows[0].balance
            });
            //client.end();			  
            response.end();

        } else {
            console.error("userbal: No matching user")
            response.statusMessage = "Could not find any matching user"
            response.status(500).send("Could not find any matching user")
        }
    });
});



app.post('/payment', function(request, response) {

    console.log(request.body)
    var receiverName = request.body.receiver.split('*')[0];
    var receiverDomain = request.body.receiver.split('*')[1];
    var senderName = request.body.account.split("*")[0]
    var senderDomain = request.body.account.split("*")[1]
    if(receiverName == senderName) {
        console.error("You cannot be sending to yourself")
        response.status(500).json({
            msg: "ERROR",
            error_msg: "You cannot send to yourself"
        }).end()
        return
    }
    console.log(receiverName)
    console.log(senderName)
    clientB.query('SELECT * from users where friendlyid = $1 AND domain = $2', [senderName, senderDomain], (error, results) => {
        if (error) {
            response.status(500).send(error);
            return;
        }
        if (results && results.rows[0]) {
            const senderDetails = results.rows[0]
            const balance = results.rows[0].balance;

            if (balance < Number(request.body.amount)) {
                console.error("Insufficient Balance")
                response.statusMessage = "Insufficient Balance!"
                response.status(500).send(
                    "Insufficient balance!"
                );
                return;
            }
            client.query("SELECT * FROM users WHERE friendlyid = $1 and domain = $2", [receiverName, receiverDomain], (err, results) => {
                if(err){
                    console.error(err)
                }
                if(results && results.rows.length == 0){
                    response.statusMessage="Invalid receiver"
                    response.status(500).send("Invalid receiver")
                    return;
                }
                console.log(results.rows[0])
                requestObj.post({
                    url: 'http://localhost:8006/payment',
                    form: {
                        id: txid,
                        amount: request.body.amount,
                        asset_code: USD,
                        asset_issuer: issuer,
                        destination: request.body.receiver,
                        sender: request.body.account,
                        use_compliance: true
                    }
                }, function(err, res, body) {
                    
                    // txid++;
                    txid = uuidv4()
                    if (err || res.statusCode !== 200) {
                        console.error('ERROR!', err || body);
                        response.json({
                            result: body,
                            msg: "ERROR!",
                            error_msg: err
                        });
                        response.end();
                    } else {
                        console.log('SUCCESS!', body);
                        if (results) {
                            var balance = Number(senderDetails.balance)
                            balance = balance + -request.body.amount;
                            console.log("balance", balance);

                            clientB.query('UPDATE users set balance = $1 where friendlyid = $2', [balance, senderName], (error, results) => {

                                if (error) {
                                    console.log(error);
                                    response.status(500).end("User Not found");
                                }

                                if (results) {
                                        
                                    const kycInfo = {
                                        name: senderDetails.name,
                                        address: senderDetails.address,
                                        dob: senderDetails.dob,
                                        friendlyid: senderDetails.friendly,
                                        //sanction: row.sanction,
                                        balance: senderDetails.balance,
                                        domain: senderDetails.domain
                                    }
                                    console.log("amount: ", request.body)
                                    clientB.query("INSERT INTO transactions(txid, sender, receiver, amount, currency, kyc_info) values($1, $2, $3, $4, $5, $6)",
                                    [txid, request.body.account, request.body.receiver, parseInt(request.body.amount), "XLM", 
                                    JSON.stringify(kycInfo)], (err, results) => {
                                        if(err) {
                                            console.error(err)
                                            response.status(500).end("Unable to insert transaction. User not found?")
                                        }
                                        if(results.rowCount > 0){
                                            response.json({
                                                result: body,
                                                msg: 'SUCCESS!'
                                            });
                                            console.log("Next txid", txid);
                                            response.status(200).end();
                                        }
                                    })

                                    
                                }

                            })
                        }
                    }
                });
            })
        } else {
            console.error("payment: No matching user")
            response.statusMessage = "Could not find any matching user"
            response.status(500).send("Could not find any matching user")
        }
    })
});



app.get('/bankuser', function(request, response) {


    client.query('SELECT * from transactions', (error, results) => {
      
        if (error) {
          console.error(err)
            // throw error
        }

        if (results) {
            response.json({
                tx: results.rows
            });
            response.end();
        }
    })
});