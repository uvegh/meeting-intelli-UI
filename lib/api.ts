import axios from 'axios';
import { Meeting, ApiResponse, CreateMeetingRequest, ChartData } from './types';

const api = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    console.log('Fetching all meetings from API...',api);
    const { data } = await api.get<ApiResponse<Meeting[]>>('/meetings');
    console.log('Fetched meetings:', data);
    return data?.data;
  },

  getById: async (id: string): Promise<Meeting> => {
    const { data } = await axios.get<ApiResponse<Meeting>>(`http://localhost:3000/api/meetings/${id}`);
     console.log('Fetched meeting with id at lib', id, data?.data);
     
    return data?.data;
  },

  create: async (request: CreateMeetingRequest): Promise<Meeting> => {
    const { data } = await axios.post<ApiResponse<Meeting>>('http://localhost:3000/api/meetings', request);
    console.log('Created meeting:', data?.data);
    return data.data;
  },

  getStatistics: async (): Promise<{ byMonth: ChartData[] }> => {
    
    const { data } = await api.get<ApiResponse<{ byMonth: ChartData[] }>>('/meetings/statistics');
 console.log('Fetched statistics:', data?.data);
    return data.data;
  },
    update: async (id: string, request: CreateMeetingRequest): Promise<Meeting> => {
    const { data } = await api.put<ApiResponse<Meeting>>(`/meetings/${id}`, request);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/meetings/${id}`);
  },
};