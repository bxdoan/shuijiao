import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Button,
  useColorModeValue,
  Input,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { NewsFilterParams } from '../types';

interface NewsFilterProps {
  filters: NewsFilterParams;
  onFilterChange: (filters: NewsFilterParams) => void;
}

const NewsFilter: React.FC<NewsFilterProps> = ({ filters, onFilterChange }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onFilterChange({ 
      ...filters, 
      date: value,
      timestamp: value
    });
    setIsCalendarOpen(false);
  };

  const handleReset = () => {
    onFilterChange({
      topic: '',
      source: '',
      type: 'easy',
      page: 1,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString().split('T')[0],
    });
  };

  // Hàm tạo ngày định dạng YYYY-MM-DD từ số ngày trước
  const getDateBefore = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  // Hàm định dạng ngày thành MM-DD để hiển thị
  const formatDateMMDD = (dateStr: string): string => {
    // Lấy phần MM-DD từ chuỗi YYYY-MM-DD
    return dateStr.substring(5);
  };

  // Hàm xử lý khi click vào nút ngày
  const handleDateButtonClick = (days: number) => {
    const dateStr = days === 0 ? new Date().toISOString().split('T')[0] : getDateBefore(days);
    onFilterChange({
      ...filters,
      date: dateStr,
      timestamp: dateStr
    });
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      mb={6}
    >
      <Stack spacing={4}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <FormControl>
            <FormLabel>Difficulty</FormLabel>
            <Select name="type" value={filters.type || 'easy'} onChange={handleChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Topic</FormLabel>
            <Select name="topic" value={filters.topic || ''} onChange={handleChange}>
              <option value="">All Topics</option>
              <option value="World">World</option>
              <option value="China">China</option>
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Health">Health</option>
              <option value="Sports">Sports</option>
              <option value="Showbiz">Entertainment</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Source</FormLabel>
            <Select name="source" value={filters.source || ''} onChange={handleChange}>
              <option value="">All Sources</option>
              <option value="环球时报">Global Times</option>
              <option value="人民日报">People's Daily</option>
              <option value="新华社">Xinhua</option>
              <option value="中国日报">China Daily</option>
            </Select>
          </FormControl>
        </Stack>

        <FormControl>
          <FormLabel>Date</FormLabel>
          <Flex gap={2} alignItems="center">
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button 
                colorScheme={filters.date === new Date().toISOString().split('T')[0] ? "blue" : "gray"}
                onClick={() => handleDateButtonClick(0)}
              >
                Hôm nay
              </Button>
              <Button 
                colorScheme={filters.date === getDateBefore(1) ? "blue" : "gray"}
                onClick={() => handleDateButtonClick(1)}
              >
                {formatDateMMDD(getDateBefore(1))}
              </Button>
              <Button 
                colorScheme={filters.date === getDateBefore(2) ? "blue" : "gray"}
                onClick={() => handleDateButtonClick(2)}
              >
                {formatDateMMDD(getDateBefore(2))}
              </Button>
              <Button 
                colorScheme={filters.date === getDateBefore(3) ? "blue" : "gray"}
                onClick={() => handleDateButtonClick(3)}
              >
                {formatDateMMDD(getDateBefore(3))}
              </Button>
              <Button 
                colorScheme={filters.date === getDateBefore(4) ? "blue" : "gray"}
                onClick={() => handleDateButtonClick(4)}
              >
                {formatDateMMDD(getDateBefore(4))}
              </Button>
            </ButtonGroup>

            <Popover
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              placement="bottom-start"
            >
              <PopoverTrigger>
                <IconButton
                  aria-label="Select date"
                  icon={<CalendarIcon />}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  size="sm"
                />
              </PopoverTrigger>
              <PopoverContent width="auto">
                <PopoverArrow />
                <PopoverBody>
                  <Input
                    type="date"
                    value={filters.date}
                    onChange={handleDateChange}
                    size="sm"
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </FormControl>

        <Box alignSelf="flex-end">
          <Button colorScheme="blue" onClick={handleReset}>
            Reset Filters
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default NewsFilter; 