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
  const contractAddress = "0xDfc3D442f9d744cB11aAcC61c754421C6C0Dd359";
  const { contract } = useContract(contractAddress);
  
  const account = useAddress();

  const { mutateAsync: airdropERC20, isLoading } = useContractWrite(contract, "airdropERC20")

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
      const _tokenOwner = "0x60117B4da2C71B092357CCc035F8C56f55b69538";

      const _contents = recipientAddressesArray.map((recipient, index) => ({
        recipient,
        amount: String(parseInt(amountsArray[index]) * 1e18),
      }));

      const data = await airdropERC20({ args: [_tokenAddress, _tokenOwner, _contents] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
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
          colorScheme="brand"
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
