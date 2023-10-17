import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import Navbar from './components/Navbar';
import { useContract, useAddress, useContractWrite } from '@thirdweb-dev/react';

export default function Projects() {
  const contractAddress = "Your_Contract_Address"; // Replace with your contract's address
  const { contract, read, refetch } = useContract(contractAddress);
  const account = useAddress();
  const [projects, setProjects] = useState([]);
  const [votingDeadline, setVotingDeadline] = useState(0);
  const [judgingDeadline, setJudgingDeadline] = useState(0);
  const isJudge = /* Implement logic to determine if the user is a judge */;

  useEffect(() => {
    // Fetch and display the list of projects
    const fetchProjects = async () => {
      const projectsCount = await read("getProjectsCount");
      const projectsData = [];
      for (let i = 0; i < projectsCount; i++) {
        const project = await read("projects", i);
        projectsData.push(project);
      }
      setProjects(projectsData);
    };

    // Fetch the voting and judging deadlines
    const fetchDeadlines = async () => {
      const voting = await read("votingDeadline");
      setVotingDeadline(Number(voting));
      const judging = await read("judgingDeadline");
      setJudgingDeadline(Number(judging));
    };

    fetchProjects();
    fetchDeadlines();
  }, [read]);

  const { mutateAsync: vote, isLoading: isVoting } = useContractWrite(contract, "vote");
  const { mutateAsync: approveProject, isLoading: isApproving } = useContractWrite(contract, "approveProject");
  const { mutateAsync: rejectProject, isLoading: isRejecting } = useContractWrite(contract, "rejectProject");

  const handleVote = async (projectId, value) => {
    try {
      if (isJudge) {
        // Judge's actions during judging period
        if (judgingDeadline > Date.now()) {
          if (value === 1) {
            await approveProject({ args: [projectId] });
          } else if (value === 2) {
            await rejectProject({ args: [projectId] });
          }
        } else {
          console.error("Judging period has ended");
        }
      } else {
        // User's actions during voting period
        if (votingDeadline > Date.now()) {
          await vote({ args: [projectId, value] });
        } else {
          console.error("Voting period has ended");
        }
      }
      refetch(); // Refresh the project list after voting
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <ChakraProvider>
      <Navbar />
      <Flex
        direction="column"
        align="center"
        h="100vh"
        bgColor="black"
        color="white"
        animation="fadeIn 1s ease-in-out"
        justify="center"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Projects Page
        </Heading>
        {votingDeadline > Date.now() ? (
          <Text fontSize="xl" mb={6}>
            {isJudge ? "Judging Deadline" : "Voting Deadline"}: {new Date(isJudge ? judgingDeadline : votingDeadline).toLocaleString()}
          </Text>
        ) : (
          <Text fontSize="xl" mb={6}>
            {isJudge ? "Judging has ended." : "Voting has ended."}
          </Text>
        )}
        {projects.map((project, index) => (
          <Box key={index} mb={4}>
            <Heading as="h3" size="lg" mb={2}>
              {project.name}
            </Heading>
            <Text fontSize="md" mb={2}>
              Status: {project.status}
            </Text>
            {votingDeadline > Date.now() ? (
              <Flex>
                <Button
                  colorScheme="brand"
                  size="sm"
                  onClick={() => handleVote(index, 1)} // Vote with value 1
                  isLoading={isVoting || isApproving || isRejecting}
                >
                  Vote Up
                </Button>
                <Button
                  colorScheme="brand"
                  size="sm"
                  onClick={() => handleVote(index, 2)} // Vote with value 2
                  isLoading={isVoting || isApproving || isRejecting}
                >
                  Vote Down
                </Button>
              </Flex>
            ) : (
              <Text fontSize="sm">
                {isJudge ? "Judging period has ended." : "Voting period has ended."}
              </Text>
            )}
          </Box>
        ))}
      </Flex>
    </ChakraProvider>
  );
}
