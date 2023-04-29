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
  const [contractInfo, setContractInfo] = useState({
      name: 'N/A',
      targetAmount: 0,
      totalCollected: 0,
      campaignFinished: false,
      deadline: new Date(0),
      isBeneficiary: true,
      contributedAmount: 10,
      state: ONGOING_STATE
  })

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
        const name = await contract.methods.name().call()
        const targetAmount = await contract.methods.targetAmount().call()
        const totalCollected = await contract.methods.totalCollected().call()
        const beforeDeadline = await contract.methods.beforeDeadline().call()
        const beneficiary = await contract.methods.beneficiary().call()
        const deadlineSeconds = await contract.methods.fundingDeadline().call()
        const contributedAmount = await contract.methods.amounts(currentAccount).call()
        const state = await contract.methods.state().call()

        var deadlineDate = new Date(0)
        deadlineDate.setUTCSeconds(deadlineSeconds)

        setContractInfo({
          name: name,
          targetAmount: targetAmount,
          totalCollected: totalCollected,
          campaignFinished: !beforeDeadline,
          deadline: deadlineDate,
          isBeneficiary: beneficiary.toLowerCase() === currentAccount.toLowerCase(),
          contributedAmount: contributedAmount,
          state: state
        })
      } catch (e) {
        setContractInfo(null)
      }
    }
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

  return <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Value</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>

      <Table.Row>
        <Table.Cell>Name</Table.Cell>
        <Table.Cell>{contractInfo.name}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Target amount</Table.Cell>
        <Table.Cell>{contractInfo.targetAmount}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Has finished</Table.Cell>
        <Table.Cell>{contractInfo.campaignFinished.toString()}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Deadline</Table.Cell>
        <Table.Cell>{contractInfo.deadline.toString()}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>I am beneficiary</Table.Cell>
        <Table.Cell>{contractInfo.isBeneficiary.toString()}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Contributed amount</Table.Cell>
        <Table.Cell>{contractInfo.contributedAmount.toString()}</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>Contract state</Table.Cell>
        <Table.Cell>{contractInfo.state}</Table.Cell>
      </Table.Row>

    </Table.Body>

    <Table.Footer fullWidth>
      <Table.Row>
        <Table.HeaderCell colSpan="2">
          {campaignInteractionSection(contractInfo, address, currentAccount)}
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  </Table>
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