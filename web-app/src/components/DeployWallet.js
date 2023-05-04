import React, { useState, useMemo } from 'react';


import { getWeb3 } from '../ethereum/utils'

import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { getContractWithNoAddress } from '../ethereum/utils'
import { getContractBytecode } from '../ethereum/utils'


const DeployMultiSigWallet = () => {
  const closeErrorModal = () => setErrorMsg('');
  const [errorMsg, setErrorMsg] = useState('');
  const bytecode = '0x608060405234801561001057600080fd5b50604051620011a2380380620011a28339818101604052604081101561003557600080fd5b810190808051604051939291908464010000000082111561005557600080fd5b90830190602082018581111561006a57600080fd5b825186602082028301116401000000008211171561008757600080fd5b82525081516020918201928201910280838360005b838110156100b457818101518382015260200161009c565b50505050919091016040525060200151835190925015159050610110576040805162461bcd60e51b815260206004820152600f60248201526e1bdddb995c9cc81c995c5d5a5c9959608a1b604482015290519081900360640190fd5b600081118015610121575081518111155b61015d5760405162461bcd60e51b81526004018080602001828103825260288152602001806200117a6028913960400191505060405180910390fd5b60005b82518110156102a357600083828151811061017757fe5b6020026020010151905060006001600160a01b0316816001600160a01b031614156101d9576040805162461bcd60e51b815260206004820152600d60248201526c34b73b30b634b21037bbb732b960991b604482015290519081900360640190fd5b6001600160a01b03811660009081526001602052604090205460ff161561023a576040805162461bcd60e51b815260206004820152601060248201526f6f776e6572206e6f7420756e6971756560801b604482015290519081900360640190fd5b6001600160a01b031660008181526001602081905260408220805460ff191682179055815480820183559180527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56390910180546001600160a01b03191690921790915501610160565b5060025550610ec280620002b86000396000f3fe60806040526004361061009c5760003560e01c80639ace38c2116100645780639ace38c214610298578063a0e67e2b146102c2578063c01a8c8414610327578063c642747414610353578063d0549b851461041b578063ee22610b146104305761009c565b8063025e7c27146100d75780632e7700f01461011d5780632f54bf6e1461014457806333ea3dc81461018b57806380f59a651461025f575b60408051348152476020820152815133927f90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15928290030190a2005b3480156100e357600080fd5b50610101600480360360208110156100fa57600080fd5b503561045a565b604080516001600160a01b039092168252519081900360200190f35b34801561012957600080fd5b50610132610481565b60408051918252519081900360200190f35b34801561015057600080fd5b506101776004803603602081101561016757600080fd5b50356001600160a01b0316610488565b604080519115158252519081900360200190f35b34801561019757600080fd5b506101b5600480360360208110156101ae57600080fd5b503561049d565b60405180866001600160a01b03166001600160a01b031681526020018581526020018060200184151515158152602001838152602001828103825285818151815260200191508051906020019080838360005b83811015610220578181015183820152602001610208565b50505050905090810190601f16801561024d5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34801561026b57600080fd5b506101776004803603604081101561028257600080fd5b50803590602001356001600160a01b0316610595565b3480156102a457600080fd5b506101b5600480360360208110156102bb57600080fd5b50356105da565b3480156102ce57600080fd5b506102d76106b2565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156103135781810151838201526020016102fb565b505050509050019250505060405180910390f35b34801561033357600080fd5b506103516004803603602081101561034a57600080fd5b5035610714565b005b34801561035f57600080fd5b506103516004803603606081101561037657600080fd5b6001600160a01b03823516916020810135918101906060810160408201356401000000008111156103a657600080fd5b8201836020820111156103b857600080fd5b803590602001918460018302840111640100000000831117156103da57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610911945050505050565b34801561042757600080fd5b50610132610b2f565b34801561043c57600080fd5b506103516004803603602081101561045357600080fd5b5035610b35565b6000818154811061046757fe5b6000918252602090912001546001600160a01b0316905081565b6003545b90565b60016020526000908152604090205460ff1681565b60008060606000806000600387815481106104b457fe5b60009182526020918290206006909102018054600180830154600384015460058501546002808701805460408051601f600019998416156101000299909901909216939093049687018a90048a0281018a019092528582529698506001600160a01b039095169692959460ff90921693909285919083018282801561057a5780601f1061054f5761010080835404028352916020019161057a565b820191906000526020600020905b81548152906001019060200180831161055d57829003601f168201915b50505050509250955095509550955095505091939590929450565b600080600384815481106105a557fe5b600091825260208083206001600160a01b03871684526004600690930201919091019052604090205460ff1691505092915050565b600381815481106105e757fe5b6000918252602091829020600691909102018054600180830154600280850180546040805161010096831615969096026000190190911692909204601f81018890048802850188019092528184526001600160a01b03909416965090949192918301828280156106985780601f1061066d57610100808354040283529160200191610698565b820191906000526020600020905b81548152906001019060200180831161067b57829003601f168201915b505050506003830154600590930154919260ff1691905085565b6060600080548060200260200160405190810160405280929190818152602001828054801561070a57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116106ec575b5050505050905090565b3360009081526001602052604090205460ff16610764576040805162461bcd60e51b81526020600482015260096024820152683737ba1037bbb732b960b91b604482015290519081900360640190fd5b600354819081106107b0576040805162461bcd60e51b81526020600482015260116024820152701d1e08191bd95cc81b9bdd08195e1a5cdd607a1b604482015290519081900360640190fd5b81600381815481106107be57fe5b600091825260209091206003600690920201015460ff161561081d576040805162461bcd60e51b81526020600482015260136024820152721d1e08185b1c9958591e48195e1958dd5d1959606a1b604482015290519081900360640190fd5b826003818154811061082b57fe5b600091825260208083203384526004600690930201919091019052604090205460ff1615610897576040805162461bcd60e51b81526020600482015260146024820152731d1e08185b1c9958591e4818dbdb999a5c9b595960621b604482015290519081900360640190fd5b6000600385815481106108a657fe5b6000918252602080832033808552600693909302016004810190915260408084208054600160ff19909116811790915560058301805490910190555190935087927f5cbe105e36805f7820e291f799d5794ff948af2a5f664e580382defb6339004191a35050505050565b3360009081526001602052604090205460ff16610961576040805162461bcd60e51b81526020600482015260096024820152683737ba1037bbb732b960b91b604482015290519081900360640190fd5b600380546040805160a0810182526001600160a01b0387811682526020808301888152938301878152600060608501819052608085018190526001870180895597905283517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b6006880290810180546001600160a01b0319169290951691909117845594517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85c86015551805195969593949293610a45937fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85d01929190910190610df5565b5060608201518160030160006101000a81548160ff02191690831515021790555060808201518160050155505050836001600160a01b031681336001600160a01b03167fd5a05bf70715ad82a09a756320284a1b54c9ff74cd0f8cce6219e79b563fe59d86866040518083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610aee578181015183820152602001610ad6565b50505050905090810190601f168015610b1b5780820380516001836020036101000a031916815260200191505b50935050505060405180910390a450505050565b60025481565b3360009081526001602052604090205460ff16610b85576040805162461bcd60e51b81526020600482015260096024820152683737ba1037bbb732b960b91b604482015290519081900360640190fd5b60035481908110610bd1576040805162461bcd60e51b81526020600482015260116024820152701d1e08191bd95cc81b9bdd08195e1a5cdd607a1b604482015290519081900360640190fd5b8160038181548110610bdf57fe5b600091825260209091206003600690920201015460ff1615610c3e576040805162461bcd60e51b81526020600482015260136024820152721d1e08185b1c9958591e48195e1958dd5d1959606a1b604482015290519081900360640190fd5b600060038481548110610c4d57fe5b9060005260206000209060060201905060025481600501541015610cac576040805162461bcd60e51b81526020600482015260116024820152700c6c2dcdcdee840caf0cac6eae8ca40e8f607b1b604482015290519081900360640190fd5b60038101805460ff19166001908117909155815482820154604051600280860180546000966001600160a01b03909616959193928392859260001991811615610100029190910116048015610d385780601f10610d16576101008083540402835291820191610d38565b820191906000526020600020905b815481529060010190602001808311610d24575b505091505060006040518083038185875af1925050503d8060008114610d7a576040519150601f19603f3d011682016040523d82523d6000602084013e610d7f565b606091505b5050905080610dc1576040805162461bcd60e51b81526020600482015260096024820152681d1e0819985a5b195960ba1b604482015290519081900360640190fd5b604051859033907f5445f318f4f5fcfb66592e68e0cc5822aa15664039bd5f0ffde24c5a8142b1ac90600090a35050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610e3657805160ff1916838001178555610e63565b82800160010185558215610e63579182015b82811115610e63578251825591602001919060010190610e48565b50610e6f929150610e73565b5090565b61048591905b80821115610e6f5760008155600101610e7956fea265627a7a723158202f30f84f4902a62a71fc25a96cc3ef5cb3ee792cd5e743321317e7ba1128dcfa64736f6c63430005100032696e76616c6964206e756d626572206f6620726571756972656420636f6e6669726d6174696f6e73'
  
  const web3 = useMemo(() => getWeb3(), [])
  // const { address } = useParams();
  const address = '0x28860361f4C4F2B8c15211e3A18Dd53af8bD7Aab'
  const [owners, setOwners] = useState('');
  const [confirmations, setConfirmations] = useState('');

  const onSubmit = async () => {
    const accounts = await web3.eth.getAccounts();
    const parsedOwners = owners.split(',').map(owner => owner.trim());

    const multiSigWallet = getContractWithNoAddress(web3)

    try {
      const deployedContract = await multiSigWallet
        .deploy({
          data: bytecode,
          arguments: [parsedOwners, confirmations]
        })
        .send({
          from: accounts[0],
          gas: '1000000'
        });
      console.log('Deployed contract address:', deployedContract.options.address);
      setErrorMsg('Deployed contract address:', deployedContract.options.address);
    } catch (error) {
      console.error('Error deploying the contract:'+ formatMessage(error.message));
      setErrorMsg('Error deploying the contract:'+ formatMessage(error.message));
    }

    function formatMessage(message) {
      const regex = /"message":"(VM Exception while processing transaction: .*?)"/;
      const matches = message.match(regex);
      
      if (matches && matches[1]) {
        return matches[1];
      }
      return message;
    }
  
  };

  return (
    <div>
      <h2>Deploy MultiSig Wallet</h2>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Owners (comma-separated addresses)</label>
          <Input
            placeholder="0x123..., 0x456..."
            value={owners}
            onChange={event => setOwners(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Number of Confirmations Required</label>
          <Input
            type="number"
            min="1"
            value={confirmations}
            onChange={event => setConfirmations(event.target.value)}
          />
        </Form.Field>
        <Button primary type="submit">
          Deploy Contract
        </Button>
      </Form>
      <Modal open={!!errorMsg} onClose={closeErrorModal} size="small">
        <Modal.Header></Modal.Header>
        <Modal.Content>
          <p>{errorMsg}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeErrorModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default DeployMultiSigWallet;
