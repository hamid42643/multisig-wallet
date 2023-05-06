import React, { useState, useEffect, useMemo } from 'react';
import { getWeb3, getContract } from '../ethereum/utils';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InteractWithMultiSigWallet = () => {
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState(0);
  const [numOwners, setNumOwners] = useState(0);
  const web3 = useMemo(() => getWeb3(), []);
  const [transactionIndex, setTransactionIndex] = useState('');
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('');
  const { address } = useParams();
  const [errorMsg, setErrorMsg] = useState('');
  const [etherBalance, setEtherBalance] = useState('');
  const [lastTransactionIndex, setLastTransactionIndex] = useState(0);
  const multiSigWallet = useMemo(() => getContract(web3, address), [web3, address]);
  const [balanceUSD, setBalanceUSD] = useState('');

  useEffect(() => {
    const fetchLastTransactionIndex = async () => {
      const transactionCount = await multiSigWallet.methods.getTransactionCount().call();
      setLastTransactionIndex(transactionCount - 1);
    };

    const fetchInfo = async () => {
      // Fetch balance
      const balanceWei = await web3.eth.getBalance(address);
      const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
      setEtherBalance(parseFloat(balanceEther).toFixed(2));

      // Fetch conversion rate
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const conversionRate = response.data.ethereum.usd;
      const balanceUSD = parseFloat(balanceEther) * conversionRate;
      
      setBalanceUSD(parseFloat(balanceUSD).toFixed(2));


      // Fetch numConfirmationsRequired
      const fetchedNumConfirmationsRequired = await multiSigWallet.methods.numConfirmationsRequired().call();
      setNumConfirmationsRequired(fetchedNumConfirmationsRequired);

      // Fetch numOwners
      const fetchedOwners = await multiSigWallet.methods.getOwners().call();
      setNumOwners(fetchedOwners.length);
    };

    fetchInfo();
    fetchLastTransactionIndex();


    const subscription = web3.eth.subscribe('newBlockHeaders', async (error, blockHeader) => {
      if (error) {
        console.error(`Error in block subscription: ${error.message}`);
        return;
      }
      await fetchLastTransactionIndex();
      await fetchInfo()
    });

    return () => {
      subscription.unsubscribe();
    };

  }, [web3, address]);

  const closeErrorModal = () => setErrorMsg('');


  const onSubmitTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await multiSigWallet.methods
        .submitTransaction(to, web3.utils.toWei(value, 'ether'), web3.utils.asciiToHex(data))
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
        .confirmTransaction(lastTransactionIndex)
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
        .executeTransaction(lastTransactionIndex)
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
      <h3>Balance: {etherBalance} Ether (${balanceUSD} USD)</h3>
      <h5>Confirmations Required (M): {numConfirmationsRequired}</h5>
      <h5>Total Owners(N): {numOwners}</h5>
      <Form onSubmit={onSubmitTransaction}>
        <h3 style={{ marginTop: '20px' }}>Submit Transaction</h3>
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
        <h3 style={{ marginTop: '20px' }}>Confirm or Execute Transaction</h3>
        <Form.Field>
          <label>Transaction Index</label>
          <Input
            type="number"
            min="0"
            value={transactionIndex !== '' ? transactionIndex : lastTransactionIndex}
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
