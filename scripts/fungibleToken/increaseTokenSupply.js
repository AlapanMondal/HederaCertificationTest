/*
The following code is to increase token supply by account 2 on 
Hedera Hashgraph test network using javascript sdk 
provided by Hedera Hashgraph.
*/

const {
    TokenMintTransaction,
    Client,
    TokenInfoQuery,
    PrivateKey
} = require("@hashgraph/sdk");
// Loads environment variables from a .env file into process.env object using the dotenv package.

require('dotenv').config();

//Configuring account2 as the supply account 
const supplyAccountId = process.env.ACCOUNT2_ID;
const supplyPrivateKey = PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY);

//Throw a new error if we were unable to retrieve it.
if (supplyAccountId == null || supplyPrivateKey == null) {
    throw new Error("Environment variables supplyAccountId and suppkyPrivateKey must be present");
}

const tokenId = process.env.TOKEN_ID;

if (tokenId == null) {
    throw new Error("Environment tokenId must be present");
}

//Setting-up the client to interact with Hedera Test Network
const supplyClient = Client.forTestnet();

supplyClient.setOperator(supplyAccountId, supplyPrivateKey);

async function main() {
    //Create the transaction and freeze for manual signing
    const transaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(14950) //Maximum Supply - Initial Supply (500.00-350.50)
        .freezeWith(supplyClient);

    //Sign the transaction with the client, who is set as admin and treasury account
    const signTx = await transaction.sign(supplyPrivateKey);

    //Submit the signed transaction to a Hedera network
    const txResponse = await signTx.execute(supplyClient);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(supplyClient);

    //Get the transaction consensus status
    const transactionStatus = receipt.status.toString();

    console.log("The transaction consensus status is " + transactionStatus);

    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    //Sign with the client operator private key, submit the query to the network and get the token supply

    const name = await queryTokenFunction("name", tokenId);
    const symbol = await queryTokenFunction("symbol", tokenId);
    const tokenSupply = await queryTokenFunction("totalSupply", tokenId);
    const maxSupply = await queryTokenFunction("maxSupply", tokenId);
    console.log(``)
    console.log(`- The total supply of the ${name} token is: ${tokenSupply} ${symbol} \n- Maximum supply of ${name} is = ${maxSupply} ${symbol}`);

    supplyClient.close()
}

async function queryTokenFunction(functionName, tokenId) {
    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    console.log(functionName);
    const body = await query.execute(supplyClient);

    //Sign with the client operator private key, submit the query to the network and get the token supply
    let result;
    if (functionName === "name") {
        result = body.name;
    } else if (functionName === "symbol") {
        result = body.symbol;
    } else if (functionName === "maxSupply") {
        result = body.maxSupply;
    } else if (functionName === "totalSupply") {
        result = body.totalSupply;
    } else {
        return;
    }

    return result
}

// The async function is being called in the top-level scope.
main();
