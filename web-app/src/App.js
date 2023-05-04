import './App.css';
import { getWeb3 } from './ethereum/utils'
import React, { useMemo } from 'react'
import { Routes, Route } from 'react-router-dom';
import TransactionPage from './components/TransactionPage';
import DeployMultiSigWallet from './components/DeployWallet';
import { Container, Menu, Button, Label } from 'semantic-ui-react';
import Home from './components/Home';
import NotFound from './components/NotFound';
import InteractWithMultiSigWallet from './components/InteractWithMultiSigWallet';
// import { Container, Menu, Button, Label } from 'semantic-ui-react';

import {
  useNavigate,
} from 'react-router-dom';

function App() {
  const web3 = useMemo(() => getWeb3(), [])
  let navigate = useNavigate();
  const [currentAccount, setCurrentAccount] = React.useState('');
  const [accounts, setAccounts] = React.useState([]);

  async function connectWallet() {
    try {
      const chainId = await web3.eth.getChainId();
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.numberToHex(chainId) }],
      });
      const accounts = await web3.eth.getAccounts();
      setCurrentAccount(accounts[0]);
      setAccounts(accounts);
  
      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        setCurrentAccount(newAccounts[0]);
      });
    } catch (error) {
      console.error('Error while connecting wallet:', error);
    }
  }
  


  async function handleAccountChange(event, data) {
    alert("Please change your account in MetaMask.");
    await connectWallet();
    setCurrentAccount(data.value);
  }

  // Add this useEffect hook to call connectWallet() when the component mounts
  React.useEffect(() => {
    connectWallet();
  }, []);

  return (
    <Container>
      <Menu secondary>
        <Menu.Item
          name='home'
          onClick={() => navigate('/')}
        />
        <Menu.Item
          name='Submit transaction'
          onClick={() => navigate('/interact/0x28860361f4C4F2B8c15211e3A18Dd53af8bD7Aab')}
        />
        <Menu.Item
          name='Deploy new contract'
          onClick={() => navigate('/deploy')}
        />
        <Menu.Item>
          <Label content={`Current account: ${currentAccount}`} />
        </Menu.Item>

      </Menu>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/interact/:address" element={<InteractWithMultiSigWallet />} />
        <Route path="/deploy" element={<DeployMultiSigWallet />} />
        <Route path='/transactions/:address' element={<TransactionPage />} />
        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
    </Container>
  );
}

export default App;
