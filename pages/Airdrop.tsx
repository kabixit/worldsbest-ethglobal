import React, { useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import Navbar from './components/Navbar';
import { useContract, useContractWrite, useAddress } from '@thirdweb-dev/react';

export default function AirdropPage() {
  const contractAddress = "0xe130669C544076bE32dEA26c11f0e73D7200f7aF";
  const { contract } = useContract(contractAddress);
  const account = useAddress();
  const { mutateAsync: airdrop, isLoading } = useContractWrite(contract, "airdrop");

  const [recipientAddresses, setRecipientAddresses] = useState("");
  const [amounts, setAmounts] = useState("");

  const handleRecipientAddressesChange = (event) => {
    setRecipientAddresses(event.target.value);
  };

  const handleAmountsChange = (event) => {
    setAmounts(event.target.value);
  };

  const handleAirdrop = async () => {
    // Split comma-separated addresses and amounts into arrays
    const recipientAddressesArray = recipientAddresses.split(',');
    const amountsArray = amounts.split(',');
    


    try {
      // Ensure that the number of recipients matches the number of amounts
      if (recipientAddressesArray.length !== amountsArray.length) {
        console.error("Number of recipients must match the number of amounts");
        return;
      }

      // Convert addresses and amounts to the required format
      const _tokenAddress = "0x288319e58019460A6DA33F52F778a88B5BC18DaC";
      const _tokenOwner = account;
      const _recipients = recipientAddressesArray;
      const _amounts = amountsArray.map(amount => String(parseInt(amount) * 1e18));

      const data = await airdrop({ args: [_tokenAddress, _tokenOwner, _recipients, _amounts] });
      console.info("Contract call success", data);
    } catch (err) {
      console.error("Contract call failure", err);
    }
  };

  return (
    <ChakraProvider>
      <Navbar />
      <Flex
        direction="column"
        align="center"
        h="100vh"
        bgColor="black"
        color="white"
        animation="fadeIn 1s ease-in-out"
        justify="center"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Airdrop Tokens
        </Heading>
        <Text fontSize="xl" mb={6}>
          Airdrop tokens to multiple recipients here!
        </Text>
        <Box mb={4}>
          <Input
            type="text"
            placeholder="Recipient Addresses (comma-separated)"
            size="lg"
            value={recipientAddresses}
            onChange={handleRecipientAddressesChange}
          />
        </Box>
        <Box mb={6}>
          <Input
            type="text"
            placeholder="Amounts (comma-separated)"
            size="lg"
            value={amounts}
            onChange={handleAmountsChange}
          />
        </Box>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleAirdrop}
          isLoading={isLoading}
        >
          Airdrop
        </Button>
      </Flex>
    </ChakraProvider>
  );
}
