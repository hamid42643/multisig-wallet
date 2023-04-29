import React from 'react'
import { Message } from 'semantic-ui-react'
import Campaign from './Campaign'

export default function CampaignPage() {
  if (!isWalletPluginInstalled()) {
    return <Message negative>
      <Message.Header>Wallet not available</Message.Header>
      <p>Please install a wallet to use this application</p>
    </Message>
  }

  return <Campaign />
}

function isWalletPluginInstalled() {
  return !!window.ethereum
}

