import axios from 'axios';
import { Meeting, ApiResponse, CreateMeetingRequest, ChartData } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    console.log('Fetching all meetings from API...');
    const { data } = await api.get<ApiResponse<Meeting[]>>('/api/meetings');
    console.log('Fetched meetings:', data);
    return data?.data;
  },

  getById: async (id: string): Promise<Meeting> => {
    const { data } = await api.get<ApiResponse<Meeting>>(`/api/meetings/${id}`);
     console.log('Fetched meeting with id:', id, data?.data);
    return data?.data;
  },

  create: async (request: CreateMeetingRequest): Promise<Meeting> => {
    const { data } = await api.post<ApiResponse<Meeting>>('/api/meetings', request);
    console.log('Created meeting:', data?.data);
    return data.data;
  },

  getStatistics: async (): Promise<{ byMonth: ChartData[] }> => {
    
    const { data } = await api.get<ApiResponse<{ byMonth: ChartData[] }>>('/api/meetings/statistics');
 console.log('Fetched statistics:', data?.data);
    return data.data;
  },
    update: async (id: string, request: CreateMeetingRequest): Promise<Meeting> => {
    const { data } = await api.put<ApiResponse<Meeting>>(`/api/meetings/${id}`, request);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/meetings/${id}`);
  },
};