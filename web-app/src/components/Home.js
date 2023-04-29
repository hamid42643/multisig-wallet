import React, { useState } from 'react'
import {
  useNavigate,
} from "react-router-dom"
import { Button, Header, Form } from 'semantic-ui-react'

export default function Home() {

  let navigate = useNavigate()
  const [address, setAddress] = useState('')

  return <div>
    <Header as='h1'>Crowdfunding application</Header>

    <Form>
      <Form.Input
        label='Contract Address'
        type='text'
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <Button
        type='submit'
        onClick={() => {
          navigate(`/campaigns/${address}`)
        }}
      >
        Submit
      </Button>
    </Form>
  </div>
}