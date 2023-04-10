const {
    TopicCreateTransaction,
    Client,
    PrivateKey,
    TopicMessageQuery,
    TopicMessageSubmitTransaction
} = require("@hashgraph/sdk");
// Loads environment variables from a .env file into process.env object using the dotenv package.

require('dotenv').config();

// Configuring the treasury account
const myAccountId = process.env.ACCOUNT1_ID;
const myPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

//Throw a new error if we were unable to retrieve it.
if (myAccountId == null ||
    myPrivateKey == null) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

//Setting-up the client to interact with Hedera Test Network
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

async function main() {
    //Create a new topic
    let txResponse = await new TopicCreateTransaction().execute(client);

    //Get the receipt of the transaction
    let receipt = await txResponse.getReceipt(client);

    //Grab the new topic ID from the receipt
    let topicId = receipt.topicId;

    //Log the topic ID
    console.log(`Your topic ID is: ${topicId}`);

    // Wait 5 seconds between consensus topic creation and subscription
    await new Promise((resolve) => setTimeout(resolve, 5000));
    //Create the query to subscribe to a topic
    new TopicMessageQuery()
        .setTopicId(topicId)
        .setStartTime(0)
        .subscribe(
            client,
            (message) => console.log(Buffer.from(message.contents, "utf8").toString())
        );



    //Send the message
    let currentDate = new Date();
    let currentTime = currentDate.toLocaleTimeString();
    let currentDateString = currentDate.toDateString();

    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: `While writing the msg, the time was ${currentTime} on ${currentDateString}.`,
    }).execute(client);

    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);

    //Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log("The message transaction status: " + transactionStatus.toString());

    process.exit();
}

// The async function is being called in the top-level scope.
main();