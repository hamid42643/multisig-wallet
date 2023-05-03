import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Header, Form } from 'semantic-ui-react';

export default function Home() {
  let navigate = useNavigate();
  const [address, setAddress] = useState('');

  return (
    <div>
      <Header as="h1">Multisig Wallet</Header>

      <Form>
        <Form.Input
          label="Contract Address"
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <Button
          type="submit"
          onClick={() => {
            navigate(`/transactions/${address}`);
          }}
        >
          Submit
        </Button>
      </Form>
      {/* <div>
        <Header as="h3">Deploy a new MultiSig Wallet</Header>
        <Link to="/deploy">
          <Button primary>Deploy MultiSig Wallet</Button>
        </Link>
      </div> */}
    </div>
  );
}
