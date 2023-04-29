import Web3 from 'web3'
import crowdfundingAbi from './crowdfundingAbi'

export function getWeb3() {
  return new Web3(window.ethereum)
}

export function getContract(web3, contractAddress) {
  return new web3.eth.Contract(crowdfundingAbi, contractAddress)
}