import React, { useState, useEffect } from 'react';
import { useEth } from '../contexts/EthContext';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const Donate = () => {
  const { state: { contract, accounts } } = useEth();
  const [zone, setZone] = useState('');
  const [amount, setAmount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Donate';
    const checkRegistration = async () => {
      if (contract && accounts.length) {
        try {
          await contract.methods.CheckDonorInfo(accounts[0]).call();
          setIsRegistered(true); // Set as registered if no error
        } catch (error) {
          if (error.toString().includes("Donor not found")) {
            navigate('/register'); // Redirect to register if donor is not found
          } else {
            setErrorMsg('An unexpected error occurred');
            console.error('CheckDonorInfo error:', error);
          }
        }
      }
    };

    checkRegistration();
  }, [contract, accounts, navigate]);

  const handleDonate = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMsg('');

    // Validate inputs
    if (!zone || !amount.trim() || !mobileNumber.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (!contract || !accounts.length) return;

    try {
      // Proceed with donation if registered
      await contract.methods.Donate(mobileNumber, zone).call({ from: accounts[0], value: Web3.utils.toWei(amount, 'ether') });
      await contract.methods.Donate(mobileNumber, zone).send({ from: accounts[0], value: Web3.utils.toWei(amount, 'ether') });
      navigate('/'); // Redirect to the Info page upon success
    } catch (error) {
      if (error.toString().includes("Mobile number is not matching")) {
        setErrorMsg('Mobile number is not matching');
      } else {
        setErrorMsg('Error during donation');
      }
      console.error('Donation error:', error);
    }
  };

  return (
    <div className="flex justify-center p-4">
      {isRegistered ? (
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Donate</h1>
          <form onSubmit={handleDonate} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Account Address</label>
              <input
                type="text"
                id="address"
                value={accounts[0]}
                className="input input-bordered w-full"
                style={{ fontSize: '0.85rem' }} // Slightly smaller font to accommodate long addresses
                readOnly
              />
            </div>
            <div>
              <label htmlFor="zone" className="block text-sm font-medium mb-1">Select Zone</label>
              <select
                id="zone"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>Select a zone</option>
                <option value="sylhet">Sylhet</option>
                <option value="chittagong-north">Chittagong North</option>
                <option value="chittagong-south">Chittagong South</option>
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">Donation Amount (in Ether)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full"
                min="0.01" // Minimum donation amount
                step="0.01" // Decimal step
                required
              />
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="text"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
            <button
              type="submit"
              className="btn btn-accent w-full"
            >
              Donate
            </button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Donate;
