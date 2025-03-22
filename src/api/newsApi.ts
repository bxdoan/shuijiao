import axios from 'axios';
import {
  NewsFilterParams,
  NewsResponse,
  LanguageConfigMap,
  SearchResponse,
  KanjiResponse,
  NewsDetailChinese,
  NewsDetailEnglish
} from '../types';
import * as utils from '../utils/utils';

// Create a configuration structure to manage settings for multiple languages
const languageConfig: LanguageConfigMap = {
  zh: {
    apiBaseUrl: 'https://api.easychinese.io/api',
    origin: 'https://easychinese.io',
    referer: 'https://easychinese.io/',
    apiKey: 'qidKNYDRnnbXYyUNnXKiYvRrJveH4CCS'
  },
  en: {
    apiBaseUrl: 'https://api.todaienglish.com/api',
    origin: 'https://todaienglish.com',
    referer: 'https://todaienglish.com/',
    apiKey: ''
  },
  // Add new languages here
  // de: {
  //   apiBaseUrl: 'https://api.todaigerman.com/api',
  //   origin: 'https://todaigerman.com',
  //   referer: 'https://todaigerman.com/',
  //   apiKey: ''
  // },
};

// API proxy URL - based on current environment
const isProduction = process.env.NODE_ENV === 'production';
// In development, use localhost:3001
// In production, use relative path to call API from same domain
export const API_PROXY_URL = isProduction 
  ? '/api' 
  : 'http://localhost:3001/api';

// Define interface for apiClients
interface ApiClientMap {
  [key: string]: any; // any because axios client doesn't have a clear interface
}

// Function to create API client based on language
const createApiClient = (language: string) => {
  const config = languageConfig[language] || languageConfig.en;
  
  return axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Origin': config.origin,
      'Referer': config.referer,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      ...(config.apiKey && { 'Authorization': config.apiKey })
    }
  });
};

// Cache API clients to avoid creating new ones on each API call
const apiClients: ApiClientMap = {};

// Get API client for specific language, create new if not exists
const getApiClient = (language: string) => {
  if (!apiClients[language]) {
    apiClients[language] = createApiClient(language);
  }
  return apiClients[language];
};

// Interface for data returned from translation API
export interface TranslationResponse {
  id: number;
  news_id: string;
  content: string;
  country: string;
  created_at: string;
  author: {
    id: number;
    name: string;
  };
  voted?: any;
  like?: number;
  dislike?: number;
}

// Function to call API for article translation
export const fetchTranslation = async (
    newsId: string,
    language: string = 'vi',
    useCache: boolean = false
): Promise<Record<string, string> | null> => {
  try {
    console.log(`Fetching translation for news ID: ${newsId} in language: ${language}, useCache: ${useCache}`);
    
    // Determine endpoint based on useCache parameter
    const endpoint = useCache ? 'cached-translate' : 'translate';
    
    // Call API through proxy server to avoid CORS issues
    const response = await axios.get(`${API_PROXY_URL}/${endpoint}`, { 
      params: { 
        news_id: newsId, 
        lang: language 
      }
    });

    // Check and process data
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    // Return default value when no data
    return null;
    
  } catch (error) {
    console.error('Error fetching translation:', error);
    // Display detailed error message
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Response headers:', error.response?.headers);
    }
    return null;
  }
};

export const fetchGoogleTranslation = async (text: string, targetLang: string = 'vi', srcLang: string = 'auto') => {
  try {
    // Determine source language based on content
    // By default, it will auto-detect the source language
    const sourceLang = srcLang === 'auto' ? (containsChineseCharacters(text) ? 'zh' : 'en') : srcLang;
    
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(text)}`
    );
    
    if (!response.ok) {
      throw new Error(`Google Translate error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process complex results from Google
    let translatedText = '';
    
    // Iterate through elements in the sentences array
    if (data.sentences) {
      for (const sentence of data.sentences) {
        if (sentence.trans) {
          translatedText += sentence.trans;
        }
      }
    }
    
    return translatedText;
  } catch (error) {
    console.error('Google Translate API error:', error);
    throw error;
  }
};

