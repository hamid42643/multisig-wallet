import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CampaignPage from './components/CampaignPage'
import DeployMultiSigWallet from './components/DeployWallet'
import { Container, Menu } from 'semantic-ui-react'
import Home from './components/Home'
import NotFound from './components/NotFound'
import InteractWithMultiSigWallet from './components/InteractWithMultiSigWallet';


import {
  useNavigate,
} from 'react-router-dom'

function App() {
  let navigate = useNavigate()
  return (
    <Container>

      <Menu secondary>
        <Menu.Item
          name='home'
          onClick={() => navigate('/')}
        />
        {<Menu.Item
          name='Submit transaction'
          onClick={() => navigate('/interact/0x28860361f4C4F2B8c15211e3A18Dd53af8bD7Aab')}
        />}
        {<Menu.Item
          name='Deploy new contract'
          onClick={() => navigate('/deploy')}
        />}


      </Menu>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/interact/:address" element={<InteractWithMultiSigWallet />} />
        <Route path="/deploy" element={<DeployMultiSigWallet />} />
        <Route path='/campaigns/:address' element={<CampaignPage />} />
        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
    </Container>
  )
}

export default App
