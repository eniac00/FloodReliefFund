import React, { useState, useEffect } from 'react';
import { useEth } from '../contexts/EthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { state: { contract, accounts } } = useEth();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Registration';

    const checkDonorStatus = async () => {
      try {
        const result = await contract.methods.CheckDonorInfo(accounts[0]).call();
        if (result) {
          setIsRegistered(true);  // If result exists, account is already registered
        }
      } catch (error) {
        // If there's an error, it's likely because the donor is not registered
        setIsRegistered(false);
      }
    };

    if (contract && accounts.length) {
      checkDonorStatus();
    }
  }, [contract, accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMsg('');

    // Validate inputs
    if (!name.trim() || !mobileNumber.trim()) {
      setErrorMsg('Please fill in both name and mobile number.');
      return;
    }

    if (!contract || !accounts.length) return;

    try {
      // Use call() to simulate the transaction and check for errors
      await contract.methods.RegisterDonor(name, mobileNumber).call({ from: accounts[0] });

      // If call() doesn't throw an error, proceed with send()
      await contract.methods.RegisterDonor(name, mobileNumber).send({ from: accounts[0] });
      navigate('/'); // Redirect to the Info page upon success
    } catch (error) {
      if (error.toString().includes("Donor already registered")) {
        setErrorMsg('Donor already registered');
      } else if (error.toString().includes("Fundraiser accounts cannot register as donors")) {
        setErrorMsg('Fundraiser accounts cannot register as donors');
      } else {
        setErrorMsg('Unknown error occurred!');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {isRegistered ? (
          <div className="text-center">
            <p className="text-green-500 mb-4">Account is already registered.</p>
            <button
              onClick={() => navigate('/donate')}
              className="btn btn-primary"
            >
              Proceed to Donate
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
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
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
