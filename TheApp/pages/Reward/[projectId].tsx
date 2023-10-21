import { Box, Heading, Text, Spinner, Container, useColorModeValue, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Database } from '@tableland/sdk';
import Navbar from '../components/Navbar'; // Import your Navbar component
import { useContract, useContractWrite, useAddress, useContractRead } from '@thirdweb-dev/react';

const Reward = () => {

  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  const router = useRouter();
  const { projectId } = router.query;

  const airdropContractAddress = "0xDfc3D442f9d744cB11aAcC61c754421C6C0Dd359";
  const { airdropContract } = useContract(airdropContractAddress);

  const votingContractAddress = "0x21fB146A6F275898156ECA30801bA15C9A271eD2";
  const {votingContract } = useContract(votingContractAddress);
  
  const account = useAddress();

  const { mutateAsync: airdropERC20, isAirdropLoading } = useContractWrite(airdropContract, "airdropERC20")

  const { data, isLoading } = useContractRead(votingContract, "getVotesAndUsers", [projectId])
  console.log(data);
  const [recipientAddresses, setRecipientAddresses] = useState("");
  const [amounts, setAmounts] = useState("");

  
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
    <Container
      maxW="100%"
      bgColor={bgColor}
      color={textColor}
      justifyContent="center"
      alignItems="center"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
        <Navbar /> 
        <Heading as="h1" size="xl" mb={4}>Reward the Hackers</Heading>

    </Container>
  );
}
export default Reward;
