import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <Flex justify="center" align="center" mt={6} mb={6}>
      <Button
        aria-label="Previous page"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        mr={2}
        leftIcon={<ChevronLeftIcon />}
        size="sm"
      >
        Prev
      </Button>
      
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <Button
            key={index}
            mx={1}
            colorScheme={currentPage === page ? 'blue' : 'gray'}
            variant={currentPage === page ? 'solid' : 'outline'}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <Text key={index} mx={1}>
            {page}
          </Text>
        )
      ))}
      
      <Button
        aria-label="Next page"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        ml={2}
        rightIcon={<ChevronRightIcon />}
        size="sm"
      >
        Next
      </Button>
    </Flex>
  );
};

export default Pagination; 