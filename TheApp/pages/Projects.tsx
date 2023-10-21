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
  Icon,
} from '@chakra-ui/react';
import { useContract, useContractRead, useAddress, useContractWrite } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import { FiArrowRight } from 'react-icons/fi';
import Navbar from './components/Navbar';

const Projects = () => {
  const { contract: projectContract } = useContract('0x4BE413C64db50FB52A73e7521e9AaC5438C66bB8');
  const router = useRouter();
  const account = useAddress();

  const [projects, setProjects] =  useState<{ name: any; votecount: any; status: any; id: any}[]>([]);

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
      console.info("contract call success", data);
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
      const data = await rejectProject({ args: [projectId] });
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const { mutateAsync: vote, isLoading: voting } = useContractWrite(
    projectContract,
    'vote'
  );

  const { data: projectCount, isLoading, error } = useContractRead(
    projectContract,
    'getProjectsCount',
    []
  );

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

  const now = new Date().getTime();
  const votingDeadlineTime = votingDeadline * 1000;
  const votingTimeRemaining = Math.max(0, votingDeadlineTime - now);
  const votingDaysLeft = Math.floor(votingTimeRemaining / (1000 * 60 * 60 * 24));

  const judgingDeadlineTime = judgingDeadline * 1000;
  const judgingTimeRemaining = Math.max(0, judgingDeadlineTime - now);
  const judgingDaysLeft = Math.floor(judgingTimeRemaining / (1000 * 60 * 60 * 24));

  const isJudgingTimeOver = () => {
    return now >= judgingDeadlineTime;
  }

  const isVotingTimeOver = () => {
    return now >= votingDeadlineTime;
  }

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
          id: index,
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

  const handleViewProject = (projectId: any) => {
    router.push(`/ViewProject/${projectId}`);
  }

  if (isLoading || judgeLoading || votingDeadlineLoading || judgingDeadlineLoading) {
    return (
      <Flex alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal" />
      </Flex>
    );
  }

  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <>
      <Navbar />
      <Box p={8} bg={useColorModeValue('gray.100', 'gray.900')}>
        {projects.length === 0 ? (
          <Text color={textColor}>No projects available.</Text>
        ) : (
          <>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              {projects.map((project) => (
                <GridItem key={project.name}>
                  <Box p={4} borderWidth={1} borderRadius="md" shadow="md" bg={boxBgColor} position="relative">
                    <Heading
                      as="h3"
                      size="md"
                      mb={2}
                      color={useColorModeValue('gray.800', 'gray.200')}
                    >
                      {project.name.toString()}
                    </Heading>
                    {isJudge ? (
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
                    ) : votingDeadlineTime > now ? (
                      <Button
                        colorScheme="teal"
                        isLoading={voting}
                        onClick={() => handleVote(project.id, '10')}
                        _hover={{ bg: 'teal.500', color: 'white' }}
                        _focus={{ outline: 'none' }}
                      >
                        Vote
                      </Button>
                    ) : (
                      <Text mt={2} color={textColor} fontWeight="bold">
                        {isJudge ? 'Judging time is Over' : 'Voting time is Over'}
                      </Text>
                    )}
                    <Icon
                      as={FiArrowRight}
                      color="black"
                      fontSize="l"
                      cursor="pointer"
                      position="absolute"
                      top={4}
                      right={4}
                      onClick={() => handleViewProject(project.id)}
                    />
                  </Box>
                </GridItem>
              ))}
            </Grid>

 <Text mt={2} color={textColor} fontWeight="strong">
                 1 Vote = 10 BEST
                </Text> 
           <Flex align="center" justify="center" marginTop={3}>
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
