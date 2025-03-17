import React from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Button,
  HStack,
  useBreakpointValue,
  useColorMode,
  IconButton
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box 
      as="header" 
      py={4} 
      bg="red.700" 
      color="white"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      position="sticky"
      top="0"
      zIndex="1"
    >
      {/* @ts-ignore - Suppress complex union type error */}
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg" fontFamily="'Noto Serif', serif">
            <Link to="/">
              <Box 
                as="span" 
                fontSize="2xl" 
                fontWeight="bold" 
                color="yellow.400"
                mr={1}
              >
                Kim Én
              </Box>
              <Box as="span">Chinese</Box>
            </Link>
          </Heading>

          <HStack spacing="4">
            <Button 
              onClick={toggleColorMode} 
              variant="ghost" 
              color="white"
              _hover={{ bg: 'red.800' }}
            >
               <IconButton
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                aria-label="Toggle color mode"
                variant="ghost"
                color="white"
                _hover={{ bg: 'red.800' }}
               />
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header; 