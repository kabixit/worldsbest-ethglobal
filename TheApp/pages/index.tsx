import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Container,
  extendTheme,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  ThemeProvider,
  useColorModeValue,
} from '@chakra-ui/react';
import Navbar from './components/Navbar';
import { SearchIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Projects from './Projects';
import { useAddress, useContract, useContractRead, useContractWrite, ConnectWallet, useSwitchChain, useChain } from '@thirdweb-dev/react';
import Winners from './Winners';


const HomePage = () => {
  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  const votingSystemAddress = "0x7Cf8579C3414B3fbBa7E6b971a9BC2806fcE6dfC";
  const { contract: tokenContract } = useContract('0x288319e58019460A6DA33F52F778a88B5BC18DaC'); // Replace with your token contract address
  const { contract: votingSystemContract } = useContract('0x7Cf8579C3414B3fbBa7E6b971a9BC2806fcE6dfC'); // Replace with your voting system contract address
  const account = useAddress();
  const chain = useChain();



  
  // Check allowance
  const { data: tokenAllowance } = useContractRead(tokenContract, "allowance", [account, votingSystemAddress]);

  const { mutateAsync: approve, isLoading } = useContractWrite(tokenContract, 'approve');

  const { data: votingDeadline, isLoading: votingDeadlineLoading } = useContractRead(
    votingSystemContract,
    'votingDeadline',
    []
  );

  const { data: judgingDeadline, isLoading: judgingDeadlineLoading } = useContractRead(
    votingSystemContract,
    'judgingDeadline',
    []
  );

  // Determine the user's role (e.g., judge or regular user)
  const { data: isJudge, isLoading: judgeLoading } = useContractRead(
    votingSystemContract,
    'isJudge',
    [account]
  );

  const now = new Date().getTime(); // Current time in milliseconds
  const votingDeadlineTime = votingDeadline * 1000; // Convert votingDeadline to milliseconds
  const judgingDeadlineTime = judgingDeadline * 1000; // Convert votingDeadline to milliseconds

  const isJudgingTimeOver = () => {
    return now >= judgingDeadlineTime;
  }

  const isVotingTimeOver = () => {
    return now>=votingDeadlineTime
  }

  // Handle approval button click
  const handleApprove = async () => {
    try {
      const data = await approve({ args: [votingSystemAddress, '100000000000000000000'] });
      console.info('Contract call success', data);
    } catch (err) {
      console.error('Contract call failure', err);
    }
  };
 
  if (!account) {
    return (
      <Container
        maxW="100%"
        bgColor={bgColor}
        color={textColor}
        justifyContent="center"
        alignItems="center"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Flex
          h="100vh"
          bgColor={bgColor}
          color={textColor}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading
            fontSize="24px"
            fontWeight="bold"
            marginBottom="5vh"
          >
            Please Connect a Wallet
          </Heading>
          <ConnectWallet theme="light" switchToActiveChain={true} modalSize="wide" />
        </Flex>
      </Container>
    );
  }

  if (chain && chain.chainId !== 80001) {
    return (
      <Container
        maxW="100%"
        bgColor={bgColor}
        color={textColor}
        justifyContent="center"
        alignItems="center"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Flex
          h="100vh"
          bgColor={bgColor}
          color={textColor}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading
            fontSize="24px"
            fontWeight="bold"
            marginBottom="5vh"
          >
            Please Switch to Mumbai
          </Heading>
          <ConnectWallet theme="light" switchToActiveChain={true} modalSize="wide" />
        </Flex>
      </Container>
    );
  } 




  return (
    <>
      <Navbar />
      <Flex
        direction="column"
        align="center"
        h="100vh"
        bgColor={bgColor}
        color={textColor}
        animation="fadeIn 1s ease-in-out"
        justify="center"
        mt="10vh"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to WorldsBest.FYI
        </Heading>
        <Text fontSize="xl" mb={6}>
          Find the best of buidls and vote here!
        </Text>
        {isVotingTimeOver() && isJudgingTimeOver() ? (
          <>
          <Heading as="h1" size="xl" mb={4}>The Winning BUIDLs are</Heading>
          <Winners /> 
          </> 
        ) : (
          <>
            {isJudge ? (
              <Projects />
            ) : (
              <>
                {tokenAllowance !== undefined && tokenAllowance.eq(0) ? (
                  <Box
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    shadow="md"
                    bg={boxBgColor}
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Text fontSize="lg">Approval is required to vote.</Text>
                    <Button
                      mt={4}
                      colorScheme="teal"
                      isLoading={isLoading}
                      onClick={handleApprove}
                    >
                      Approve
                    </Button>
                  </Box>
                ) : (
                  <Projects />
                )}
              </>
            )}
          </>
        )}
      </Flex>
    </>
  );
};

export default HomePage;




