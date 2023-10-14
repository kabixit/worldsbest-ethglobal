import { Box, Flex, Text } from '@chakra-ui/react';
import { ConnectWallet} from "@thirdweb-dev/react";
import TokenBal from './TokenBal';

const Navbar = () => {
  return (
    <Box bgColor="transparent" p={4} position="fixed" top={0} left={0} right={0} display="flex" justifyContent="space-between" alignItems="center" >
      <Flex align="center">
        <Text fontSize="xl" fontWeight="bold" color="white">
          WorldsBest
        </Text>
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
