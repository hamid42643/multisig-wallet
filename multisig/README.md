# install truffle 5.3.3
npm i truffle@5.3.3

# cp bash_profile to ~/
cp .bash_profile ~/.bash_profile
source ~/.bash_profile

# compile
truffle compile

truffle test

# deploy
truffle migirte --network ganache

# start truffle console
truffle console --network ganache

# set varibles
ACCOUNT1='0x8866153d6325c6c25DCF1fa82e5055A0Aedc85eb';
ACCOUNT2='0x383f48a3AA961414fD0944a9C477C9a4996c003A';
ACCOUNT3='0x59e59BA40e41559621EB06912BD2cfDF00d825dF';
RECIPIENT_ACCOUNT='0xDE924669c2319D05B3C3ee96464a13760D5617d1'
transactionNum=1;
depositAmount=1;
data=[];

ACCOUNT1
ACCOUNT2
ACCOUNT3

# deploy wallet
const multiSigWallet = await MultiSigWallet.deployed()

# get owners
multiSigWallet.getOwners()

# submit a transaction - send 20 to RECIPIENT_ACCOUNT
multiSigWallet.submitTransaction(RECIPIENT_ACCOUNT, web3.utils.toWei('2', 'ether'), []);

# confirm transaction
multiSigWallet.confirmTransaction(transactionNum, { from: ACCOUNT1 })
multiSigWallet.confirmTransaction(transactionNum, { from: ACCOUNT2 })
multiSigWallet.confirmTransaction(transactionNum, { from: ACCOUNT3 })

multiSigWallet.confirmTransaction(transactionNum, { from: 'deddewdewwe' })

# execute transaction
multiSigWallet.executeTransaction(transactionNum, { from: ACCOUNT1 });

# get transaction
multiSigWallet.getTransaction(transactionNum)
