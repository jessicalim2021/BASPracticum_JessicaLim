import StellarSdk from 'stellar-sdk'
 
 const server = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});
 
 var issuingKeys = StellarSdk.Keypair
 .fromSecret('SAEEE4UUP3DRYTEFHNFKCVB4ZCQT2W2KPFW7FLE6VLE7QABAAZATFZFD');
 
 var receivingKeys2 = StellarSdk.Keypair
 .fromSecret('SDSQ5MJALF7VWDFEFETPGGWJK2UEQ5HU6HJBKMT5M5YDJ3WYKMC5RC3O');
 
 var receivingKeys2 = StellarSdk.Keypair
 .fromSecret('SB6HTLWBKVY6KOGKFZE2EKH3ZFSIYHYXJOORGKIOHSMPHBCX4SS4PU6G');
 
 var USD = new StellarSdk.Asset('USD', 'GAIHBCB57M2SDFQYUMANDBHW4YYMD3FJVK2OGHRKKCNF2HBZIRBKRX6E');

 server.fetchBaseFee()
 .then(fee => {
     server.loadAccount(issuingKeys.publicKey())
     .then(account => {
         var transaction = new StellarSdk.TransactionBuilder(account, {
             fee,
             networkPassphrase: 'Standalone Network ; February 2017'
         })
         .addOperation(StellarSdk.Operation.payment({
             destination: receivingKeys2.publicKey(),
             asset: USD,
             amount: "1000"
         }))
         .setTimeout(100)
         .build()

         transaction.sign(issuingKeys)
         return server.submitTransaction(transaction)

     }).then((res, err) => {
       if(res) console.log("Response: ", res)
       else console.log("Error: ", res)
   })
     
 })