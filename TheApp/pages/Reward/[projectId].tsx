import React, { useState } from 'react';
import {
  Box,
  Heading,
  Container,
  useColorModeValue,
  Button,
  Grid,
  GridItem,
  Center,
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  useContract,
  useContractWrite,
  useAddress,
  useContractRead,
} from '@thirdweb-dev/react';
import Navbar from '../components/Navbar';

const Reward = () => {

  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  const router = useRouter();
  const { projectId } = router.query;

  const votingContractAddress = '0x4BE413C64db50FB52A73e7521e9AaC5438C66bB8';
  const { contract: votingContract } = useContract(votingContractAddress);

  const { data, isLoading } = useContractRead(votingContract, 'getVotesAndUsers', [projectId]);
  console.log(data);

  const [recipientAddresses, setRecipientAddresses] = useState('');
  const [amounts, setAmounts] = useState('');

  const airdropContractAddress = '0xDfc3D442f9d744cB11aAcC61c754421C6C0Dd359';
  const { contract: airdropContract } = useContract(airdropContractAddress);
  const { mutateAsync: airdropERC20, isLoading: isAirdropLoading } = useContractWrite(
    airdropContract,
    'airdropERC20'
  );

  const account = useAddress();

  const handleAirdrop = async () => {
    if (!isLoading) {
      const [addresses, voteCounts] = data;

      if (addresses.length !== voteCounts.length) {
        console.error('Number of recipients must match the number of amounts');
        return;
      }

      const _tokenAddress = '0x288319e58019460A6DA33F52F778a88B5BC18DaC';
      const _tokenOwner = '0x60117B4da2C71B092357CCc035F8C56f55b69538';

      const _contents = addresses.map((recipient: any, index: string | number) => ({
        recipient,
        amount: String(parseInt(voteCounts[index])+(parseInt(voteCounts[index])/2)),
      }));

      try {
        const data = await airdropERC20({ args: [_tokenAddress, _tokenOwner, _contents ]});
        console.info('Airdrop successful', data);
      } catch (err) {
        console.error('Airdrop failed', err);
      }
    }
  };

  return (
    <Center minH="100vh" bgColor={bgColor} flexDir="column" alignItems="center">
      <Navbar />
      <Heading as="h1" size="xl" my={8}>
        Reward the Hackers
      </Heading>
      {!isLoading && data && data[0].length > 0 && (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {data[0].map((address:any, index: string | number) => (
            <React.Fragment key={address}>
              <GridItem bg={boxBgColor} fontWeight="bold" p={2} borderRadius="md" shadow="md">
                <Text fontSize="md">
                  {address}
                </Text>
               </GridItem>
              <GridItem bg={boxBgColor} p={2} borderRadius="md" shadow="md">
                <Text fontSize="sm" fontWeight="bold">
                  {(data[1][index] / 1e18)}+{((data[1][index] / 1e18))/2} BEST Reward
                </Text>
              </GridItem>
            </React.Fragment>
          ))}
        </Grid>
      )}
      <Button onClick={handleAirdrop} colorScheme="teal" size="lg" my={4}>
        Perform Airdrop
      </Button>
    </Center>
  );
};

export default Reward;