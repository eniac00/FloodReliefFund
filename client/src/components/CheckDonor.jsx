import React, { useState, useEffect } from 'react';
import { useEth } from '../contexts/EthContext';

const CheckDonor = () => {
  const { state: { contract } } = useEth();
  const [accountAddress, setAccountAddress] = useState('');
  const [donorInfo, setDonorInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = 'Check Donor';
  }, []);

  const handleCheckDonor = async (e) => {
    e.preventDefault();
    
    // Clear previous data
    setErrorMsg('');
    setDonorInfo(null);

    if (!accountAddress.trim()) {
      setErrorMsg('Please enter a valid address.');
      return;
    }

    try {
      // Fetch donor info
      const result = await contract.methods.CheckDonorInfo(accountAddress).call();
      setDonorInfo(result);
    } catch (error) {
      if (error.toString().includes("Donor not found")) {
        setErrorMsg("Donor not found.");
      } else {
        setErrorMsg("An unexpected error occurred.");
        console.error("Error fetching donor info:", error);
      }
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Check Donor</h1>
        
        <form onSubmit={handleCheckDonor} className="space-y-4">
          <div>
            <label htmlFor="accountAddress" className="block text-sm font-medium mb-1">Account Address</label>
            <input
              type="text"
              id="accountAddress"
              value={accountAddress}
              onChange={(e) => setAccountAddress(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter the donor's address"
              required
            />
          </div>

          <button type="submit" className="btn btn-accent w-full">
            Find Donor
          </button>
        </form>

        {/* Display Donor Information or Error Message */}
        {errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>}
        {donorInfo && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold mb-2">Donor Found</h2>
            <p><span className="font-bold">Address:</span> {accountAddress}</p>
            <p><span className="font-bold">Name:</span> {donorInfo.name}</p>
            <p><span className="font-bold">Mobile Number:</span> {donorInfo.mobileNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckDonor;
