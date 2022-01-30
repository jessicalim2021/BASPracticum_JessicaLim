import StellarSdk from 'stellar-sdk';

const server = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});

const passphrase =  'Standalone Network ; February 2017'

const MasterKey = StellarSdk.Keypair.master(passphrase)
const MasterSecret = MasterKey.secret();
const MasterPublicKey = MasterKey.publicKey();

console.log ('Master Account',MasterSecret, MasterPublicKey);

/*
Master Account 
SC5O7VZUXDJ6JBDSZ74DSERXL7W3Y5LTOAMRF7RQRL3TAGAPS7LUVG3L 
GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI

Account1 
SAEEE4UUP3DRYTEFHNFKCVB4ZCQT2W2KPFW7FLE6VLE7QABAAZATFZFD 
GAIHBCB57M2SDFQYUMANDBHW4YYMD3FJVK2OGHRKKCNF2HBZIRBKRX6E

Account2 
SDSQ5MJALF7VWDFEFETPGGWJK2UEQ5HU6HJBKMT5M5YDJ3WYKMC5RC3O 
GDW3IXTH3UFCU2KD6REURTLK7XVSUC4P4WDATMFPTW6YZFEAV7RWATAD

Account3 
SB6HTLWBKVY6KOGKFZE2EKH3ZFSIYHYXJOORGKIOHSMPHBCX4SS4PU6G 
GBETQAVAWJJIQ7CZPXWLXKZO6BELLACNR3E7BRD4WTYEANAGGR62VP6Q
*/

const pair1 = StellarSdk.Keypair.fromSecret('SAEEE4UUP3DRYTEFHNFKCVB4ZCQT2W2KPFW7FLE6VLE7QABAAZATFZFD');;
const pair2 = StellarSdk.Keypair.fromSecret('SDSQ5MJALF7VWDFEFETPGGWJK2UEQ5HU6HJBKMT5M5YDJ3WYKMC5RC3O');
const pair3 = StellarSdk.Keypair.fromSecret('SB6HTLWBKVY6KOGKFZE2EKH3ZFSIYHYXJOORGKIOHSMPHBCX4SS4PU6G');


var SecretKey1 = pair1.secret();
var PublicKey1 = pair1.publicKey();
console.log ('Account1',SecretKey1, PublicKey1);

var SecretKey2 = pair2.secret();
var PublicKey2 = pair2.publicKey();
console.log ('Account2',SecretKey2, PublicKey2);

var SecretKey3 = pair3.secret();
var PublicKey3 = pair3.publicKey();
console.log ('Account3',SecretKey3, PublicKey3);

(async function main() {

const account = await server.loadAccount(MasterPublicKey);
const fee = await server.fetchBaseFee();

 const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: passphrase})
        .addOperation(StellarSdk.Operation.createAccount({
				source: MasterPublicKey,
                destination: PublicKey1,
                startingBalance: "100000"  
            }))
		.addOperation(StellarSdk.Operation.createAccount({
				source: MasterPublicKey,
                destination: PublicKey2,
                startingBalance: "100000"
            }))
		.addOperation(StellarSdk.Operation.createAccount({
				source: MasterPublicKey,
                destination: PublicKey3,
                startingBalance: "100000"
            }))	
        .setTimeout(30)
        .build();
	
	 

	
transaction.sign(MasterKey);


    try {
        const transactionResult = await server.submitTransaction(transaction);
        console.log(transactionResult);
		
    } catch (err) {
        console.error(err);
		    }
})()


