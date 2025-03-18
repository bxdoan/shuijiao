import axios from 'axios';
import { NewsFilterParams, NewsResponse } from '../types';

const API_BASE_URL = 'https://api.easychinese.io/api';
const API_KEY = 'qidKNYDRnnbXYyUNnXKiYvRrJveH4CCS';

// API proxy URL - dựa vào môi trường hiện tại
const isProduction = process.env.NODE_ENV === 'production';
// Trong môi trường development, sử dụng localhost:3001
// Trong môi trường production, sử dụng đường dẫn tương đối để gọi API từ cùng domain
export const API_PROXY_URL = isProduction 
  ? '/api' 
  : 'http://localhost:3001/api';

// Cập nhật đầy đủ headers cho tất cả các API calls
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

// Interface cho dữ liệu trả về từ API dịch
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

// Hàm gọi API để dịch bài viết
export const fetchTranslation = async (newsId: string, language: string = 'vi', useCache: boolean = false): Promise<Record<string, string> | null> => {
  try {
    console.log(`Fetching translation for news ID: ${newsId} in language: ${language}, useCache: ${useCache}`);
    
    // Xác định endpoint dựa vào tham số useCache
    const endpoint = useCache ? 'cached-translate' : 'translate';
    
    // Gọi API qua proxy server để tránh vấn đề CORS
    const response = await axios.get(`${API_PROXY_URL}/${endpoint}`, { 
      params: { 
        news_id: newsId, 
        lang: language 
      }
    });

    // Kiểm tra và xử lý dữ liệu
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    // Trả về giá trị mặc định khi không có dữ liệu
    return null;
    
  } catch (error) {
    console.error('Error fetching translation:', error);
    // Hiển thị thông báo lỗi chi tiết hơn
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Response headers:', error.response?.headers);
    }
    return null;
  }
};

export const fetchGoogleTranslation = async (text: string, targetLang: string) => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&sl=zh&tl=${targetLang}&q=${encodeURIComponent(text)}`
    );
    
    if (!response.ok) {
      throw new Error(`Google Translate error: ${response.status}`);
    }

    const data = await response.json();
    
    // Xử lý kết quả phức tạp từ Google
    let translatedText = '';
    
    // Duyệt qua các phần tử trong mảng sentences
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