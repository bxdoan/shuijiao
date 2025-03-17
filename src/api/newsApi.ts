import axios from 'axios';
import { NewsFilterParams, NewsResponse } from '../types';

const API_BASE_URL = 'https://api.easychinese.io/api';
const API_KEY = 'qidKNYDRnnbXYyUNnXKiYvRrJveH4CCS';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': API_KEY,
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'https://easychinese.io',
    'Referer': 'https://easychinese.io/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
  }
});

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
    timestamp: today
  };

  const mergedParams = { ...defaultParams, ...params };
  
  try {
    console.log('Fetching news with params:', mergedParams);
    const response = await apiClient.post('/news/filter', mergedParams);
    console.log('API response:', response.data);
    
    // API trả về mảng các NewsItem trực tiếp
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: mergedParams.page || 1,
        limit: mergedParams.limit || 40
      };
    }
    
    // Nếu API không trả về mảng hoặc không có dữ liệu
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
    console.error('Error fetching news:', error);
    // Return a default response on error
    return {
      data: [],
      total: 0,
      page: mergedParams.page || 1,
      limit: mergedParams.limit || 40
    };
  }
}; 