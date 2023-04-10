const {
    ScheduleSignTransaction,
    Client,
    PrivateKey
} = require("@hashgraph/sdk");

// Loading values from ennvironment file
require('dotenv').config({path: '../artifacts/.env'});

// Fetch Account2 Id and private key and  put down it as otherAccountId
const otherAccountId = process.env.Account2_Id;
const otherPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const scheduleId = process.env.SCHEDULE_ID;

// Validating otherAccountId and otherPrivateKey for null value
if (otherAccountId == null ||
    otherPrivateKey == null ) {
    throw new Error("Environment variables otherAccountId and otherPrivateKey must be present");
}

// Create our connection to the Hedera network
const client = Client.forTestnet();
client.setOperator(otherAccountId, otherPrivateKey);


// Define submitSignature() function to submit the signature
async function submitSignature() {
    console.log(`################################# Sumbitting Signature #################################`);

    //Create the transaction
    const transaction = await new ScheduleSignTransaction()
        .setScheduleId(scheduleId)
        .freezeWith(client)
        .sign(otherPrivateKey);

    

    //Sign with the client and submit to a Hedera network
    const txResponse = await transaction.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is " +transactionStatus);
    console.log(`Transaction ID: ${txResponse.transactionId}`);
}

// Call submitSignature() function to execute program
submitSignature();