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

const AirdropPage = () => {
  const { contract } = useContract("0x288319e58019460A6DA33F52F778a88B5BC18DaC");
  const account = useAddress();
  const { mutateAsync: multicall, isLoading } = useContractWrite(contract, "multicall");

  const recipients = ["0x60117B4da2C71B092357CCc035F8C56f55b69538", "0x442Bb05C11e44BB7e6aE5cb34Bbaf46b0f7dDA88"];
  const amounts = [100, 200];// Amount of tokens to airdrop

  const inputData = JSON.stringify([recipients, amounts]);

  const handleAirdrop = async () => {
    try {
      const data = await multicall({ args: [inputData] });
      console.info("Airdrop success", data);
    } catch (err) {
        console.error("Airdrop failed", err);
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
          />
        </Box>
        <Box mb={6}>
          <Input
            type="number"
            placeholder="Amount"
            size="lg"
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
    </>
  );
};

export default AirdropPage;
