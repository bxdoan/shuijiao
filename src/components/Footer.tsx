import React from 'react';
import { Box, Container, Flex, Text, Link, Stack } from '@chakra-ui/react';
import SocialIcons from './SocialIcons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box as="footer" bg="gray.800" color="white" py={8} mt={10}>
      {/* @ts-ignore - Suppress complex union type error */}
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
            <SocialIcons />
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