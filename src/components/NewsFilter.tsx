import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { NewsFilterParams } from '../types';

interface NewsFilterProps {
  filters: NewsFilterParams;
  onFilterChange: (filters: NewsFilterParams) => void;
}

const NewsFilter: React.FC<NewsFilterProps> = ({ filters, onFilterChange }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
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