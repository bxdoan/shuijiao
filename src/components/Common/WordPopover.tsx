// @ts-nocheck
import React from 'react';
import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Spinner,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { FaVolumeUp } from 'react-icons/fa';
import { playTextToSpeech } from '../../utils/utils';

interface WordPopoverProps {
  word: string;
  trigger: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  wordData?: {
    pinyin: string;
    cn_vi: string;
    example?: {
      e: string;
      p: string;
      m: string;
    };
    isLoading: boolean;
  };
}

const WordPopover: React.FC<WordPopoverProps> = ({
  word,
  trigger,
  onOpen,
  onClose,
  wordData,
}) => {
  return (
    <Popover 
      isLazy
      placement="top"
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        bg="white" 
        borderColor="gray.200" 
        boxShadow="xl"
        _dark={{
          bg: "gray.800",
          borderColor: "gray.600"
        }}
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="semibold" borderBottomWidth="1px">
          <Flex align="center" gap={2}>
            <Text>{word}</Text>
            <IconButton
              aria-label="Phát âm"
              icon={<FaVolumeUp />}
              onClick={() => playTextToSpeech(word, 'zh-CN')}
              colorScheme="blue"
              variant="ghost"
              size="sm"
            />
          </Flex>
        </PopoverHeader>
        <PopoverBody p={3}>
          {wordData ? (
            wordData.isLoading ? (
              <Flex justify="center" py={2}>
                <Spinner size="sm" color="blue.500" mr={2} />
                <Text>Đang tải...</Text>
              </Flex>
            ) : (
              <Box>
                <Text fontStyle="italic" color="gray.600" mb={1}>
                  {wordData.pinyin}
                </Text>
                <Text fontWeight="medium" color="blue.600" mb={2}>
                  {wordData.cn_vi}
                </Text>
                {wordData.example && (
                  <Box 
                    mt={2} 
                    borderLeft="2px" 
                    borderColor="blue.500" 
                    pl={2}
                    fontSize="sm"
                  >
                    <Text fontWeight="semibold">{wordData.example.e}</Text>
                    <Text fontStyle="italic">{wordData.example.p}</Text>
                    <Text color="blue.600">{wordData.example.m}</Text>
                  </Box>
                )}
              </Box>
            )
          ) : (
            <Flex justify="center" py={2}>
              <Spinner size="sm" color="blue.500" mr={2} />
              <Text>Đang tải...</Text>
            </Flex>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default WordPopover; 