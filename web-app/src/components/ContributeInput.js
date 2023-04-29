import React, { useState } from 'react'
import { Button, Input } from 'semantic-ui-react'
import { getWeb3 } from '../ethereum/utils'

export default function ContributeInput(props) {

  const {
    campaignFinished,
    contractAddress,
    currentAccount
  } = props;

  const web3 = getWeb3()
  const [contributionAmount, setContributionAmount] = useState('')

  async function onContribute(event) {
    const amount = web3.utils.toWei(
      contributionAmount,
      'ether'
    )

    const gasEstimate = await web3.eth.estimateGas({
      value: amount,
      from: currentAccount,
      to: contractAddress
    })
    await web3
      .eth.sendTransaction({
        from: currentAccount,
        to: contractAddress,
        value: amount,
        gas: gasEstimate
      })
      .once('transactionHash', function(hash) {
        console.log('Transaction hash received', hash)
      })
      .once('receipt', function(receipt) {
        console.log('Transaction receipt received', receipt)
      })
      .on('confirmation', function(confNumber, receipt) {
        console.log('Confirmation', confNumber)
      })
  }

  if (campaignFinished) {
    return <Button type='submit'>Finish campaign</Button>
  }
  return <div>
    <Input
      action={{
        color: 'teal',
        content: 'Contribute',
        disabled: !isValidNumber(contributionAmount),
        onClick: onContribute
      }}
      error={contributionAmount !== '' && !isValidNumber(contributionAmount)}
      actionPosition='left'
      label='ETH'
      labelPosition='right'
      placeholder='1'
      onChange={(e) => setContributionAmount(e.target.value)}
    />
  </div>
}

function isValidNumber(amount) {
  return !isNaN(parseFloat(amount))
}
