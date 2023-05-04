import React, { useState, useMemo } from 'react';
import { getWeb3, getContract } from '../ethereum/utils';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';


const InteractWithMultiSigWallet = () => {
  const web3 = useMemo(() => getWeb3(), []);
  const [transactionIndex, setTransactionIndex] = useState('');
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('');
  const { address } = useParams();
  const [errorMsg, setErrorMsg] = useState('');

  const multiSigWallet = useMemo(() => getContract(web3, address), [web3, address]);

  const closeErrorModal = () => setErrorMsg('');

  const onSubmitTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await multiSigWallet.methods
        .submitTransaction(to, value, web3.utils.asciiToHex(data))
        .send({ from: accounts[0] });

      console.log('Transaction submitted');
      setErrorMsg('Transaction submitted');
    } catch (error) {
      setErrorMsg('Error submitting transaction: ' + error.message);
    }
  };

  const onConfirmTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await multiSigWallet.methods
        .confirmTransaction(transactionIndex)
        .send({ from: accounts[0] });

      console.log('Transaction confirmed');
      setErrorMsg('Transaction confirmed');
    } catch (error) {
      setErrorMsg('Error confirming transaction: ' + error.message);
    }
  };

  const onExecuteTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await multiSigWallet.methods
        .executeTransaction(transactionIndex)
        .send({ from: accounts[0] });

      console.log('Transaction executed');
      setErrorMsg('Transaction executed');
    } catch (error) {
      setErrorMsg('Error executing transaction: ' + formatMessage(error.message));
    }
  };

  function formatMessage(message) {
    const regex = /"message":"(VM Exception while processing transaction: .*?)"/;
    const matches = message.match(regex);
    
    if (matches && matches[1]) {
      return matches[1];
    }
    return message;
  }

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
      <Modal open={!!errorMsg} onClose={closeErrorModal} size="small">
        <Modal.Header></Modal.Header>
        <Modal.Content>
          <p>{errorMsg}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeErrorModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default InteractWithMultiSigWallet;
