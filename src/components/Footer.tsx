import React from 'react';
import { Box, Container, Flex, Text, Link, Stack } from '@chakra-ui/react';

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
            <Text fontSize="lg" fontWeight="bold">Follow Us</Text>
            <Link href="https://www.facebook.com">Facebook</Link>
            <Link href="https://www.instagram.com/">Instagram</Link>
            <Link href="https://github.com/bxdoan">GitHub</Link>
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