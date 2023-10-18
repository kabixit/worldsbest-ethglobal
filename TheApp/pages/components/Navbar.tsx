import { Box, Flex, Text, useColorModeValue} from '@chakra-ui/react';
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  trustWallet,
  zerionWallet,
  bloctoWallet,
  magicLink,
  frameWallet,
  rainbowWallet,
  phantomWallet,
} from "@thirdweb-dev/react";
import TokenBal from './TokenBal';
import Link from 'next/link';

  

const Navbar = () => {
  
  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} p={4} position="fixed" top={0} left={0} right={0} display="flex" justifyContent="space-between" alignItems="center" >
      <Flex align="center">
      <Link href="/">
        <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'gray.200')}>
          WorldsBest
        </Text>
      </Link>
    </Flex>
      <Flex>
        <Box mr={4}>
          <TokenBal />
        </Box>
        <ConnectWallet
            theme={"dark"}
            modalSize={"wide"}
        />
      </Flex>
    </Box>
  );
};

export default Navbar;
