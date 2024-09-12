import React, { useEffect, useState } from 'react';
import { useEth } from '../contexts/EthContext';

const Info = () => {
  const { state: { contract, accounts } } = useEth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    document.title = 'Information';
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      if (contract) {
        try {
          const result = await contract.methods.CheckDonorInfo(accounts[0]).call();
          setInfo(result);
          setErrorMsg(null); // Clear any previous error message
        } catch (error) {
          if (error.toString().includes("Donor not found")) {
            setErrorMsg("Donor is not registered");
            setInfo(null); // Clear any previous info
          } else {
            setErrorMsg("An unexpected error occurred");
            setInfo(null); // Clear any previous info
          }
        }
      }
    };

    getInfo();
  }, [contract, accounts]);

  return (
    <div className="flex justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome</h1> {/* Title added */}
        <h1 className="text-2xl font-bold mb-4 text-center">To</h1> {/* Title added */}
        <h1 className="text-2xl font-bold mb-4 text-center">Flood Relief Fund</h1> {/* Title added */}
        {errorMsg ? (
          <div>
            <h2 className="text-xl mb-2">
              <span className="font-bold">Address:</span> {accounts[0]}
            </h2>
            <p className="mb-4">{errorMsg}</p>
            <button className="btn btn-accent" onClick={() => window.location.href = '/register'}>
              Register
            </button>
          </div>
        ) : info ? (
          <div>
            <h2 className="text-xl mb-2">
              <span className="font-bold">Address:</span> {accounts[0]}
            </h2>
            <p className="mb-2">
              <span className="font-bold">Name:</span> {info.name}
            </p>
            <p>
              <span className="font-bold">Mobile Number:</span> {info.mobileNumber}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Info;
