import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'https://pikasmart.com/api';
const API_KEY = 'qidKNYDRnnbXYyUNnXKiYvRrJveH4CCS';

interface Video {
  id: number;
  name: string;
  slug: string;
  url: string;
  url_vimeo: string | null;
  check_download: number;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  video_type: string;
  video_length: string;
  level_id: number;
  name_vn: string;
  name_ro: string;
  name_en: string;
  view: number;
}

interface VideoResponse {
  Err: null | string;
  Song: Video[];
}

interface VideoDetailResponse {
  Err: null | string;
  Song: Video;
}

export const useVideo = (
    videoType: string = 'Chinese', 
    page: number = 1, 
    limit: number = 12
) => {
  return useQuery<VideoResponse>({
    queryKey: ['videos', videoType, page, limit],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/Songs/listpopular`, {
        params: {
          video_type: videoType,
          skip: (page - 1) * limit,
          limit: limit
        },
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': API_KEY,
          'content-type': 'application/json',
          'origin': 'https://easychinese.io',
          'referer': 'https://easychinese.io/'
        }
      });
      return response.data;
    }
  });
};

export const useVideoDetail = (songId: number) => {
  return useQuery<VideoDetailResponse>({
    queryKey: ['video', songId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/Songs/song`, {
        params: {
          song_id: songId
        },
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': API_KEY,
          'content-type': 'application/json',
          'origin': 'https://easychinese.io',
          'referer': 'https://easychinese.io/'
        }
      });
      return response.data;
    }
  });
};

export const useRelatedVideos = (
    videoType: string, 
    currentId: number, 
    limit: number = 12
) => {
  return useQuery<VideoResponse>({
    queryKey: ['related-videos', videoType, currentId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/Songs/listpopular`, {
        params: {
          video_type: videoType,
          limit: limit
        },
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': API_KEY,
          'content-type': 'application/json',
          'origin': 'https://easychinese.io',
          'referer': 'https://easychinese.io/'
        }
      });
      // Lọc bỏ video hiện tại khỏi danh sách liên quan
      const filteredVideos = response.data.Song.filter((video: Video) => video.id !== currentId);
      return {
        ...response.data,
        Song: filteredVideos.slice(0, limit)
      };
    }
  });
}; 