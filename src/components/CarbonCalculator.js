import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CarbonFootprintCalculator from './CarbonFootprintCalculator.json';
import ConnectButton from './components/ConnectButton';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [carbonFootprint, setCarbonFootprint] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [userDonation, setUserDonation] = useState('');

  useEffect(() => {
    async function initialize() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        const contractAddress = '0x7F3682356FeBF061Fe7A412C5fF354Ff9d36ae71';
        const contractInstance = new web3Instance.eth.Contract(
          CarbonFootprintCalculator.abi,
          contractAddress
        );
        setContract(contractInstance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        // Fetch user's donation amount
        const userDonation = await contractInstance.methods.getDonation().call({ from: accounts[0] });
        setUserDonation(web3Instance.utils.fromWei(userDonation));
      }
    }

    initialize();
  }, []);

  const calculateCarbonFootprint = async () => {
    try {
      if (web3 && contract) {
        await contract.methods.calculateCarbonFootprint(distance, fuelEfficiency).send({ from: account });
        const result = await contract.methods.getCarbonFootprint().call({ from: account });
        setCarbonFootprint(result);
      } else {
        if (isNaN(distance) || isNaN(fuelEfficiency)) {
          alert('Please enter valid numbers.');
          return;
        }

        const calculateCarbonFootprint = (parseFloat(distance) * parseFloat(fuelEfficiency)) / 100;
        setCarbonFootprint(calculateCarbonFootprint.toFixed(2));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const donate = async () => {
    try {
      if (web3 && contract) {
        // Convert donation amount to wei
        const donationAmountWei = web3.utils.toWei(donationAmount.toString(), 'ether');
        await contract.methods.donate().send({ from: account, value: donationAmountWei });

        // Fetch updated user's donation amount
        const updatedUserDonation = await contract.methods.getDonation().call({ from: account });
        setUserDonation(web3.utils.fromWei(updatedUserDonation));
      } else {
        alert('Blockchain donation not available. Please connect to a blockchain provider.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div>
      <h1>Carbon Footprint Calculator</h1>
      <ConnectButton/>
      <label>Flight Distance (in kilometers):</label>
      <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />

      <label>Fuel Efficiency (in liters per 100 km per passenger):</label>
      <input type="number" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} />

      <div><button onClick={calculateCarbonFootprint}>Calculate</button></div>

      <div>
        {carbonFootprint && <p>Carbon Footprint: {carbonFootprint} kg CO2 per passenger</p>}
      </div>
      </div>

      <br />
      <br />
      <br />

      <div>
      <h2 style={{color: 'white'}}>Donation</h2>
      <label style={{color: 'white'}}>Donation Amount (ETH):</label>
      <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />

      <div><button onClick={donate}>Donate</button></div>

      <div>
        {userDonation && <p style={{color: 'white'}}>Your Donation: {userDonation} ETH. To the Green World!</p>}
      </div>
      </div>
    </div>
  );
}

export default App;
