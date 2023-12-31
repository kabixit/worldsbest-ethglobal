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
  Center,
  Icon,
} from '@chakra-ui/react';
import { useContract, useContractRead } from '@thirdweb-dev/react';
import { FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/router';

const Winners = () => {
  const router = useRouter();

  const { contract: projectContract } = useContract('0x4BE413C64db50FB52A73e7521e9AaC5438C66bB8'); // Replace with your project contract address

  const [winningProjects, setWinningProjects] = useState<{ name: any; voteCount: any; projectId: any}[]>([]);

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
      const projectData = await projectContract?.call('projects', [i]);
      const [name, voteCount, approvals, rejections, status, projectId] = projectData;

      if (status === 1) {
        winningProjects.push({
          name,
          voteCount,
          projectId,
        });
      }
    }

    winningProjects.sort((a, b) => b.voteCount - a.voteCount);
    setWinningProjects(winningProjects);
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal" />
      </Center>
    );
  }

  const handleViewReward = (projectId: any) => {
    router.push(`/Reward/${projectId}`);
  }

  return (
    <Box p={8} bg={useColorModeValue('gray.100', 'gray.900')}>
      {winningProjects.length === 0 ? (
        <Center>
          <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('gray.800', 'gray.200')}>
            No winning projects available.
          </Text>
        </Center>
      ) : (
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          {winningProjects.map((project, index) => (
            <GridItem key={index}>
              <Box p={4} borderWidth={1} borderRadius="md" shadow="md" bg={useColorModeValue('gray.200', 'gray.700')}
                onClick={() => handleViewReward(project.projectId)}
                cursor={'pointer'}
                >
                <Heading as="h4" size="md" mb={2} color={useColorModeValue('gray.800', 'gray.200')}>
                  #{index + 1}
                </Heading>
                <Heading as="h3" size="lg" mb={2} color={useColorModeValue('gray.800', 'gray.200')}>
                  {project.name.toString()}
                </Heading>
                <Text fontWeight="bold" fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
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