export const translateSentences = async (
  text: string, sourceLang: string = 'zh', targetLang: string = 'vi'
) => {
  const sentences = utils.splitTextIntoSentences(text, sourceLang);
  const translatedSentences = [];
  
  try {
    // Optimization: translate sentences in batches rather than individually
    for (const sentence of sentences) {
      if (!sentence.trim()) continue; // Skip empty sentence
      
      const translatedSentence = await fetchGoogleTranslation(sentence, targetLang, sourceLang);
      if (translatedSentence) {
        translatedSentences.push(translatedSentence);
      }
    }
    
    return translatedSentences.join(' ');
  } catch (error) {
    console.error('Error in translateSentences:', error);
    return text;
  }
};


// Helper function to check if text contains Chinese characters
function containsChineseCharacters(text: string): boolean {
  // Unicode range for Han characters
  const chineseRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;
  return chineseRegex.test(text);
}

export const fetchNews = async (params: NewsFilterParams = {}): Promise<NewsResponse> => {
  // Ensure we have today's date in the correct format
  const today = new Date().toISOString().split('T')[0];
  
  const defaultParams: NewsFilterParams = {
    topic: '',
    date: today,
    source: '',
    type: 'easy',
    limit: 40,
    page: 1,
    timestamp: today,
    language: params.language || 'zh' // Default to Chinese if not specified
  };

  const mergedParams = { ...defaultParams, ...params };
  const { language, ...apiParams } = mergedParams; // Extract language to select appropriate API client
  let targetLanguage = language || 'zh';
  
  try {
    // Check if language is supported
    if (!languageConfig[targetLanguage]) {
      console.warn(`Language ${targetLanguage} is not supported. Falling back to English.`);
      targetLanguage = 'en';
    }
    
    // Get appropriate API client for chosen language
    const apiClient = getApiClient(targetLanguage);
    
    // Call common API endpoint for all languages
    const response = await apiClient.post('/news/filter', apiParams);
    
    // API returns array of NewsItem directly
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: mergedParams.page || 1,
        limit: mergedParams.limit || 40
      };
    }
    
    // If API doesn't return array or has no data
    if (!response.data) {
      console.warn('API response does not match expected format, creating default structure');
      return {
        data: [],
        total: 0,
        page: mergedParams.page || 1,
        limit: mergedParams.limit || 40
      };
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${targetLanguage} news:`, error);
    // Return a default response on error
    return {
      data: [],
      total: 0,
      page: mergedParams.page || 1,
      limit: mergedParams.limit || 40
    };
  }
};


// Function to get news details
export const getNewsDetail = async (
  newsId: string, 
  language: string = 'zh'
): Promise<NewsDetailEnglish | NewsDetailChinese | null> => {
  try {
    const targetLanguage = languageConfig[language] ? language : 'zh';
    const apiClient = getApiClient(targetLanguage);
    
    // Different endpoints depending on language
    let endpoint = '';
    if (targetLanguage === 'en') {
      // Endpoint for English uses query parameter
      endpoint = `/news/detail?news_id=${newsId}`;
    } else {
      // Endpoint for Chinese and other languages
      endpoint = `/detail/${newsId}`;
    }
    
    const response = await apiClient.get(endpoint);
    
    if (response.data) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching news details:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    return null;
  }
};

// Common search function for vocabulary and kanji
export const fetchDictionary = async (
  term: string,
  targetLang: string = 'vi',
  type: string = 'word',
  page: number = 1,
  limit: number = 50
): Promise<SearchResponse | KanjiResponse | null> => {
  if (!term.trim()) return null;

  try {
    const response = await fetch(
      `https://api.hanzii.net/api/search/${targetLang}/${encodeURIComponent(term)}?type=${type}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': '37783281518601508919736764542798',
          'origin': 'https://hanzii.net',
          'referer': 'https://hanzii.net/'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Error searching for ${type} ${term} ${targetLang} ${page} ${limit}:`, error);
    return null;
  }
};

