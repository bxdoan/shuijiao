import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import ChinesePage from './pages/Chinese/Reading';
import AboutPage from './pages/AboutPage';
import EnglishPage from './pages/English/EnglishPage';
import NewsDetailPage from './pages/NewsDetailPage';
import TranslatePage from './pages/TranslatePage';
import DictPage from './pages/DictPage';
import ContactPage from './pages/ContactPage';
import LearnHSK from './pages/Chinese/HSK';
import HSKDetails from './pages/Chinese/HSKDetail';
import ChineseFlashCard from './pages/Chinese/FlashCard';
import VideoPage from './pages/Chinese/Video';
import VideoDetailPage from './pages/Chinese/VideoDetail';
import SEO from './components/Common/SEO';
import theme from './theme';
import ChineseVocabulary from './pages/Chinese/Vocabulary';
import ChineseVocabularyDetail from './pages/Chinese/VocabularyDetail';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <Router>
            {/* Default SEO settings for all pages */}
            <SEO />
            <Box minH="100vh" display="flex" flexDirection="column">
              <Header />
              <Box as="main" flex="1">
                <Routes>
                  <Route path="/" element={<ChinesePage />} />
                  <Route path="/zh" element={<ChinesePage />} />
                  <Route path="/en" element={<EnglishPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/translate" element={<TranslatePage />} />
                  <Route path="/zh/dict" element={<DictPage />} />
                  <Route path="/zh/r/:newsId" element={<NewsDetailPage />} />
                  <Route path="/zh/vi/hsk/:level" element={<LearnHSK />} />
                  <Route path="/zh/vi/hsk/:level/:lessonId" element={<HSKDetails />} />
                  <Route path="/zh/video" element={<VideoPage />} />
                  <Route path="/zh/video/:id" element={<VideoDetailPage />} />
                  <Route path="/zh/flashcard" element={<ChineseFlashCard words={[]} />} />
                  <Route path="/en/r/:newsId" element={<NewsDetailPage />} />
                  <Route path="/zh/vocab" element={<ChineseVocabulary />} />
                  <Route path="/zh/vocab/:category" element={<ChineseVocabularyDetail />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
            <Analytics />
          </Router>
        </ChakraProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
