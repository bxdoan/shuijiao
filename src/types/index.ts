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
} 