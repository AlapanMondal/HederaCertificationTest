/*
Use Account1 as a treasury account so that Account2 can spend 20 Hbar on behalf of Account1.

Create a transaction that transfers the 20Hbars to Account3. 

Re-run the same operation and show that the allowance has been used and that the second transaction fails. 
*/

const { Client,
    PrivateKey,
    Hbar,
    TransferTransaction,
    AccountAllowanceApproveTransaction,
    AccountBalanceQuery,
    TransactionId
} = require("@hashgraph/sdk");

// Loads environment variables from a .env file into process.env object using the dotenv package.
require('dotenv').config();

// Configuring the treasury account
const treasuryAccountId = process.env.ACCOUNT1_ID;
const myPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

//Account 2 can spend on behlaf of the treasury account
const account2_Id = process.env.ACCOUNT2_ID;
const account2_pvKey = PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY);

//Also we need to transfer HBAR to the account 3
const account3_Id = process.env.ACCOUNT3_ID;

//Throw a new error if we were unable to retrieve it.
if (treasuryAccountId == null || myPrivateKey == null) {
    throw new Error("Environment variables treasuryAccountId and myPrivateKey must be present");
}

//Throw a new error if we were unable to retrieve it.
if (account2_Id == null || account2_pvKey == null) {
    throw new Error("Environment variables account2_Id and account2_pvKey must be present");
}

//Throw a new error if we were unable to retrieve it.
if (account3_Id == null) {
    throw new Error("Environment variable account3_Id must be present");
}

// Create our connection to the Hedera network
const client = Client.forTestnet();

client.setOperator(treasuryAccountId, myPrivateKey);
async function transferHbar() {
    //specifying the ammount to be allowed to spend
    let allowedAmmount = 20
    // Approve account2 to spend 20Hbar on behalf of account1
    const allowBal = new Hbar(allowedAmmount);
    console.log(`################################# Approve account2 to spend 20Hbar on behalf of account1##########################`);
    const allowanceTx = new AccountAllowanceApproveTransaction()
        .approveHbarAllowance(treasuryAccountId, account2_Id, allowBal)
        .freezeWith(client);
    const allowanceSign = await allowanceTx.sign(myPrivateKey);
    const allowanceSubmit = await allowanceSign.execute(client);
    const allowanceRx = await allowanceSubmit.getReceipt(client);
    console.log(`- Allowance approval status: ${allowanceRx.status}`);


    // Querying treasury account balance
    await queryAccountBalance(treasuryAccountId)
    console.log(``);

    // Querying account 2 balance
    await queryAccountBalance(account2_Id)
    console.log(``);

    // Querying account 3 balance
    await queryAccountBalance(account3_Id)
    console.log(``);

    // Account2 performing allowance transfer from account1 to account3
    console.log("###########################################  Account2 performing allowance transfer from account1 to account3 ########################################### ");

    //specifying the ammount to be transferred
    let transferAmmount = 20
    const sendBal = new Hbar(transferAmmount);
    const allowanceSendTx = await new TransferTransaction()
        .addApprovedHbarTransfer(treasuryAccountId, sendBal.negated())
        .addHbarTransfer(account3_Id, sendBal)
        .setTransactionId(TransactionId.generate(account2_Id)) // Spender must generate the TX ID or be the client
        .freezeWith(client);
    //Sign the transaction with the account 2 private key    
    const approvedSendSign = await allowanceSendTx.sign(account2_pvKey);
    const approvedSendSubmit = await approvedSendSign.execute(client);
    const approvedSendRx = await approvedSendSubmit.getReceipt(client);

    console.log(`- Allowance transfer status: ${approvedSendRx.status}`);

    /// Querying treasury account balance
    await queryAccountBalance(treasuryAccountId)
    console.log(``);

    // Querying account 2 balance
    await queryAccountBalance(account2_Id)
    console.log(``);

    // Querying account 3 balance
    await queryAccountBalance(account3_Id)
    console.log(``);

    // Again try to transfer 20 Hbar from account2 to account3
    console.log("########################################### Again try to transfer 20 Hbar from account2 to account3 ########################################");
    const allowanceSendTx1 = await new TransferTransaction()
        .addApprovedHbarTransfer(treasuryAccountId, sendBal.negated())
        .addHbarTransfer(account3_Id, sendBal)
        .setTransactionId(TransactionId.generate(account2_Id)) // Spender must generate the TX ID or be the client
        .freezeWith(client);
    const approvedSendSign1 = await allowanceSendTx1.sign(account2_pvKey);
    const approvedSendSubmit1 = await approvedSendSign1.execute(client);
    const approvedSendRx1 = await approvedSendSubmit1.getReceipt(client);

    console.log(`- Allowance transfer transaction id: ${approvedSendSubmit1.TransactionId} failed with status ${approvedSendRx1.status.toString()}.`);
}

async function queryAccountBalance(accountId) {
    const query = new AccountBalanceQuery()
        .setAccountId(accountId);
    const accountBalance = await query.execute(client);
    console.log(`- The account balance for account ${accountId} is ${accountBalance.hbars} HBar`);
}
transferHbar();
