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
// send token to account3 and account4
const account3Id = process.env.ACCOUNT3_ID;
const account3PrivateKey = PrivateKey.fromString(process.env.ACCOUNT3_PRIVATE_KEY);
const account4Id = process.env.ACCOUNT4_ID;
const account4PrivateKey = PrivateKey.fromString(process.env.ACCOUNT4_PRIVATE_KEY);

const tokenId = process.env.TOKEN_ID;

//Throw a new error if we were unable to retrieve it.
if (treasuryAccountId == null ||
    treasuryPrivateKey == null) {
    throw new Error("Environment variables treasuryAccountId and treasuryPrivateKey must be present");
}

//Throw a new error if we were unable to retrieve it.
if (account3Id == null ||
    account3PrivateKey == null) {
    throw new Error("Environment variables account3Id and account3PrivateKey must be present");
}

//Throw a new error if we were unable to retrieve it.
if (account4Id == null ||
    account4PrivateKey == null) {
    throw new Error("Environment variables account4Id and account4PrivateKey must be present");
}

//Setting-up the client to interact with Hedera Test Network
const client = Client.forTestnet();

client.setOperator(treasuryAccountId, treasuryPrivateKey);

const account3Wallet = new Wallet(
    account3Id,
    account3PrivateKey
);

const account4Wallet = new Wallet(
    account4Id,
    account4PrivateKey
);


async function main() {
    console.log(`############################################# Transferring Token to Account 3 and Account 4 #############################################\n`);

    // Set the ammount you want to transfer
    var transferAmmount = 2525
    //TRANSFER STABLECOIN FROM TREASURY TO ALICE
    const tokenTransferTx = await new TransferTransaction()
        .addTokenTransfer(tokenId, client.operatorAccountId, -(transferAmmount * 2))
        .addTokenTransfer(tokenId, account3Wallet.accountId, transferAmmount)
        .addTokenTransfer(tokenId, account4Wallet.accountId, transferAmmount)
        .freezeWith(client)

    //Sign with the sender account private key
    const signTx = await tokenTransferTx.sign(treasuryPrivateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    console.log(`\n- Status for Stablecoin transfer from Treasury to account3 and account 4: ${transactionStatus} \n`);

    console.log(`\n- Transaction Id: ${txResponse.transactionId} \n`);

    //BALANCE CHECK
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryAccountId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(account3Id).execute(client);
    console.log(`- Account3's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(account4Id).execute(client);
    console.log(`- Account4's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    process.exit();

}
// The async function is being called in the top-level scope.
main();