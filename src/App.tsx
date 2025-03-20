import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EnglishPage from './pages/EnglishPage';
import NewsDetailPage from './pages/NewsDetailPage';

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
      <ChakraProvider>
        <Router>
          <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <Box as="main" flex="1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/en" element={<EnglishPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/zh/:newsId" element={<NewsDetailPage />} />
                <Route path="/en/:newsId" element={<NewsDetailPage />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
