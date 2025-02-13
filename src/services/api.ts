import axios from 'axios';
import { Story, StoryInput } from '@/types/story';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateStory = async (input: StoryInput): Promise<Story> => {
  const response = await api.post<Story>('/generateStory', input);
  return response.data;
};

// Add error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject({ message, code: error.response?.status });
  }
);
