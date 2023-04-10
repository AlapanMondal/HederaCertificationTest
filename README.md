# Hedera Certification Test

This project is a Node.js based application that provides a set of scripts to interact with the Hedera Hashgraph test network. The scripts are designed to perform various actions such as creating new accounts, transferring HBAR, querying account information, creating and managing fungible tokens, multi-signature transactions, consensus, scheduling transactions, and interacting with smart contracts.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Hedera Hashgraph account
- Hedera Hashgraph Testnet account (for testing)

### Installation

- Clone this repository or download the code as a zip file.
`git clone https://github.com/AlapanMondal/HederaCertificationTest.git`
- Go to the `hedera-certification-test` directory: `cd HederaCertificationTest`
- Install dependencies by running `npm install`.
- Create a `.env` file in the root directory of the project and add your Hedera Hashgraph account details.
- Run the scripts by executing `npm run <script-name>` (replace `<script-name>` with the name of the script you want to execute).

## Usage

To use this application, you'll need to have Node.js and the @hashgraph/sdk and dotenv modules installed. Once you have those dependencies installed, you can clone this repository and run the scripts using the `npm run` command.

Here are the available scripts:

### Account Scripts

- `npm run createNewAccounts`: Create new accounts


### Fungible Token Scripts

- `npm run createToken`: Create a new fungible token
- `npm run associateAccounts`: Associate accounts with a token
- `npm run increaseTokenSupply`: Increase token suppl
- `npm run transferTokenToMultipleAccounts`: Transfer a token to multiple accounts
- `npm run pauseToken`: Pause a token
- `npm run transferToken`: Transfer a token
- `npm run unPauseToken`: Unpause a token
- `npm run transferToken`: Transfer a token
- `npm run queryToken`: Query token information

### Multi-Signature Scripts

- `npm run multiSign`: Perform a multi-signature transaction

### Scheduled Transactions Scripts

- `npm run scheduleTxn`: Schedule a transaction

### Smart Contract Scripts

- `npm run smartContract`: Interact with a smart contract

### Consensus Scripts

- `npm run consensus`: Perform a consensus transaction

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

