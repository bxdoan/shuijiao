import {
  VocabularyCategoryResponse,
  VocabularyResponse,
  SearchResponse,
  KanjiResponse
} from '../types';

// API Constants
const API_BASE_URL = 'https://api.hanzii.net/api';
const API_AUTH_TOKEN = '37783281518601508919736764542798';

// Common headers
const getCommonHeaders = () => ({
  'accept': 'application/json, text/plain, */*',
  'authorization': API_AUTH_TOKEN,
  'content-type': 'application/json',
  'origin': 'https://hanzii.net',
  'referer': 'https://hanzii.net/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
});

// Helper function for API calls
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getCommonHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
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
      const url = `${API_BASE_URL}/search/${targetLang}/${encodeURIComponent(term)}?type=${type}&page=${page}&limit=${limit}`;
      return await fetchWithAuth(url);
    } catch (error) {
      console.error(`Error searching for ${type} ${term} ${targetLang} ${page} ${limit}:`, error);
      return null;
    }
};

export const fetchVocabularyCategories = async (): Promise<VocabularyCategoryResponse> => {
    const url = `${API_BASE_URL}/category/premium`;
    return await fetchWithAuth(url);
};
  
export const fetchVocabularyItems = async (
    category: string, 
    page: number = 1, 
    limit: number = 10
): Promise<VocabularyResponse> => {
    const url = `${API_BASE_URL}/notebooks/premium/${category}?page=${page}&limit=${limit}`;
    return await fetchWithAuth(url);
};
  
export const fetchHSKVocabulary = async (
    level: string, 
    page: number, 
    limit: number
) => {
    try {
        const url = `${API_BASE_URL}/hsk/${level}?page=${page}&limit=${limit}&lang=vi&version=2`;
        const data = await fetchWithAuth(url);

        return {
            result: data.data.map((item: any) => ({
                w: item.word,
                p: item.detail?.pinyin || '',
                m: item.detail?.content?.[0]?.means?.[0]?.mean || '',
                isLoading: false
            })),
            total: data.total
        };
    } catch (error) {
        console.error('Error fetching HSK vocabulary:', error);
        throw error;
    }
};
  
  