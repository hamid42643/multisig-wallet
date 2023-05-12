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
import dotenv from 'dotenv';
import {
  useNavigate,
} from 'react-router-dom';

dotenv.config();


function App() {
  const web3 = useMemo(() => getWeb3(), [])
  let navigate = useNavigate();
  const [currentAccount, setCurrentAccount] = React.useState('');
  const [accounts, setAccounts] = React.useState([]);

  const [networkName, setNetworkName] = React.useState('');

  

  function getNetworkName(chainId) {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 137:
        return 'Polygon Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Network';
      default:
        return 'Local Network';
    }
  }

  async function connectWallet() {
    try {
      const chainId = await web3.eth.getChainId();
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.numberToHex(chainId) }],
      });
      setNetworkName(getNetworkName(chainId)); // Update the network name

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

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  return (
    <Container>
      <Menu secondary>
        <Menu.Item
          name='Submit transaction'
          onClick={() => navigate(`/interact/${contractAddress}`)}
        />
        <Menu.Item
          name='Create new wallet'
          onClick={() => navigate('/deploy')}
        />
        <Menu.Item>
          <Label content={`Current account: ${currentAccount}`} />
        </Menu.Item>
        <Menu.Item>
          <Label content={`Network: ${networkName}`} />
        </Menu.Item>
        <Menu.Item
          name='Contract viewer'
          onClick={() => navigate('/')}
        />
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
