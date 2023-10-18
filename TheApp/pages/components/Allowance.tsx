// Allowance.tsx
import React, { useEffect, useState } from 'react';
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";

function Allowance() {
  const tokenContractAddress = "0x288319e58019460A6DA33F52F778a88B5BC18DaC"; // Replace with your token contract address
  const owner = useAddress(); // Replace with the owner's address
  const spender = "0x7Cf8579C3414B3fbBa7E6b971a9BC2806fcE6dfC"; // Replace with the spender's address

  const { contract } = useContract(tokenContractAddress);
  const { data, isLoading } = useContractRead(contract, "allowance", [owner, spender]);
  const [allowance, setAllowance] = useState(0);

  useEffect(() => {
    if (!isLoading && data) {
      // Update the state with the allowance value
      setAllowance(data.toString());
    }
  }, [isLoading, data]);

  return (
    <div>
      <h2>Allowance:</h2>
      {isLoading ? (
        <p>Loading allowance...</p>
      ) : (
        <p>{allowance} tokens</p>
      )}
    </div>
  );
}

export default Allowance;
