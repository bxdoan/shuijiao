import React from 'react';
import { Box, HStack, Link } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

const SocialIcons: React.FC = () => {
  return (
    <HStack spacing={4}>
      <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <Box 
          as="span" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          w="40px" 
          h="40px" 
          borderRadius="md" 
          color="white" 
          _hover={{ bg: 'blue.500', transform: 'translateY(-2px)' }}
          transition="all 0.3s"
        >
          <FaFacebook size={20} />
        </Box>
      </Link>
      <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <Box 
          as="span" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          w="40px" 
          h="40px" 
          borderRadius="md" 
          color="white" 
          _hover={{ bg: 'blue.400', transform: 'translateY(-2px)' }}
          transition="all 0.3s"
        >
          <FaTwitter size={20} />
        </Box>
      </Link>
      <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <Box 
          as="span" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          w="40px" 
          h="40px" 
          borderRadius="md" 
          color="white" 
          _hover={{ bg: 'pink.500', transform: 'translateY(-2px)' }}
          transition="all 0.3s"
        >
          <FaInstagram size={20} />
        </Box>
      </Link>
      <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <Box 
          as="span" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          w="40px" 
          h="40px" 
          borderRadius="md" 
          color="white" 
          _hover={{ bg: 'red.500', transform: 'translateY(-2px)' }}
          transition="all 0.3s"
        >
          <FaYoutube size={20} />
        </Box>
      </Link>
      <Link href="https://github.com/bxdoan" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <Box 
          as="span" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          w="40px" 
          h="40px" 
          borderRadius="md" 
          color="white" 
          _hover={{ bg: 'gray.600', transform: 'translateY(-2px)' }}
          transition="all 0.3s"
        >
          <FaGithub size={20} />
        </Box>
      </Link>
    </HStack>
  );
};

export default SocialIcons; 