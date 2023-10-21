import { Box, Heading, Text, Spinner, Container, useColorModeValue, Link, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Database } from '@tableland/sdk';
import Navbar from '../components/Navbar'; // Import your Navbar component

const ViewProject = () => {

  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  const router = useRouter();
  const { projectId } = router.query;
  const [projectData, setProjectData] = useState<{ name: string; description: string; link: string; projects_id: number; votes: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = new Database();
        const tableName = "projects_table_80001_7901";
        const { results } = await db.prepare(`SELECT * FROM ${tableName} WHERE projects_id = ${projectId};`).all();
        console.log(results)
        setProjectData(results as { name: string; description: string; link: string; projects_id: number; votes: number }[]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from Tableland:', error);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const handleGoBack = () => {
    router.back(); // Function to navigate back
  }



  return (
    <Container
      maxW="100%"
      bgColor={bgColor}
      color={textColor}
      justifyContent="center"
      alignItems="center"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
    <Box p={8} bg="gray.100">
      <Navbar /> {/* Add your Navbar component here */}
      {loading ? (
        <Spinner size="xl" color="teal" mt={8} />
      ) : projectData.length > 0 ? (
        <Box mt={8}> 
           <Button
              position="absolute" // Position the button absolutely
              top="20" // Position at the top
              left="30" // Position at the left
              bgColor="black"
              color="white"
              onClick={() => handleGoBack()}
              _hover={{ color: 'white' }}
              _focus={{ color: 'white', outline: 'none' }}
            >
              Go back
            </Button>
          {projectData.map((project) => (
            <Box
              key={project.projects_id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              shadow="md"
              bg="gray.200"
              mb={4}
            >
              <Heading as="h2" size="lg" mb={2}>
                <strong>{project.name}</strong>
              </Heading>
              <Text fontSize="lg">{project.description}</Text>
              <Link fontSize="md" color="blue.500" href={project.link} isExternal>
                  Project Page Link
              </Link>              {/* Add more fields as needed */}
            </Box>
          ))}
        </Box>
      ) : (
        <Text mt={8} fontSize="lg">
          Project not found
        </Text>
      )}
    </Box>
    </Container>
  );
};

export default ViewProject;
