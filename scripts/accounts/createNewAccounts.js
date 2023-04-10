/*
The following code is to create 5 Hedera testnet accounts on 
Hedera Hashgraph test network using javascript sdk 
provided by Hedera Hashgraph.
*/

const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar
} = require("@hashgraph/sdk");

// Reading the environment variables
console.log(`- Reading the environment variables`);
require("dotenv").config();
console.log(`- Read the environment variables`);

// Getting the portal account ID and private key from the .env file
const portalAccountId = process.env.PORTAL_ACCOUNT_ID;
const portalPrivateKey = process.env.PORTAL_ACCOUNT_PRIVATE_KEY;

//Checking if the accounts and private key exist
if (portalAccountId == null || portalPrivateKey == null) {
  throw new Error("The environment variables portalAccountId and portalPrivateKey are missing or having issue getting the variables");
}

// Creating connection to the Hedera thest network
console.log(`Connecting the Client to Hedera Testnet`);
const client = Client.forTestnet();

console.log(``);

// Setting portal account as the client
client.setOperator(portalAccountId, portalPrivateKey);

//Defining the function to create new accounts
async function createAccounts() {

  console.log(``);
  console.log(`Copy and paste the following account credentials to .env file`);
  console.log(``);

  // Creating 5 new accounts
  const newAccounts = [];
  for (let i = 1; i < 6; i++) {
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // Create a new account with 500 Hbar starting balance
    const newAccount = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(new Hbar(500))
      .execute(client);

    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log(`#===============================================================================================================`);
    console.log(`#========================================ACCOUNT${i} Credential ===================================================`);
    console.log(`#===============================================================================================================`);

    console.log(`ACCOUNT${i}_ID = ${newAccountId}`);
    console.log(`ACCOUNT${i}_PUBLIC_KEY = ${newAccountPublicKey}`);
    console.log(`ACCOUNT${i}_PRIVATE_KEY = ${newAccountPrivateKey}`);

    // Add the new account to the list of created accounts
    newAccounts.push(newAccountId);
  }
  console.log(``);
  console.log(`Copy and paste the above account credentials to .env file`);
  console.log(``);
  console.log(`- Loading the balances for all the accounts`);
  console.log(``);

  // Query the balances of the new accounts
  for (const newAccountId of newAccounts) {
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(newAccountId)
      .execute(client);

    console.log(`The balance for Account${newAccountId}: ${accountBalance.hbars}`);

    console.log(`All account Info for the account ${newAccountId}`);
    console.log(JSON.stringify(accountBalance));
    console.log(``);

  }
  client.close()
}

// Calling the async function at the top-level scope
createAccounts();
