import React, { useEffect, useState } from 'react';
import { useEth } from '../contexts/EthContext';

const Balance = () => {
  const { state: { contract, accounts } } = useEth();
  const [totalDonationsState, setTotalDonationsState] = useState(0);
  const [realBalanceState, setRealBalanceState] = useState({});
  const [fundBalanceState, setFundBalanceState] = useState({});

  useEffect(() => {
    document.title = 'Check Balance';
  }, []);

  useEffect(() => {
    const fetchTotalDonations = async () => {
      if (contract) {
        try {
          const realBalance = await contract.methods.GetRealBalance().call();
          const fundBalance = await contract.methods.GetFundraiserBalance().call();
          const totalDonations = await contract.methods.GetTotalDonations().call();

          setRealBalanceState(realBalance);
          setFundBalanceState(fundBalance);
          setTotalDonationsState(totalDonations);
        } catch (error) {
          console.error("Error fetching total donations:", error);
        }
      }
    };

    fetchTotalDonations();
  }, [contract, accounts]);

  return (
    <div className="flex flex-col items-center p-4">
       <h1 className="text-2xl font-bold mb-4 text-center">All Balance</h1>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Zone</th>
              <th>In Fund</th>
              <th>Real Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Sylhet</td>
              <td> {fundBalanceState.sylhetBalance || '0'} Ether </td>
              <td> {realBalanceState.sylhetBalance || '0'} Ether </td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Chittagong North</td>
              <td> {fundBalanceState.ChittagongNorthBalance || '0'} Ether </td>
              <td> {realBalanceState.ChittagongNorthBalance || '0'} Ether </td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Chittagong South</td>
              <td> {fundBalanceState.ChittagongSouthBalance || '0'} Ether </td>
              <td> {realBalanceState.ChittagongSouthBalance || '0'} Ether </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 className="my-5 text-xl font-bold">
        Total Donations: {totalDonationsState || '0'} Ether
      </h3>
    </div>
  );
};

export default Balance;
