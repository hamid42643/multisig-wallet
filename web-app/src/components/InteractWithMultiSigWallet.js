import React, { useState, useMemo } from 'react';
import { getWeb3, getContract } from '../ethereum/utils';
import { Button, Form, Input } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';


const InteractWithMultiSigWallet = () => {
  const web3 = useMemo(() => getWeb3(), []);
  const [transactionIndex, setTransactionIndex] = useState('');
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('');
  const { address } = useParams();


  const multiSigWallet = useMemo(() => getContract(web3, address), [web3, address]);

  const onSubmitTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await multiSigWallet.methods
        .submitTransaction(to, value, web3.utils.asciiToHex(data))
        .send({ from: accounts[0] });

      console.log('Transaction submitted');
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  const onConfirmTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await multiSigWallet.methods
        .confirmTransaction(transactionIndex)
        .send({ from: accounts[0] });

      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error confirming transaction:', error);
    }
  };

  const onExecuteTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await multiSigWallet.methods
        .executeTransaction(transactionIndex)
        .send({ from: accounts[0] });

      console.log('Transaction executed');
    } catch (error) {
      console.error('Error executing transaction:', error);
    }
  };

  return (
    <div>
      <h2>Interact with MultiSig Wallet</h2>
      <Form onSubmit={onSubmitTransaction}>
        <h3>Submit Transaction</h3>
        <Form.Field>
          <label>To</label>
          <Input
            placeholder="0x123..."
            value={to}
            onChange={event => setTo(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value (in Ether)</label>
          <Input
            type="number"
            min="0"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Data (optional)</label>
          <Input
            placeholder="Data"
            value={data}
            onChange={event => setData(event.target.value)}
          />
        </Form.Field>
        <Button primary type="submit">
          Submit Transaction
        </Button>
      </Form>
      <Form>
        <h3>Confirm or Execute Transaction</h3>
        <Form.Field>
          <label>Transaction Index</label>
          <Input
            type="number"
            min="0"
            value={transactionIndex}
            onChange={event => setTransactionIndex(event.target.value)}
          />
        </Form.Field>
        <Button primary onClick={onConfirmTransaction}>
          Confirm Transaction
        </Button>
        <Button primary onClick={onExecuteTransaction}>
          Execute Transaction
        </Button>
      </Form>
    </div>
  );
};

export default InteractWithMultiSigWallet;
