// @ts-nocheck
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  useColorModeValue,
  Button,
  useToast,
  HStack,
  Stack,
  Badge,
  IconButton
} from '@chakra-ui/react';
import { CopyIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaHandHoldingHeart } from 'react-icons/fa';

import { qrCodeUrl } from '../../utils/utils';

interface DonationBoxProps {
  title?: string;
  description?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  transferMessage?: string;
  supportLink?: string;
}

export const DonationBox: React.FC<DonationBoxProps> = ({
  title = "Ủng hộ dự án Shuijiao",
  description = "Nếu bạn thấy ứng dụng hữu ích, hãy ủng hộ để chúng tôi có thể phát triển thêm nhiều tính năng mới.",
  bankName = "MBBANK",
  accountNumber = "0904195065",
  accountHolder = "Bui Xuan Doan",
  transferMessage = "Ho tro Shuijiao",
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.400', 'blue.500');
  const toast = useToast();

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: `${fieldName} đã được sao chép vào clipboard`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom"
    });
  };

  const bankDetails = {
    bankId: bankName,
    accountNumber: accountNumber,
    accountHolder: accountHolder,
    transferContent: transferMessage,
    template: "compact2",
  };

  const qrUrl = qrCodeUrl(bankDetails);

  return (
    <Box 
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      p={5}
      textAlign="center"
      width="100%"
    >
      <Heading as="h3" size="md" mb={3} color="blue.600">
        {title}
      </Heading>
      <Text mb={4}>
        {description}
      </Text>
      <Flex direction={{ base: "column", md: "row" }} alignItems="center" justifyContent="center" gap={4}>
        <Box>
          <Image 
            src={qrUrl} 
            alt="QR Code chuyển khoản" 
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            boxSize={{ base: "200px", md: "180px" }}
            height={{ base: "250px", md: "220px" }}
          />
        </Box>
        <Box textAlign={{ base: "center", md: "left" }}>
          <Text fontWeight="bold" mb={2}>Thông tin chuyển khoản:</Text>
          
          <HStack mb={1} justify={{ base: "center", md: "flex-start" }}>
            <Text>Ngân hàng: {bankName}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(bankName, "Ngân hàng")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
          
          <HStack mb={1} justify={{ base: "center", md: "flex-start" }}>
            <Text>Số tài khoản: {accountNumber}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(accountNumber, "Số tài khoản")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
          
          <HStack mb={1} justify={{ base: "center", md: "flex-start" }}>
            <Text>Chủ tài khoản: {accountHolder}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(accountHolder, "Chủ tài khoản")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
          
          <HStack mt={2} justify={{ base: "center", md: "flex-start" }}>
            <Text fontStyle="italic">Nội dung: {transferMessage}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(transferMessage, "Nội dung")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

// DonationBoxCompact - Phiên bản compact để hiển thị giữa các tin tức
export const DonationBoxCompact: React.FC<DonationBoxProps> = ({
  title = "Ủng hộ dự án Shuijiao",
  description = "Nếu bạn thấy ứng dụng hữu ích, hãy ủng hộ để chúng tôi có thể phát triển thêm nhiều tính năng mới.",
  bankName = "MBBANK",
  accountNumber = "0904195065",
  accountHolder = "Bui Xuan Doan",
  transferMessage = "Ho tro Shuijiao",
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const highlightColor = useColorModeValue('blue.50', 'blue.900');
  const toast = useToast();

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: `${fieldName} đã được sao chép vào clipboard`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom"
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box bgGradient="linear(to-r, blue.400, purple.500)" p={1.5}>
        <Text color="white" fontWeight="bold" textAlign="center">
          Hỗ trợ phát triển
        </Text>
      </Box>

      <Stack p={3} spacing={2} flex="1">
        <Box mb={1}>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Badge colorScheme="blue">Ủng hộ</Badge>
              <Badge colorScheme="purple">Phát triển</Badge>
              <IconButton
                aria-label="Ủng hộ"
                icon={<FaHandHoldingHeart />}
                size="xs"
                colorScheme="red"
                variant="outline"
              />
            </Stack>
          </Flex>

          <Heading as="h3" size="md" mb={1}>
            {title}
          </Heading>

          <Text fontSize="xs" color="gray.600" mb={1} noOfLines={2}>
            {description}
          </Text>
        </Box>

        <Flex 
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          flex="1"
        >
          <Box 
            borderWidth="1px" 
            borderRadius="md" 
            borderColor="gray.200" 
            p={1}
            bg="white"
            minW={{ base: "auto", md: "180px" }}
            alignSelf={{ base: "center", md: "flex-start" }}
          >
            <Image 
              src={process.env.PUBLIC_URL + '/assets/MBBank-compact.png'} 
              alt="QR Code chuyển khoản" 
              objectFit="cover"
              borderRadius="md"
              boxSize={{ base: "180px", md: "180px" }}
              maxH={{ md: "180px" }}
            />
          </Box>
          
          <Stack 
            spacing={1} 
            bg={highlightColor} 
            p={2} 
            borderRadius="md" 
            flex="1"
            maxW={{ md: "calc(100% - 190px)" }}
            fontSize="xs"
          >
            <HStack justify="space-between">
              <Text fontWeight="medium">Ngân hàng:</Text>
              <HStack spacing={1}>
                <Text fontWeight="bold">{bankName}</Text>
                <Button 
                  size="xs" 
                  onClick={() => handleCopy(bankName, "Ngân hàng")}
                  colorScheme="blue"
                  variant="ghost"
                  h="1.4rem"
                  minW="3rem"
                  p={0}
                  leftIcon={<CopyIcon fontSize="10px" />}
                >
                  Copy
                </Button>
              </HStack>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Số TK:</Text>
              <HStack spacing={1}>
                <Text fontWeight="bold">{accountNumber}</Text>
                <Button 
                  size="xs" 
                  onClick={() => handleCopy(accountNumber, "Số tài khoản")}
                  colorScheme="blue"
                  variant="ghost"
                  h="1.4rem"
                  minW="3rem"
                  p={0}
                  leftIcon={<CopyIcon fontSize="10px" />}
                >
                  Copy
                </Button>
              </HStack>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Chủ TK:</Text>
              <HStack spacing={1}>
                <Text fontWeight="bold">{accountHolder}</Text>
                <Button 
                  size="xs" 
                  onClick={() => handleCopy(accountHolder, "Chủ tài khoản")}
                  colorScheme="blue"
                  variant="ghost"
                  h="1.4rem"
                  minW="3rem"
                  p={0}
                  leftIcon={<CopyIcon fontSize="10px" />}
                >
                  Copy
                </Button>
              </HStack>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Nội dung:</Text>
              <HStack spacing={1}>
                <Text fontWeight="bold" fontStyle="italic">{transferMessage}</Text>
                <Button 
                  size="xs" 
                  onClick={() => handleCopy(transferMessage, "Nội dung")}
                  colorScheme="blue"
                  variant="ghost"
                  h="1.4rem"
                  minW="3rem"
                  p={0}
                  leftIcon={<CopyIcon fontSize="10px" />}
                >
                  Copy
                </Button>
              </HStack>
            </HStack>
          </Stack>
        </Flex>

        <Button
          size="xs"
          colorScheme="blue"
          rightIcon={<ChevronRightIcon />}
          alignSelf="flex-end"
          onClick={() => window.location.href = "/about"}
        >
          Xem chi tiết
        </Button>
      </Stack>
    </Box>
  );
};

export default DonationBox; 