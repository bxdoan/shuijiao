
// Định nghĩa interface cho cấu hình của mỗi ngôn ngữ
interface LanguageConfigItem {
  apiBaseUrl: string;
  origin: string;
  referer: string;
  apiKey: string;
}

// Định nghĩa interface cho đối tượng cấu hình ngôn ngữ
export interface LanguageConfigMap {
  [key: string]: LanguageConfigItem;
}

export interface NewsItem {
  id: string;
  key: string;
  value: NewsItemValue;
}

export interface NewsItemValue {
  id: string;
  kind: string;
  link: string;
  date: string;
  title: string;
  type: string;
  desc: string;
  image: string;
  video: string | null;
  body: string;
  audio: {
    [key: string]: string;
  };
  source: string;
  tocfl: {
    [key: string]: number;
  };
  hsk: {
    [key: string]: number;
  };
  level_tocfl: {
    [key: string]: string[];
  };
  level_hsk: {
    [key: string]: string[];
  };
}

export interface NewsResponse {
  data: NewsItem[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsFilterParams {
  topic?: string;
  date?: string;
  source?: string;
  type?: string;
  limit?: number;
  page?: number;
  timestamp?: string;
  language?: string;
}

export interface NewsDetail {
  id: string;
  title: string;
  description: string;
  link: string;
  date: string;
  tag: string;
  source: string;
  image?: string;
  content: {
    audio: {
      [key: string]: string[];
    };
    body: string;
    image: string | null;
    video: string | null;
  };
  level_tocfl?: {
    [key: string]: string[];
  };
  level_toeic?: {
    [key: string]: string[];
  };
  level_ielts?: {
    [key: string]: string[];
  };
  level_hsk?: {
    [key: string]: string[];
  };
  // Các trường khác có thể có trong response
  [key: string]: any;
}


// Interface for word search result
export interface WordSearchResult {
  id: number;
  word: string;
  pinyin: string;
  cn_vi: string;
  kind: string[];
  content: Array<{
    kind: string;
    means: Array<{
      mean: string;
      explain: string;
      examples: Array<{
        e: string;
        p: string;
        m: string;
      }>;
    }>;
  }>;
  rank?: number;
  lv_hsk_new?: string;
  lv_tocfl?: number;
  compound?: string | null;
}

// Interface for kanji search result
export interface KanjiSearchResult {
  _id: string;
  word: string;
  pinyin: string;
  cn_vi: string;
  netbut: string;
  sets: string;
  type: string;
  count: number;
  lucthu: string;
  content: Array<{
    key: string;
    means: {
      tdtc?: string[];
      tdpt?: string[];
      tdtd?: string[];
      tg?: string[];
    };
  }>;
  detail: {
    scomp: string[];
    comp: string[];
  };
  strokes: string;
  popular?: string;
}

// Interface for word search response
export interface SearchResponse {
  total: number;
  found: boolean;
  result: WordSearchResult[];
  query: string;
}

// Interface for kanji search response
export interface KanjiResponse {
  total: number;
  found: boolean;
  result: KanjiSearchResult[];
  query: string;
}