import React from 'react'
import { Message } from 'semantic-ui-react'
import Transaction from './Transaction'
import { isWalletPluginInstalled } from '../ethereum/utils';

export default function TransactionPage() {
  if (!isWalletPluginInstalled()) {
    return <Message negative>
      <Message.Header>Wallet not available</Message.Header>
      <p>Please install a wallet to use this application</p>
    </Message>
  }

  return <Transaction />
}



