// @ts-nocheck
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  IconButton,
  Link,
  useColorModeValue,
  Button,
  Tooltip,
  Badge,
  Divider,
  useClipboard,
  useToast,
  Image,
} from '@chakra-ui/react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaTelegram, 
  FaGithub, 
  FaFacebookF, 
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import SEO from '../components/Common/SEO';

const ContactBox = ({ icon, title, value, link, color }) => {
  const { hasCopied, onCopy } = useClipboard(value);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const handleCopy = () => {
    onCopy();
    toast({
      title: "Đã sao chép!",
      description: `${title} đã được sao chép vào clipboard.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  
  return (
    <Box
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue(`${color}.200`, `${color}.700`)}
      bg={bgColor}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
      position="relative"
      overflow="hidden"
    >
      <Box 
        position="absolute" 
        top={0} 
        left={0} 
        right={0} 
        h="6px" 
        bg={`${color}.500`} 
      />
      
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={3}>
          <Box
            as="span"
            p={2}
            borderRadius="full"
            bg={useColorModeValue(`${color}.100`, `${color}.900`)}
            color={`${color}.500`}
          >
            {icon}
          </Box>
          <Heading size="md" fontWeight="bold">
            {title}
          </Heading>
        </HStack>
        
        <Tooltip label={hasCopied ? "Đã sao chép!" : "Sao chép"}>
          <IconButton
            aria-label="Sao chép"
            icon={hasCopied ? <FaCheck /> : <FaCopy />}
            size="sm"
            colorScheme={color}
            variant="ghost"
            onClick={handleCopy}
          />
        </Tooltip>
      </Flex>
      
      <Text mb={4} fontSize="lg" fontWeight="medium">{value}</Text>
      
      {link && (
        <Button
          as={Link}
          href={link}
          isExternal
          colorScheme={color}
          variant="outline"
          size="md"
          width="full"
          rightIcon={icon}
        >
          Liên hệ qua {title}
        </Button>
      )}
    </Box>
  );
};

const ContactPage: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <>
      <SEO 
        title="Liên hệ với Shuijiao - Nền tảng học đa ngôn ngữ"
        description="Liên hệ với Shuijiao qua email, điện thoại, mạng xã hội hoặc nhắn tin trực tiếp để được hỗ trợ và kết nối."
        keywords="liên hệ, contact, shuijiao, hỗ trợ, email, telegram, facebook, zalo"
        ogType="website"
      />
      
      <Box bg={bgColor} py={12}>
        <Container maxW="container.lg">
          <VStack spacing={10} align="stretch">
            <Box textAlign="center">
              <Badge 
                colorScheme="blue" 
                fontSize="md" 
                py={1} 
                px={3} 
                borderRadius="full" 
                mb={3}
              >
                Kết nối với chúng tôi
              </Badge>
              <Heading 
                as="h1" 
                size="2xl" 
                mb={6} 
                bgGradient="linear(to-r, red.500, yellow.500)" 
                bgClip="text"
              >
                Liên hệ Shuijiao
              </Heading>
              <Text 
                fontSize="xl" 
                maxW="container.md" 
                mx="auto" 
                opacity={0.8}
              >
                Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến đóng góp của bạn. 
                Hãy liên hệ theo một trong những cách dưới đây.
              </Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mt={8}>
              <ContactBox 
                icon={<FaEnvelope size={18} />}
                title="Email"
                value="contact@shuijiao.vn"
                link="mailto:contact@shuijiao.vn"
                color="blue"
              />
              
              <ContactBox 
                icon={<FaPhone size={18} />}
                title="Điện thoại"
                value="+84 915 670 892"
                link="tel:+84915670892"
                color="green"
              />
              
              <ContactBox 
                icon={<FaTelegram size={18} />}
                title="Telegram"
                value="@shuijiaovn"
                link="https://t.me/shuijiaovn"
                color="telegram"
              />
              
              <ContactBox 
                icon={<SiZalo size={18} />}
                title="Zalo"
                value="0915670892"
                link="https://zalo.me/0915670892"
                color="purple"
              />
              
              <ContactBox 
                icon={<FaFacebookF size={18} />}
                title="Facebook"
                value="facebook.com/shuijiaovn"
                link="https://www.facebook.com/shuijiaovn"
                color="facebook"
              />
              
              <ContactBox 
                icon={<FaGithub size={18} />}
                title="GitHub"
                value="github.com/bxdoan"
                link="https://github.com/bxdoan"
                color="gray"
              />
            </SimpleGrid>
            
            <Divider my={4} />
            
            <Box
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow="lg"
              textAlign="center"
            >
              <Flex direction="column" align="center" justify="center">
                <Image 
                  src={process.env.PUBLIC_URL + '/shuijiao.png'} 
                  alt="Shuijiao Logo" 
                  boxSize="100px" 
                  borderRadius="full"
                  mb={4}
                  p={1}
                  border="2px solid"
                  borderColor="yellow.400"
                />
                <Heading as="h3" size="lg" mb={3} color="red.500">
                  Cùng học ngôn ngữ với Shuijiao
                </Heading>
                <Text fontSize="lg" mb={6} maxW="container.md">
                  Cảm ơn bạn đã quan tâm đến Shuijiao - nền tảng học ngôn ngữ thông qua tin tức thực tế.
                  Chúng tôi luôn nỗ lực cải thiện và phát triển để mang đến trải nghiệm tốt nhất cho người dùng.
                </Text>
                <Button
                  as={Link}
                  href="/"
                  colorScheme="yellow"
                  size="lg"
                  px={8}
                  fontWeight="bold"
                  _hover={{ transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  Khám phá Shuijiao ngay
                </Button>
              </Flex>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default ContactPage; 