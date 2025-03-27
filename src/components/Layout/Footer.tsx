// @ts-nocheck
import React from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Text, 
  Heading, 
  Link, 
  Icon, 
  HStack,
  VStack,
  Divider,
  useMediaQuery
} from '@chakra-ui/react';
import { 
  FaInfoCircle,
  FaUserFriends,
  FaFacebook,
  FaInstagram,
  FaGithub
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import useQuote from '../../hooks/useQuote';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { quote, isLoading } = useQuote();

  const socialLinks = [
    {
      icon: FaFacebook,
      href: 'https://www.facebook.com/shuijiaovn',
      label: 'Facebook'
    },
    {
      icon: FaInstagram,
      href: 'https://www.instagram.com/shuijiaovn',
      label: 'Instagram'
    },
    {
      icon: FaGithub,
      href: 'https://github.com/bxdoan/shuijiao',
      label: 'GitHub'
    }
  ];

  const infoLinks = [
    {
      icon: FaInfoCircle,
      to: '/about',
      text: 'Giới thiệu'
    },
    {
      icon: FaUserFriends,
      to: '/contact',
      text: 'Liên hệ'
    }
  ];

  return (
    <Box
      as="footer"
      bgGradient="linear(to-r, red.800, red.600, yellow.600)"
      color="white"
      py={6}
      mt={8}
      boxShadow="0 -4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Container maxW="container.xl">
        <Flex
          direction={isMobile ? 'column' : 'row'}
          justify="space-between"
          align={isMobile ? 'center' : 'flex-start'}
          gap={6}
        >
          {/* Brand Section */}
          <VStack align={isMobile ? 'center' : 'flex-start'} spacing={4}>
            <Flex align="center" gap={2}>
              <Box
                as="img"
                src={process.env.PUBLIC_URL + '/shuijiao.png'}
                alt="Shuijiao Logo"
                boxSize="32px"
                borderRadius="full"
                transition="all 0.3s"
                _hover={{
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 0 2px #ef4444, 0 0 10px #facc15'
                }}
              />
              <Heading size="md" color="yellow.300">
                Shuijiao
              </Heading>
            </Flex>

            {isLoading ? (
              <Text color="yellow.100">Loading quote...</Text>
            ) : (
              <VStack 
                align="stretch"
                spacing={1}
                width="100%"
              >
                <Text 
                  color="yellow.100" 
                  fontStyle="italic"
                >
                  "{quote.quote}"
                </Text>
                <Flex justify="flex-end">
                  <Text 
                    color="yellow.200" 
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    - {quote.author} -
                  </Text>
                </Flex>
              </VStack>
            )}
          </VStack>

          {/* Info Section */}
          <VStack align={isMobile ? 'center' : 'flex-start'} spacing={4}>
            <Heading size="sm" color="yellow.300">
              Thông tin
            </Heading>
            {infoLinks.map((link, index) => (
              <Link
                key={index}
                as={RouterLink}
                to={link.to}
                color="yellow.100"
                _hover={{ color: 'yellow.300' }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={link.icon} />
                <Text>{link.text}</Text>
              </Link>
            ))}
          </VStack>

          {/* Social Section */}
          <VStack align={isMobile ? 'center' : 'flex-start'} spacing={4}>
            <Heading size="sm" color="yellow.300">
              Follow Us
            </Heading>
            <HStack spacing={4}>
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  isExternal
                  aria-label={link.label}
                  color="yellow.300"
                  _hover={{
                    color: 'yellow.200',
                    transform: 'scale(1.1)',
                    bg: 'rgba(236, 201, 75, 0.15)'
                  }}
                  transition="all 0.3s"
                  p={2}
                  borderRadius="md"
                >
                  <Icon as={link.icon} boxSize={5} />
                </Link>
              ))}
            </HStack>
          </VStack>
        </Flex>

        <Divider borderColor="yellow.600" my={6} />

        <Text textAlign="center" color="yellow.100">
          © {currentYear} Shuijiao. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};
