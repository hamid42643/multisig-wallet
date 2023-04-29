const MultiSigWallet = artifacts.require("MultiSigWallet");
const { expect } = require("chai");

contract("MultiSigWallet", (accounts) => {
  let wallet;

  const [owner1, owner2, owner3, nonOwner] = accounts;


  beforeEach(async () => {
    wallet = await MultiSigWallet.new([owner1, owner2, owner3], 2);
  });

  it("should deposit ether", async () => {
    const amount = web3.utils.toWei("1", "ether");
    const balanceBefore = await web3.eth.getBalance(wallet.address);

    await web3.eth.sendTransaction({
      from: owner1,
      to: wallet.address,
      value: amount,
    });

    const balanceAfter = await web3.eth.getBalance(wallet.address);
    expect(balanceAfter).to.equal(balanceBefore.add(amount));
  });

  it("should submit a transaction", async () => {
    const to = nonOwner;
    const value = web3.utils.toWei("1", "ether");
    const data = "0x";
    const txIndex = 0;

    await wallet.submitTransaction(to, value, data);
    const tx = await wallet.transactions(txIndex);

    expect(tx.to).to.equal(to);
    expect(tx.value.toString()).to.equal(value.toString());
    // expect(tx.data).to.equal(data);
    expect(tx.executed).to.be.false;
    expect(tx.numConfirmations.toString()).to.equal("0");
  });

  it("should confirm a transaction", async () => { 
    const to = nonOwner;
    const value = web3.utils.toWei("1", "ether");
    const data = "0x";

    await wallet.submitTransaction(to, value, data);

    await wallet.confirmTransaction(0, { from: owner1 });
    await wallet.confirmTransaction(0, { from: owner2 });

    const tx = await wallet.transactions(0);

    expect(tx.numConfirmations.toString()).to.equal("2");
    expect(await wallet.isConfirmed(0, owner1)).to.be.true;
    expect(await wallet.isConfirmed(0, owner2)).to.be.true;
    expect(await wallet.isConfirmed(0, owner3)).to.be.false;
  });

  it("should execute a transaction", async () => {
    const to = nonOwner;
    const value = web3.utils.toWei("1", "ether");
    const data = "0x";

    await wallet.submitTransaction(to, value, data);
    await wallet.confirmTransaction(0, { from: owner1 });
    await wallet.confirmTransaction(0, { from: owner2 });

    const balanceBefore = await web3.eth.getBalance(to);
    await wallet.executeTransaction(0);
    const balanceAfter = await web3.eth.getBalance(to);

    expect(balanceAfter.toString()).to.equal(
      balanceBefore.add(value).toString()
    );
    expect(await wallet.isConfirmed(0, owner1)).to.be.true;
    expect(await wallet.isConfirmed(0, owner2)).to.be.true;
    expect(await wallet.isConfirmed(0, owner3)).to.be.false;
    expect(await wallet.transactions(0)).to.include({
      executed: true,
    });
  });
});
