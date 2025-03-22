import React from 'react';
import ChineseDict from '../components/Dictionary/ChineseDict';
import { Box } from '@chakra-ui/react';
import SEO from '../components/Common/SEO';
import ScrollToTopBottom from '../components/Common/ScrollToTopBottom';

const DictPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Từ điển Hán Việt - Shuijiao"
        description="Tra cứu từ điển Hán Việt với đầy đủ nghĩa, cách đọc, cách viết và thông tin hán tự."
        keywords="từ điển Hán Việt, tra từ tiếng Trung, học tiếng Trung, tra hán tự, cách viết hán tự, bộ thủ"
        ogType="website"
      />
      <Box as="main" flex="1">
        <ChineseDict targetLang="vi" />
        <ScrollToTopBottom />
      </Box>
    </>
  );
};

export default DictPage; 