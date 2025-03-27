// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  VStack,
} from '@chakra-ui/react';

import ChineseFlashCard from './FlashCard';
import SEO from '../../components/Common/SEO';

export const ChineseVocabularyDetail: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <>
      <SEO
        title="Học từ vựng tiếng Trung - Shuijiao"
        description="Học từ vựng tiếng Trung hiệu quả với phương pháp flashcard"
        keywords="học tiếng Trung, flashcard, từ vựng tiếng Trung"
      />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <ChineseFlashCard 
            category={category}
            routeBack="/zh/vocab"
          />
        </VStack>
      </Container>
    </>
  );
};


export const ChineseVocabularyHSK: React.FC = () => {
  const { level } = useParams<{ level: string }>();

  const hskLevels = ['1', '2', '3', '4', '5', '6', '7-9'];
  if (!hskLevels.includes(level)) {
    return <div>Không tìm thấy cấp độ HSK</div>;
  }

  return (
    <>
      <SEO
        title="Học từ vựng tiếng Trung - Shuijiao"
        description="Học từ vựng tiếng Trung hiệu quả với phương pháp flashcard"
        keywords="học tiếng Trung, flashcard, từ vựng tiếng Trung"
      />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <ChineseFlashCard 
            hsk={level}
            routeBack="/zh/vocab"
          />
        </VStack>
      </Container>
    </>
  );
};
