# multisig-wallet
Ethereum multisig wallet



npx create-react-app webapp


npm install truffle

truffle init

truffle compile

npm install chai


<!-- deploy contract -->
truffle migrate --network ganache


<!-- interact -->
truffle console --network ganache


<!-- Inside the console, you can access the MultiSigWallet contract instance using the following command: -->
const multiSigWallet = await MultiSigWallet.deployed();


<!-- You can then call any function of the MultiSigWallet contract using the multiSigWallet instance. For example, to submit a new transaction, you can use the submitTransaction function as follows:  -->

multiSigWallet.submitTransaction("0xDE924669c2319D05B3C3ee96464a13760D5617d1", 1, data, { from: "0x2603BFBA3160f17E3084dB37c329E25eC0D96601" });

<!-- To get the list of owners:  -->
MultiSigWallet.deployed().then(function(instance) {return instance.getOwners();})

<!-- To submit a transaction to account 4:  -->
MultiSigWallet.deployed().then(function(instance) {return instance.submitTransaction("0xDE924669c2319D05B3C3ee96464a13760D5617d1", web3.utils.toWei('0.001', 'ether'), []);})

<!-- To confirm a transaction:  -->
MultiSigWallet.deployed().then(function(instance) {return instance.confirmTransaction(TX_INDEX, {from: OWNER_ADDRESS});})

<!-- To execute a transaction:  -->
MultiSigWallet.deployed().then(function(instance) {return instance.executeTransaction(TX_INDEX);})

