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
ACCOUNT1='0xe23BF6F66E1c245B94fbBC73cd082a8c37ecF9e9';
ACCOUNT2='0x6216F6C5062b40A78496ebA64cb5913363DCC792';
ACCOUNT3='0x4a06cfa2E61DC45e8A49659279D34A5Cbe226caB';
RECIPIENT_ACCOUNT='0x66138EDb2543406A18F86910a5E09124BE1c843F'
transactionNum=14;
depositAmount=1;
data=[];

ACCOUNT1
ACCOUNT2
ACCOUNT3

# deploy wallet
const multiSigWallet = await MultiSigWallet.deployed()

# get owners
multiSigWallet.getOwners()

# submit a transaction - send 20 money from account 4 to account 6
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
