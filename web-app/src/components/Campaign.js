import React, { useEffect, useState, useMemo } from 'react'
import { Button, Table, Message } from 'semantic-ui-react'
import {
  useParams,
} from 'react-router-dom'
import { getWeb3 } from '../ethereum/utils'

import ContributeInput from './ContributeInput'
import SuccededStateInput from './SuccededStateInput'
import FailedStateInput from './FailedStateInput'
import { getContract } from '../ethereum/utils'

const ONGOING_STATE = '0'
const FAILED_STATE = '1'
const SUCCEDED_STATE = '2'

export default function Campaign() {
  const web3 = useMemo(() => getWeb3(), [])
  const [currentAccount, setCurrentAccount] = useState(null)
  const [networkId, setNetworkId] = useState(null)
  const [transactions, setTransactions] = useState([]);
  const [contractInfo, setContractInfo] = useState({
      owners: 'N/A',
      transactionCount: 'N/A',
      transaction: 'N/A'
  })

  async function fetchAllTransactions() {
    try {
      const transactionCount = await contract.methods.getTransactionCount().call();
      const fetchedTransactions = [];
  
      for (let i = 0; i < transactionCount; i++) {
        const transaction = await contract.methods.getTransaction(i).call();
        fetchedTransactions.push(transaction);
      }
  
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }
  

  async function connectWallet() {
    const accounts = await web3.eth.requestAccounts()
    setCurrentAccount(accounts[0])
  }

  async function getCurrentConnectedAccount() {
    const accounts = await web3.eth.getAccounts()
    setCurrentAccount(accounts[0])
    setNetworkId(await web3.eth.net.getId())
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    if (accounts) {
      setCurrentAccount(accounts[0])
    }
  })

  window.ethereum.on('networkChanged', function(networkId){
    console.log("New network ID: ", networkId)
    setNetworkId(networkId)
  })

  const { address } = useParams();

  useEffect(() => {
    getCurrentConnectedAccount()
  })

  useEffect(() => {
    async function getCampaign(address) {
      if (!currentAccount) return;

      const contract = getContract(web3, address)

      try {
        const owners = await contract.methods.getOwners().call()
        const transactionCount = await contract.methods.getTransactionCount().call()
        // const transaction = await contract.methods.getTransaction(0).call()

        setContractInfo({
          owners: owners,
          transactionCount: transactionCount,
          // transaction: transaction
        })
      } catch (e) {
        console.log("error during contract loading: "+e)
        setContractInfo(null)
      }
    }
    fetchAllTransactions();
    getCampaign(address)
  }, [web3, address, currentAccount, networkId])

  if (!currentAccount) {
    return (
      <>
        <Message info>
          <Message.Header>Website is not connected to Ethereum</Message.Header>
          <p>You need to connect your wallet first</p>
        </Message>
        <Button primary onClick={() => connectWallet()}>Connect Wallet</Button>
      </>
    )
  }

  if (!contractInfo) {
    return (
      <Message negative>
        <Message.Header>Failed to load contract data</Message.Header>
        <p>Check if the contract is deployed and you are using the right network</p>
      </Message>
    )
  }

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>Owners</Table.Cell>
          <Table.Cell>{contractInfo.owners}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>transactionCount</Table.Cell>
          <Table.Cell>{contractInfo.transactionCount}</Table.Cell>
        </Table.Row>

        {transactions.map((transaction, index) => (
          <React.Fragment key={index}>
            <Table.Row>
              <Table.Cell>To</Table.Cell>
              <Table.Cell>{transaction.to}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Value</Table.Cell>
              <Table.Cell>{transaction.value}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Data</Table.Cell>
              <Table.Cell>{transaction.data}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Executed</Table.Cell>
              <Table.Cell>{transaction.executed.toString()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>NumConfirmations</Table.Cell>
              <Table.Cell>{transaction.numConfirmations}</Table.Cell>
            </Table.Row>
          </React.Fragment>
        ))}
      </Table.Body>

      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan="2">
            {campaignInteractionSection(contractInfo, address, currentAccount)}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );

  // return <Table celled>
  //   <Table.Header>
  //     <Table.Row>
  //       <Table.HeaderCell>Name</Table.HeaderCell>
  //       <Table.HeaderCell>Value</Table.HeaderCell>
  //     </Table.Row>
  //   </Table.Header>

  //   <Table.Body>

  //     <Table.Row>
  //       <Table.Cell>Owners</Table.Cell>
  //       <Table.Cell>{contractInfo.owners}</Table.Cell>
  //     </Table.Row>

  //     <Table.Row>
  //       <Table.Cell>transactionCount</Table.Cell>
  //       <Table.Cell>{contractInfo.transactionCount}</Table.Cell>
  //     </Table.Row>

  //   </Table.Body>

  //   <Table.Footer fullWidth>
  //     <Table.Row>
  //       <Table.HeaderCell colSpan="2">
  //         {campaignInteractionSection(contractInfo, address, currentAccount)}
  //       </Table.HeaderCell>
  //     </Table.Row>
  //   </Table.Footer>
  // </Table>

  
}

function campaignInteractionSection(contractInfo, address, currentAccount) {
  if (contractInfo.state === ONGOING_STATE) {
    return <ContributeInput
      campaignFinished={contractInfo.campaignFinished}
      contractAddress={address}
      currentAccount={currentAccount}
    />
  } else if (contractInfo.state === SUCCEDED_STATE) {
    return <SuccededStateInput
      isBeneficiary={contractInfo.isBeneficiary}
    />
  } else if (contractInfo.state === FAILED_STATE) {
    return <FailedStateInput
      contributedByCurrentAccount={contractInfo.contributedByCurrentAccount}
    />
  }
}