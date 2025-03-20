import axios from 'axios';
import {
  NewsFilterParams,
  NewsResponse,
  LanguageConfigMap,
  NewsDetail
} from '../types';
import * as utils from '../utils/utils';

// Tạo một cấu trúc để quản lý cấu hình cho nhiều ngôn ngữ
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
  // Thêm ngôn ngữ mới ở đây
  // de: {
  //   apiBaseUrl: 'https://api.todaigerman.com/api',
  //   origin: 'https://todaigerman.com',
  //   referer: 'https://todaigerman.com/',
  //   apiKey: ''
  // },
};

// API proxy URL - dựa vào môi trường hiện tại
const isProduction = process.env.NODE_ENV === 'production';
// Trong môi trường development, sử dụng localhost:3001
// Trong môi trường production, sử dụng đường dẫn tương đối để gọi API từ cùng domain
export const API_PROXY_URL = isProduction 
  ? '/api' 
  : 'http://localhost:3001/api';

// Định nghĩa interface cho apiClients
interface ApiClientMap {
  [key: string]: any; // any vì axios client không có interface rõ ràng
}

// Hàm tạo API client dựa trên ngôn ngữ
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

// Cache các API client để không tạo mới mỗi lần gọi API
const apiClients: ApiClientMap = {};

// Lấy API client cho ngôn ngữ cụ thể, tạo mới nếu chưa có
const getApiClient = (language: string) => {
  if (!apiClients[language]) {
    apiClients[language] = createApiClient(language);
  }
  return apiClients[language];
};

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

export const fetchGoogleTranslation = async (text: string, targetLang: string = 'vi', srcLang: string = 'auto') => {
  try {
    // Xác định ngôn ngữ nguồn dựa vào nội dung
    // Mặc định sẽ tự động phát hiện ngôn ngữ nguồn
    const sourceLang = srcLang === 'auto' ? (containsChineseCharacters(text) ? 'zh' : 'en') : srcLang;
    
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(text)}`
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

export const translateSentences = async (
  text: string, sourceLang: string, targetLang: string = 'vi'
) => {
  const sentences = utils.splitTextIntoSentences(text, sourceLang);
  const translatedSentences = [];
  
  try {
    // Tối ưu hóa: dịch theo lô các câu, thay vì dịch từng câu riêng biệt
    for (const sentence of sentences) {
      if (!sentence.trim()) continue; // Bỏ qua câu rỗng
      
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


// Hàm hỗ trợ kiểm tra xem văn bản có chứa ký tự tiếng Trung không
function containsChineseCharacters(text: string): boolean {
  // Phạm vi Unicode cho các ký tự Hán
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
    language: params.language || 'zh' // Mặc định là tiếng Trung nếu không chỉ định
  };

  const mergedParams = { ...defaultParams, ...params };
  const { language, ...apiParams } = mergedParams; // Tách language ra để chọn API client phù hợp
  let targetLanguage = language || 'zh';
  
  try {
    // Kiểm tra nếu ngôn ngữ được hỗ trợ
    if (!languageConfig[targetLanguage]) {
      console.warn(`Language ${targetLanguage} is not supported. Falling back to English.`);
      targetLanguage = 'en';
    }
    
    console.log(`Fetching ${targetLanguage} news with params:`, apiParams);
    
    // Lấy API client phù hợp cho ngôn ngữ đã chọn
    const apiClient = getApiClient(targetLanguage);
    
    // Gọi API endpoint chung cho tất cả ngôn ngữ
    const response = await apiClient.post('/news/filter', apiParams);
    
    console.log(`${targetLanguage.toUpperCase()} API response:`, response.data);
    
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


// Hàm lấy chi tiết tin tức
export const getNewsDetails = async (newsId: string, language: string = 'zh'): Promise<NewsDetail | null> => {
  try {
    const targetLanguage = languageConfig[language] ? language : 'zh';
    const apiClient = getApiClient(targetLanguage);
    
    console.log(`Fetching news details for ID: ${newsId} in language: ${targetLanguage}`);
    
    const response = await apiClient.get(`/detail/${newsId}`);
    
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