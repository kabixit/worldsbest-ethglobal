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
import { useAddress, useContract, useContractWrite } from '@thirdweb-dev/react';

const MintPage = () => {
  const { contract } = useContract("0x288319e58019460A6DA33F52F778a88B5BC18DaC");
  const account = useAddress();
  const { mutateAsync: mintTo, isLoading } = useContractWrite(contract, "mintTo");

  const [to, setTo] = useState(''); // Address to mint tokens to
  const [amount, setAmount] = useState(''); // Amount of tokens to mint
  const [isAlertVisible, setAlertVisible] = useState(false); // Custom alert visibility

  const handleMint = async () => {
    try {  
      // Convert the BigInt to a string in hexadecimal format (uint256)
      const mintAmountHex = (parseInt(amount) * 1e18).toString();
      console.log(mintAmountHex);
      const data = await mintTo({ args: [to, mintAmountHex] });
      console.info("Minting success", data);
    } catch (err) {
      console.error("Minting failed", err);
      setAlertVisible(true); // Show the custom alert
    }
  }

  return (
    <>
      <Navbar />
      <Flex
        direction="column"
        align="center"
        h="100vh"
        bgColor="blackAndWhite.900"
        color="blackAndWhite.50"
        animation="fadeIn 1s ease-in-out"
        justify="center"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Mint Tokens
        </Heading>
        <Text fontSize="xl" mb={6}>
          Mint your custom tokens here!
        </Text>
        <Box mb={4}>
          <Input
            type="text"
            placeholder="Recipient Address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            size="lg"
            w="468px" // Adjust the size of the input field
          />
        </Box>
        <Box mb={6}>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            size="lg"
            w="468px" // Adjust the size of the input field
          />
        </Box>
        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleMint}
          isLoading={isLoading}
        >
          Mint
        </Button>
      </Flex>
      {isAlertVisible && (
        <Box
          position="fixed"
          bottom="20px"
          left="50%"
          transform="translateX(-50%)"
          p={4}
          bgColor="red.500"
          color="white"
          borderRadius="md"
          boxShadow="md"
          zIndex="9999"
          textAlign="center"
          width="400px"
        >
          Minting failed. You can't mint tokens.
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => setAlertVisible(false)}
            ml={2}
          >
            Close
          </Button>
        </Box>
      )}
    </>
  );
};

export default MintPage;
