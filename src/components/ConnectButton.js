import React, { useState } from "react";
const ethers = require('ethers');

const ConnectButton = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Trigger the request for Ethereum accounts on button click
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Retrieve user's Ethereum address and balance
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setUserAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const userBalance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(userBalance));
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  return (
    <div>
      <button onClick={connectWallet} className="connect-button">
        {userAddress ? `Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}` : 'Connect Wallet'}
      </button>
      {balance && <p>Balance: {balance} ETH</p>}
    </div>
  );
};

export default ConnectButton;
