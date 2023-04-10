/*
The following code is to Transfer 1.35 AXDTEST token to account 3 on 
Hedera Hashgraph test network using javascript sdk 
provided by Hedera Hashgraph.
*/

const {
    TransferTransaction,
    Client,
    Wallet,
    AccountBalanceQuery,
    PrivateKey

} = require("@hashgraph/sdk");
// Loads environment variables from a .env file into process.env object using the dotenv package.

require('dotenv').config();

// send token from the treasury Account
const treasuryAccountId = process.env.ACCOUNT1_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);
// send token to account3
const recipientId = process.env.ACCOUNT3_ID;
const recipientPrivateKey = PrivateKey.fromString(process.env.ACCOUNT3_PRIVATE_KEY);

const tokenId = process.env.TOKEN_ID;

//Throw a new error if we were unable to retrieve it.
if (treasuryAccountId == null ||
    treasuryPrivateKey == null) {
    throw new Error("Environment variables treasuryAccountId and treasuryPrivateKey must be present");
}

//Throw a new error if we were unable to retrieve it.
if (recipientId == null ||
    recipientPrivateKey == null) {
    throw new Error("Environment variables recipientId and recipientPrivateKey must be present");
}


//Setting-up the client to interact with Hedera Test Network
const client = Client.forTestnet();

client.setOperator(treasuryAccountId, treasuryPrivateKey);

const account3Wallet = new Wallet(
    recipientId,
    recipientPrivateKey
);



async function main() {

    
    // how much ammount you want to sent
    var transferAmmount = 135
    console.log(`############################################ Transferring 1.35 AXDTEST TO ACCOUNT3 ####################################################`)

    //TRANSFER STABLECOIN FROM TREASURY TO ALICE
    const tokenTransferTx = await new TransferTransaction()
        .addTokenTransfer(tokenId, client.operatorAccountId, -(transferAmmount))
        .addTokenTransfer(tokenId, account3Wallet.accountId, transferAmmount)
        .freezeWith(client)

    //Sign with the sender account private key
    const signTx = await tokenTransferTx.sign(treasuryPrivateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    console.log(`\n- Stablecoin transfer from Treasury to account3: ${transactionStatus} \n`);
    console.log(`Transaction ID: ${txResponse.transactionId}`);

    //BALANCE CHECK
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryAccountId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(recipientId).execute(client);
    console.log(`- Recipient's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    process.exit();

}
// The async function is being called in the top-level scope.
main();