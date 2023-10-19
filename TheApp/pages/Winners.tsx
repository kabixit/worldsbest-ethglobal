import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  useColorModeValue,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useContract, useContractRead } from '@thirdweb-dev/react';

const Winners = () => {
  const { contract: projectContract } = useContract('0x7Cf8579C3414B3fbBa7E6b971a9BC2806fcE6dfC'); // Replace with your project contract address

  const [winningProjects, setWinningProjects] = useState([]);

  const { data: projectCount, isLoading, error } = useContractRead(
    projectContract,
    'getProjectsCount',
    []
  );

  useEffect(() => {
    if (projectCount) {
      fetchWinningProjects(projectCount);
    }
  }, [projectCount]);

  const fetchWinningProjects = async (count: number) => {
    const winningProjects = [];

    for (let i = 0; i < count; i++) {
      const projectData = await projectContract.call('projects', [i]);
      const [name, voteCount, approvals, rejections, status] = projectData;

      if (status === 1) {
        winningProjects.push({
          name,
          voteCount,
        });
      }
    }

    winningProjects.sort((a, b) => b.voteCount - a.voteCount);
    setWinningProjects(winningProjects);
  };

  if (isLoading) {
    return (
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal" />
      </Flex>
    );
  }

  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box p={8} bg={useColorModeValue('gray.100', 'gray.900')}>
      {winningProjects.length === 0 ? (
        <Text color={textColor}>No winning projects available.</Text>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {winningProjects.map((project, index) => (
            <GridItem key={index}>
              <Box p={4} borderWidth={1} borderRadius="md" shadow="md" bg={boxBgColor}>
                <Heading
                  as="h3"
                  size="md"
                  mb={2}
                  color={useColorModeValue('gray.800', 'gray.200')}
                >
                  {project.name.toString()}
                </Heading>
                <Text fontWeight="bold">
                  Vote Count: {(parseInt(project.voteCount) / 1e18).toString()}
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Winners;
