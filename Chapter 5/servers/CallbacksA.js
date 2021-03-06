import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fetch from "node-fetch";
import http from 'http';
import https from 'https';
import fs from 'fs'


const privateKey = fs.readFileSync("../certificates/banka.com-key.pem", "utf8")
const certificate = fs.readFileSync("../certificates/banka.com.pem", "utf8")
const credentials = {
    key: privateKey,
    cert: certificate
}

const app = express();
const conString = "postgres://bankauser:password@localhost:5432/banka";
const conStringB = "postgres://bankbuser:password@localhost:5432/bankb";
const client = new pg.Client(conString);
const clientB = new pg.Client(conStringB)

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

// httpsServer.listen(5000, () => {
//     console.log("HTTPS CallbacksA Server listening on port" , 5000)
// })

// httpServer.listen(5001, () => {
//     console.log("HTTP CallbacksA Server running on port" , 5001)
// })

client.connect();
clientB.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});


app.post("/compliance/fetch_info", function (request, response) {
  console.log("request", request.body);
  console.log("request", request.body.address);
  var addressParts = request.body.address.split("*");
  var friendlyId = addressParts[0];

  // You need to create `accountDatabase.findByFriendlyId()`. It should look
  // up a customer by their Stellar account and return account information.

  clientB.query(
    "SELECT name,address,dob,domain from users where friendlyid = $1",
    [friendlyId],
    (error, results) => {
      if (error) {
        throw error;
      }
	  console.log(results.rows[0])
      if (results) {
        response.json({
          name: results.rows[0].name,
          address: results.rows[0].address,
          date_of_birth: results.rows[0].dob.toString(),
          domain: results.rows[0].domain,
        });
        response.end();
      }
    }
  );
});

app.post("/compliance/sanctions", function (request, response) {
  console.log("request", request.body.sender);
  var sender = JSON.parse(request.body.sender);
  console.log("sender", sender);

  client.query(
    "SELECT * from sanction where domain = $1",
    [sender.domain],
    (error, results) => {
      if (error) {
        response.status(403).end("FI not sanctioned");
      }
      if (results) {
        response.status(200).end();
      }
    }
  );
});

app.post("/compliance/ask_user", function (request, response) {
  console.log("request", request.body.sender);
  var sender = JSON.parse(request.body.sender);
  console.log("sender", sender);

  client.query(
    "SELECT * from sanction where domain = $1",
    [sender.domain],
    (error, results) => {
      if (error) {
        response.status(403).end("FI not sanctioned");
      }
      if (results) {
        if (results.rows[0].kyc == true) {
          response.status(200).end();
        } else {
          response.status(403).end("KYC request denied");
        }
      }
    }
  );
});

app.post("/receive", function (request, response) {
  console.log("receive request", request.body);
  var amount = parseInt(Number(request.body.amount).toFixed(2));
  var friendlyid = request.body.route;
  console.log("amount", amount, "friendlyid", friendlyid);
  // `receive` may be called multiple times for the same payment, so check that
  // you haven't already seen this payment ID.
  var SendObj = JSON.parse(request.body.data);
  var kycObj = JSON.parse(SendObj.attachment);
  client.query(
    "INSERT INTO transactions(txid, sender, receiver, amount, currency, kyc_info) VALUES ($1,$2,$3,$4,$5,$6)",
    [
      request.body.transaction_id,
      SendObj.sender,
      request.body.route,
      amount,
      request.body.asset_code,
      kycObj.transaction.sender_info,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).end("Error inserting transaction");
      }
      if (results) {
        console.log("REached here", results);
        client.query(
          "SELECT balance from users where friendlyid = $1",
          [friendlyid],
          (error, results) => {
            if (error) {
              console.log(error);
              response.status(500).end("Not found");
            }
            if (results) {
              console.log("results", results);
              var balance = Number(results.rows[0].balance);
              balance = balance + +amount;
              console.log("balance", balance);

              client.query(
                "UPDATE users set balance = $1 where friendlyid = $2",
                [balance, friendlyid],
                (error, results) => {
                  if (error) {
                    console.log(error);
                    response.status(500).end("Not found");
                  }
                  if (results) {
                    console.log(results);
                    response.status(200).end();
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

/*})})*/

app.post("/test", function (request, response) {
  fetch("http://banka.com/.well-known/stellar.toml")
    .then(function (response, error) {
      if (response) {
        console.log("response", response);
        return response.text();
      }
    })
    .then(function (data) {
      console.log("data", data);
    });
});
