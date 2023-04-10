/*
The following code is to query status of fungible tokens on 
Hedera Hashgraph test network using javascript sdk 
provided by Hedera Hashgraph.
*/

const {
    Client,
    TokenInfoQuery,
    PrivateKey
} = require("@hashgraph/sdk");
// Loads environment variables from a .env file into process.env object using the dotenv package.
console.log(`Reading the environment variables`);
require("dotenv").config();
console.log(`Read the environment variables`);

// Configure the treasury account
const treasuryAccountId = process.env.ACCOUNT1_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const tokenId = process.env.TOKEN_ID;

//Setting-up the client to interact with Hedera Test Network
const client = Client.forTestnet();

client.setOperator(treasuryAccountId, treasuryPrivateKey);

//Throw a new error if we were unable to retrieve it.
if (treasuryAccountId == null ||
    treasuryPrivateKey == null) {
    throw new Error("Environment variables treasuryAccountId and treasuryPrivateKey must be present");
}


async function main() {
    const tokenInfo = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
    const { totalSupply, pauseKey, pauseStatus } = tokenInfo;

    console.log(`\nThe status for the token with ID ${tokenId} is : \n  - Token supply: ${totalSupply} \n  - Pause key: ${pauseKey} \n  - Is paused: ${pauseStatus}`);

    process.exit();
}


main()