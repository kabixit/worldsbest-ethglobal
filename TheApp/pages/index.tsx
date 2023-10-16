import React from 'react';
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  extendTheme,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  ThemeProvider,
} from '@chakra-ui/react';
import Navbar from './components/Navbar';
import { SearchIcon } from '@chakra-ui/icons';
import Link from 'next/link';




const HomePage = () => {
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
          Welcome to WorldsBest.FYI
        </Heading>
        <Text fontSize="xl" mb={6}>
          Find the best of anything and vote here!
        </Text>
        <Box mb={6}>
          <InputGroup size="lg">
            <Input
              type="text"
              placeholder="Search for the best of anything"
              bgColor="blackAndWhite.800"
              color="blackAndWhite.50"
              border="2px"
              borderColor="blackAndWhite.700"
              rounded="full"
              _focus={{ borderColor: 'brand.500' }}
              w="400px"
              fontSize="sm" // Adjust the font size for the placeholder text

            />
            <InputRightElement width="4.5rem">
              <SearchIcon color="brand.500" />
            </InputRightElement>
          </InputGroup>
        </Box>
        {/*
        <Flex justifyContent="center">
          <Box
            bgColor="blackAndWhite.800"
            color="blackAndWhite.50"
            border="1px"
            borderColor="blackAndWhite.700"
            p={4}
            rounded="lg"
            m={4}
          >
            <Heading as="h3" size="lg" mb={2}>
              Restaurant 1
            </Heading>
            <Text fontSize="md" mb={2}>
              This is a description of the restaurant.
            </Text>
            <Button colorScheme="brand" size="sm">
              Vote
            </Button>
          </Box>

          <Box
            bgColor="blackAndWhite.800"
            color="blackAndWhite.50"
            border="1px"
            borderColor="blackAndWhite.700"
            p={4}
            rounded="lg"
            m={4}
          >
            <Heading as="h3" size="lg" mb={2}>
              Restaurant 2
            </Heading>
            <Text fontSize="md" mb={2}>
              This is a description of the restaurant.
            </Text>
            <Button colorScheme="brand" size="sm">
              Vote
            </Button>
          </Box>
        </Flex>
        */}
        <Flex>
          <Box
          p={4}
          m={4}>
            <Link href="/MintPage">
                  <Button colorScheme="brand" size="sm">
                    Mint Tokens
                  </Button>
            </Link>
          </Box>
          <Box
          p={4}
          m={4}>
            <Link href="/Airdrop">
                  <Button colorScheme="brand" size="sm">
                    Airdrop Tokens
                  </Button>
            </Link>
          </Box>
        </Flex>
      </Flex>
      </>
  );
};

export default HomePage;
