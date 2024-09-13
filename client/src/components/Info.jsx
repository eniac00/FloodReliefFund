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
            console.log(error);
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
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome</h1>
        <h1 className="text-2xl font-bold mb-4 text-center">To</h1>
        <h1 className="text-2xl font-bold mb-4 text-center">Flood Relief Fund</h1>
        {errorMsg ? (
          <div>
            {/* <h2 className="text-xl mb-2">
              <span className="font-bold">Address:</span> {accounts[0]}
            </h2> */}
            <p className="mb-4">{errorMsg}</p>
            <p className="mb-4 text-xl">We are Oppen. We are looking for DONORS!</p>
            <img
              src="https://i.ytimg.com/vi/anB_JN7mFeM/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AG2CIACoAuKAgwIABABGHIgRSgzMA8=&rs=AOn4CLC8MZncUxYo2rEZxoZPAb0u1YghQw" // Placeholder image URL, replace with the actual image source
              alt="We are looking for donors"
              className="mx-auto mb-4"
            />
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
