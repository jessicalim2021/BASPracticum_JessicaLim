import express from 'express';
import bodyParser from 'body-parser'
import fs from 'fs'
import http from 'http'
import https from 'https'
import tls from 'tls'

const privateKeyA = fs.readFileSync("../certificates/banka.com-key.pem", "utf8")
const certificateA = fs.readFileSync("../certificates/banka.com.pem", "utf8")
const privateKeyB = fs.readFileSync("../certificates/bankb.com-key.pem", "utf8")
const certificateB = fs.readFileSync("../certificates/bankb.com.pem", "utf8")

const cert = {
    key: privateKeyA,
    cert: certificateA
}

const app = express()
const httpServer = http.createServer(app)
const httpsServer = https.createServer(cert, app)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

httpsServer.listen(6000, () => {
    console.log("Https Auth Server listening on port" , 6000)
})
app.post("/", (req, res) => {
    
    try {

        const {sender, need_info, tx, attachment} = JSON.parse(req.body.data)
        console.log(sender)
        res.json({
            info_status: "ok",
            tx_status: "ok",
            dest_info: JSON.stringify(sender)
        })
    } catch (ex) {
        console.error(ex)
    }
})

