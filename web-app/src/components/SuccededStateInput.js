import React from 'react'
import { Button, Label } from 'semantic-ui-react'

export default function SuccededStateInput(props) {
  const {isBeneficiary} = props

  if (isBeneficiary) {
    return <Button type='submit' negative>Collect funds</Button>
  } else {
    return <Label>The campaign has finished successfully</Label>
  }
}