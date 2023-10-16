import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { Box, Text } from "@chakra-ui/react";

export default function TokenBalance() {
  const { contract } = useContract("0x288319e58019460A6DA33F52F778a88B5BC18DaC");
  const account = useAddress();
  const { data, isLoading } = useContractRead(contract, "balanceOf", [account]);
  const formattedBalance = isLoading ? "Loading..." : (parseInt(data) / 1e18).toString();

  return (
    <Box p={1.5} border="1px" borderColor="white" borderRadius="md" display="inline-block">
      <Text fontSize="xs" fontWeight="bold" mb={2} color="white">
        Your Token Balance:
      </Text>
      {isLoading ? (
        <Text fontSize="md" color="white">Loading...</Text>
      ) : (
        <Text fontSize="l" fontWeight="bold" color="white">
          {formattedBalance}{" "}
          <Text as="span" fontSize="md" fontWeight="normal">
            BEST
          </Text>
        </Text>
      )}
    </Box>
  );
}
