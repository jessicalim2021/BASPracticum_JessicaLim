import StellarSdk from "stellar-sdk"
const server = new StellarSdk.Server("http://localhost:8000", {allowHttp: true})

var issuingKeys = StellarSdk.Keypair.fromSecret("SAEEE4UUP3DRYTEFHNFKCVB4ZCQT2W2KPFW7FLE6VLE7QABAAZATFZFD")

var receivingKeys1 = StellarSdk.Keypair.fromSecret('SDSQ5MJALF7VWDFEFETPGGWJK2UEQ5HU6HJBKMT5M5YDJ3WYKMC5RC3O');
 
var receivingKeys2 = StellarSdk.Keypair.fromSecret('SB6HTLWBKVY6KOGKFZE2EKH3ZFSIYHYXJOORGKIOHSMPHBCX4SS4PU6G');
// var Asset = new StellarSdk.Asset("", "GAIHBCB57M2SDFQYUMANDBHW4YYMD3FJVK2OGHRKKCNF2HBZIRBKRX6E")
var USD = new StellarSdk.Asset("USD", "GAIHBCB57M2SDFQYUMANDBHW4YYMD3FJVK2OGHRKKCNF2HBZIRBKRX6E") // Make sure to use the public key of the issuing account!

server.fetchBaseFee()
.then((fee) => {
    console.log("Fee is ", fee)
    server.loadAccount(receivingKeys1.publicKey())
    .then((account) => {
        try{
            var transaction = new StellarSdk.TransactionBuilder(account, {
                fee,
                networkPassphrase: 'Standalone Network ; February 2017',
            })
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: USD,
                limit: "1000000",
                source: receivingKeys1.publicKey()
            }))
            .setTimeout(100)
            .build()

            transaction.sign(receivingKeys1)
            return server.submitTransaction(transaction)

        } catch (err) {
            console.error("Error! ", err.response.data.extras)
        }
    }).catch(err => {
        console.error(err.response.data.extras)
    })
})


server.fetchBaseFee()
.then((fee) => {
    console.log("Fee is ", fee)
    server.loadAccount(receivingKeys2.publicKey())
    .then((account) => {
        try{
            
            var transaction = new StellarSdk.TransactionBuilder(account, {
                fee,
                networkPassphrase: 'Standalone Network ; February 2017',
            })
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: USD,
                limit: "1000000",
                source: receivingKeys2.publicKey()
            }))
            .setTimeout(100)
            .build()

            transaction.sign(receivingKeys2)
            return server.submitTransaction(transaction)

        } catch (err) {
            console.error("Error! ", err.response.data.extras)
        }
    }).catch(err => {
        console.error(err.response.data.extras)
    })
})

