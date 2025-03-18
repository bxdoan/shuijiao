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
  IconButton,
  Image
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
      bgGradient="linear(to-r, red.800, red.600, yellow.600)"
      color="white"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
      position="sticky"
      top="0"
      zIndex="1"
      transition="all 0.3s ease-in-out"
      _hover={{ boxShadow: "0 6px 16px rgba(236, 201, 75, 0.3)" }}
    >
      {/* @ts-ignore - Suppress complex union type error */}
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Image 
              src={process.env.PUBLIC_URL + '/shuijiao.png'} 
              alt="Logo" 
              boxSize="45px" 
              mr={2}
              borderRadius="full"
              boxShadow="0 0 0 3px #ECC94B"
              transition="all 0.3s"
              _hover={{ transform: 'scale(1.1)', boxShadow: "0 0 0 3px red.500, 0 0 15px yellow.400" }}
            />
            <Heading as="h1" size="lg" fontFamily="'Noto Serif', serif">
              <Link to="/">
                <Box 
                  as="span" 
                  fontSize="2xl" 
                  fontWeight="bold" 
                  color="yellow.300"
                  textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                  mr={1}
                  transition="color 0.3s"
                  _hover={{ color: "yellow.200" }}
                >
                  Shui Jiao
                </Box>
                <Box 
                  as="span"
                  textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                  transition="color 0.3s"
                  _hover={{ color: "yellow.100" }}
                >
                  Chinese
                </Box>
              </Link>
            </Heading>
          </Flex>

          <HStack spacing="4">
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              aria-label="Toggle color mode"
              variant="outline"
              color="yellow.300"
              borderColor="yellow.400"
              _hover={{ 
                bg: 'rgba(236, 201, 75, 0.15)', 
                transform: 'rotate(15deg)',
                borderColor: 'yellow.300'
              }}
              transition="all 0.3s"
              onClick={toggleColorMode}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header; 