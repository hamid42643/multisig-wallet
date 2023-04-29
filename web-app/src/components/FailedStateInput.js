import React from 'react'
import { Button, Label } from 'semantic-ui-react'

export default function FailedStateInput(props) {
  const {contributedByCurrentAccount} = props

  if (contributedByCurrentAccount) {
    return <Button type='submit' negative>Withdraw funds</Button>
  } else {
    return <Label>The campaign has failed</Label>
  }
}