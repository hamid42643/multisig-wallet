import Web3 from 'web3'
import multisig from '../contract/MultiSigWallet.json'


export function getWeb3() {
  return new Web3(window.ethereum)
}

export function getContract(web3, contractAddress) {
  return new web3.eth.Contract(multisig.abi, contractAddress)
}

export function getContractWithNoAddress(web3) {
  return new web3.eth.Contract(multisig.abi)
}

export function getContractBytecode(web3) {
  return new web3.eth.Contract(multisig.bytecode)
}