import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  useColorModeValue,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useContract, useContractRead, useAddress, useContractWrite } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import Navbar from './components/Navbar';


const Projects = () => {
  const { contract: projectContract } = useContract('0x7Cf8579C3414B3fbBa7E6b971a9BC2806fcE6dfC'); // Replace with your project contract address
  const router = useRouter();
  const account = useAddress();

  const { data: isJudge, isLoading: judgeLoading } = useContractRead(
    projectContract,
    'isJudge',
    [account]
  );



  const { mutateAsync: approveProject, isLoading: approving } = useContractWrite(
    projectContract,
    'approveProject'
  );

  const handleApproveProject = async (projectId: any) => {
    try {
      const data = await approveProject({ args: [projectId] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }


  const { mutateAsync: rejectProject, isLoading: rejecting } = useContractWrite(
    projectContract,
    'rejectProject'
  );

  const handleRejectProject = async (projectId: any) => {
    try {
      const data = await approveProject({ args: [projectId] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const { mutateAsync: vote, isLoading: voting } = useContractWrite(
    projectContract,
    'vote'
  );

  const [projects, setProjects] = useState<{ name: any; votecount: any; status: any; id: any; }[]>([]);

  const { data: projectCount, isLoading, error } = useContractRead(
    projectContract,
    'getProjectsCount',
    []
  );

  // Retrieve voting and judging deadlines
  const { data: votingDeadline, isLoading: votingDeadlineLoading } = useContractRead(
    projectContract,
    'votingDeadline',
    []
  );

  const { data: judgingDeadline, isLoading: judgingDeadlineLoading } = useContractRead(
    projectContract,
    'judgingDeadline',
    []
  );

   // Calculate time remaining for voting deadline
  const now = new Date().getTime(); // Current time in milliseconds
  const votingDeadlineTime = votingDeadline * 1000; // Convert votingDeadline to milliseconds
  const votingTimeRemaining = Math.max(0, votingDeadlineTime - now); // Calculate time remaining

  // Convert the remaining time to a user-friendly format like "7 Days left"
  const votingDaysLeft = Math.floor(votingTimeRemaining / (1000 * 60 * 60 * 24)); // Calculate days remaining

  const judgingDeadlineTime = judgingDeadline * 1000; // Convert votingDeadline to milliseconds
  const judgingTimeRemaining = Math.max(0, judgingDeadlineTime - now); // Calculate time remaining

  // Convert the remaining time to a user-friendly format like "7 Days left"
  const judgingDaysLeft = Math.floor(judgingTimeRemaining / (1000 * 60 * 60 * 24)); // Calculate days remaining

  // ...

  const userIsJudge = isJudge && !judgeLoading;

  useEffect(() => {
    if (projectCount) {
      fetchProjects(projectCount);
    }
  }, [projectCount]);

  const fetchProjects = async (count: number) => {
    const projectPromises = [];
    
    for (let i = 0; i < count; i++) {
      projectPromises.push(projectContract?.call('projects', [i]));
    }
  
    try {
      const projectResults = await Promise.all(projectPromises);
      const projects = projectResults.map((result, index) => {
        const [name, votecount, status] = result;
  
        return {
          name,
          votecount,
          status,
          id: index, // Using the index as a makeshift ID
        };
      });
  
      setProjects(projects);
    } catch (error) {
      console.error(error);
      setProjects([]);
    }
  };
  
  
  const handleVote = async (projectId: any, value: string) => {
    try {
      const bValue =  String(parseInt(value) * 1e18);
      const data = await vote({ args: [projectId, bValue] });
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  if (isLoading || judgeLoading || votingDeadlineLoading || judgingDeadlineLoading) {
    return (
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal" />
      </Flex>
    );
  }


  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

    return (
      <>
    <Box p={8}  bg={useColorModeValue('gray.100', 'gray.900')}>
      {projects.length === 0 ? (
        <Text color={textColor}>No projects available.</Text>
      ) : (
        <>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {projects.map((project) => (
            <GridItem key={project.name}>
              <Box p={4} borderWidth={1} borderRadius="md" shadow="md" bg={boxBgColor}>
                <Heading
                  as="h3"
                  size="md"
                  mb={2}
                  color={useColorModeValue('gray.800', 'gray.200')}
                >
                  {project.name.toString()}
                </Heading>
                {votingDeadlineTime > now ? (
                  isJudge ? (
                    judgingDeadlineTime > now ? (
                      <>
                        <Button
                          mr={2}
                          colorScheme="teal"
                          isLoading={approving}
                          onClick={() => handleApproveProject(project.id)}
                          _hover={{ bg: 'teal.500', color: 'white' }}
                          _focus={{ outline: 'none' }}
                        >
                          Approve
                        </Button>
                        <Button
                          colorScheme="red"
                          isLoading={rejecting}
                          onClick={() => handleRejectProject(project.id)}
                          _hover={{ bg: 'red.500', color: 'white' }}
                          _focus={{ outline: 'none' }}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                      <Button
                          mr={2}
                          colorScheme="teal"
                          isLoading={approving}
                          onClick={() => approveProject(project.id)}
                          _hover={{ bg: 'teal.500', color: 'white' }}
                          _focus={{ outline: 'none' }}
                          isDisabled={true}
                        >
                          Approve
                        </Button>
                        <Button
                          colorScheme="red"
                          isLoading={rejecting}
                          onClick={() => rejectProject(project.id)}
                          _hover={{ bg: 'red.500', color: 'white' }}
                          _focus={{ outline: 'none' }}
                          isDisabled={true}
                        >
                          Reject
                        </Button>
                      <Text mt={2} fontSize="xs" color={textColor} fontWeight="bold">
                        Judging time has not started yet
                      </Text>
                      </>
                    )
                  ) : (
                    <Button
                      colorScheme="teal"
                      isLoading={voting}
                      onClick={() => handleVote(project.id, '10')}
                      _hover={{ bg: 'teal.500', color: 'white' }}
                      _focus={{ outline: 'none' }}
                     
                    >
                      Vote
                    </Button>
                  )
                ) : (
                  <Text mt={2} color={textColor} fontWeight="bold">
                    {isJudge ? 'Voting time has not started yet' : 'Voting time has not started yet'}
                  </Text>
                )}
              </Box>
            </GridItem>
          ))}

          </Grid>
          <Flex align="center" justify="center" marginTop={5}>
            {votingDeadlineTime > now ? (
              <Text mt={2} color={textColor} fontWeight="bold">
                {votingDaysLeft} {votingDaysLeft === 1 ? 'Day' : 'Days'} left for Voting
              </Text>
            ) : null}
            {judgingDeadlineTime > now ? (
              <Text mt={2} color={textColor} fontWeight="bold">
                {judgingDaysLeft} {judgingDaysLeft === 1 ? 'Day' : 'Days'} left for Judging
              </Text>
            ) : null}
          </Flex>          
        </>
      )}
    </Box>
    </>
  );
};

export default Projects;
