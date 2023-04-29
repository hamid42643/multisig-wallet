const MultiSigWallet = artifacts.require("MultiSigWallet");

module.exports = async function (deployer) {
  const owners = ["0x2603BFBA3160f17E3084dB37c329E25eC0D96601",
    "0x383f48a3AA961414fD0944a9C477C9a4996c003A",
    "0x59e59BA40e41559621EB06912BD2cfDF00d825dF",
    "0x8866153d6325c6c25DCF1fa82e5055A0Aedc85eb"];
  const numConfirmationsRequired = 2;

  deployer.deploy(MultiSigWallet, owners, numConfirmationsRequired);
};
