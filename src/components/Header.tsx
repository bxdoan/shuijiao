import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  HStack,
  useColorMode,
  IconButton,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (!isLargerThan768) {
      setIsDrawerOpen(true);
    } else {
      navigate('/');
    }
  };

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
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.1)', boxShadow: "0 0 0 3px red.500, 0 0 15px yellow.400" }}
            cursor={!isLargerThan768 ? "pointer" : "default"}
            onClick={handleLogoClick}
          />
            {isLargerThan768 ? (
              <Link to="/">
                <Heading as="h1" size="lg" fontFamily="'Noto Serif', serif">
                  <Box 
                    as="span" 
                    fontSize="2xl" 
                    fontWeight="bold" 
                    color="yellow.300"
                    textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                    mr={1}
                    transition="color 0.3s"
                    _hover={{ color: "yellow.200" }}
                    cursor={!isLargerThan768 ? "pointer" : "default"}
                  >
                    Shuijiao
                  </Box>
                </Heading>
              </Link>
            ) : (
              <>
              <Heading as="h1" size="lg" fontFamily="'Noto Serif', serif">
                <Box 
                  as="span" 
                  fontSize="2xl" 
                  fontWeight="bold" 
                  color="yellow.300"
                  textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                  mr={1}
                  transition="color 0.3s"
                  _hover={{ color: "yellow.200" }}
                  cursor={!isLargerThan768 ? "pointer" : "default"}
                  onClick={handleLogoClick}
                >
                  Shuijiao
                </Box>
              </Heading>
              </>
            )}

            {isLargerThan768 && (
              <HStack spacing="4" ml={4}>
                <Button
                  as={Link}
                  to="/"
                  variant={location.pathname === '/' ? "solid" : "ghost"}
                  colorScheme="yellow"
                  size="md"
                >
                  Tiếng Trung
                </Button>
                <Button
                  as={Link}
                  to="/english"
                  variant={location.pathname === '/english' ? "solid" : "ghost"}
                  colorScheme="yellow"
                  size="md"
                >
                  Tiếng Anh
                </Button>
              </HStack>
            )}
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

      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg="red.800">
          <DrawerCloseButton color="yellow.300" />
          <DrawerHeader borderBottomWidth="1px" borderColor="yellow.600">
            <Flex align="center">
              <Image 
                src={process.env.PUBLIC_URL + '/shuijiao.png'} 
                alt="Logo" 
                boxSize="40px" 
                mr={2}
                borderRadius="full"
              />
              <Box 
                as="span" 
                fontSize="xl" 
                fontWeight="bold" 
                color="yellow.300"
                onClick={() => navigate('/')}
              >
                Shuijiao
              </Box>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              <Button
                as={Link}
                to="/"
                variant={location.pathname === '/' ? "solid" : "ghost"}
                colorScheme="yellow"
                size="lg"
                onClick={() => setIsDrawerOpen(false)}
              >
                Tiếng Trung
              </Button>
              <Button
                as={Link}
                to="/english"
                variant={location.pathname === '/english' ? "solid" : "ghost"}
                colorScheme="yellow"
                size="lg"
                onClick={() => setIsDrawerOpen(false)}
              >
                Tiếng Anh
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
