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
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [userDonation, setUserDonation] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const contractAddress = '0xBFeb0043E6bC6Aaa62D07d2570906dA8D957630b';
          const contractInstance = new web3Instance.eth.Contract(
            CarbonFootprintCalculator.abi,
            contractAddress
          );
          setContract(contractInstance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error initializing:', error);
        }
      }
    };

    initialize();
  }, []);

  const calculateCarbonFootprint = async () => {
    try {
      if (!distance || !fuelEfficiency) {
        // Check if distance or fuelEfficiency is empty, display an error message
        setCarbonFootprint('Please enter valid values for distance and fuel efficiency.');
        return;
      }
  
      if (web3 && contract) {
        await contract.methods.calculateCarbonFootprint(distance, fuelEfficiency).send({ from: account });
        const result = await contract.methods.getCarbonFootprint().call({ from: account });
  
        if (!isNaN(Number(result))) {
          setCarbonFootprint(Number(result).toFixed(2));
        } else {
          setCarbonFootprint('Invalid result obtained from blockchain.');
        }
      } else {
        setCarbonFootprint('Blockchain calculation not available. Please connect to a blockchain provider.');
      }
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      setCarbonFootprint('An error occurred while calculating the carbon footprint. Please check the console for details.');
    }
  };  

  const donate = async () => {
    try {
      if (web3 && contract && donationAmount !== '' && !isNaN(Number(donationAmount))) {
        const donationAmountWei = web3.utils.toWei(donationAmount.toString(), 'ether');
        await contract.methods.donate().send({ from: account, value: donationAmountWei });
  
        const updatedUserDonation = await contract.methods.getDonation().call({ from: account });
        setUserDonation(web3.utils.fromWei(updatedUserDonation));
      } else {
        alert('Invalid donation amount. Please enter a valid numerical value.');
      }
    } catch (error) {
      console.error('Error donating:', error);
    }
  };  

  return (
    <div>
      <h1>Carbon Footprint Calculator</h1>
      <ConnectButton />

      <label>Flight Distance (in kilometers):</label>
      <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />

      <label>Fuel Efficiency (in liters per 100 km per passenger):</label>
      <input type="number" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} />

      <div>
        <button onClick={calculateCarbonFootprint}>Calculate</button>
      </div>

      <div>
        {carbonFootprint && (
          <p>Carbon Footprint: {carbonFootprint} kg CO2 per passenger. Happy Journey!</p>
        )}
      </div>

      <br />

      <div>
        <h2 style={{ color: 'white' }}>Donation</h2>

        <label style={{ color: 'white' }}>Donation Amount (ETH):</label>
        <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />

        <div>
          <button onClick={donate}>Donate</button>
        </div>

        <div>
          {userDonation !== null && (
            <p style={{ color: 'white' }}>Your Donation: {userDonation} ETH. To the Green World!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
