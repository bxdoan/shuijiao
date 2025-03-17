import React from 'react';
import { Box, Container, Flex, Text, Link, Stack, IconButton } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box as="footer" bg="gray.800" color="white" py={8} mt={10}>
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="start" gap={8}>
          <Stack spacing={3} align="flex-start">
            <Text fontSize="xl" fontWeight="bold">Kim Én Chinese</Text>
            <Text>Learn Chinese with real-world news articles</Text>
            <Text>Email: contact@kimenchinese.com</Text>
            <Text>Phone: +84 123 456 789</Text>
          </Stack>
          
          <Stack spacing={3} align="flex-start">
            <Text fontSize="lg" fontWeight="bold">Quick Links</Text>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </Stack>
          
          <Stack spacing={3} align="flex-start">
            <Text fontSize="lg" fontWeight="bold">Resources</Text>
            <Link href="/lessons">Lessons</Link>
            <Link href="/dictionary">Dictionary</Link>
            <Link href="/grammar">Grammar</Link>
          </Stack>
          
          <Stack spacing={3} align="flex-start">
            <Text fontSize="lg" fontWeight="bold">Follow Us</Text>
            <Flex gap={4}>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  aria-label="Facebook"
                  icon={<FaFacebook />}
                  size="md"
                  fontSize="20px"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'blue.500' }}
                />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  aria-label="Twitter"
                  icon={<FaTwitter />}
                  size="md"
                  fontSize="20px"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'blue.400' }}
                />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  aria-label="Instagram"
                  icon={<FaInstagram />}
                  size="md"
                  fontSize="20px"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'pink.500' }}
                />
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <IconButton
                  aria-label="YouTube"
                  icon={<FaYoutube />}
                  size="md"
                  fontSize="20px"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'red.500' }}
                />
              </Link>
              <Link href="https://github.com/bxdoan" target="_blank" rel="noopener noreferrer">
                <IconButton
                  aria-label="GitHub"
                  icon={<FaGithub />}
                  size="md"
                  fontSize="20px"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'gray.600' }}
                />
              </Link>
            </Flex>
          </Stack>
        </Flex>
        
        <Box borderTopWidth={1} borderTopColor="gray.600" mt={8} pt={6}>
          <Text textAlign="center">
            © {currentYear} Kim Én Chinese. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 