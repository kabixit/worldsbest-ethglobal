import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { Box, Text, useColorModeValue, Spinner } from "@chakra-ui/react";

export default function TokenBalance() {
  const { contract } = useContract("0x288319e58019460A6DA33F52F778a88B5BC18DaC");
  const account = useAddress();
  const { data, isLoading } = useContractRead(contract, "balanceOf", [account]);
  const formattedBalance = isLoading ? "Loading..." : (parseInt(data) / 1e18).toString();

  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box p={1.5} bg={boxBgColor} display="inline-block" borderRadius="lg" shadow="md">
      <Text fontSize="xs" fontWeight="bold" mb={2} color={textColor}>
        Best Balance:
      </Text>
      {isLoading ? (
        <Spinner size="l" color="teal" />
      ) : (
        <Text fontSize="l" fontWeight="bold" color="black">
          {formattedBalance}{" "}
          <Text as="span" fontSize="md" fontWeight="normal">
            BEST
          </Text>
        </Text>
      )}
    </Box>
  );
}
