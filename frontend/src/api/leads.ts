import api from './axios';
import {
  ApiResponse,
  Lead,
  LeadFilters,
  CreateLeadInput,
  UpdateLeadInput,
  LeadStats,
} from '../types';

export const leadsApi = {
  getLeads: async (filters: LeadFilters = {}): Promise<ApiResponse<Lead[]>> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return response.data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: CreateLeadInput): Promise<ApiResponse<Lead>> => {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: UpdateLeadInput): Promise<ApiResponse<Lead>> => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<LeadStats>> => {
    const response = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return response.data;
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'limit' | 'sort'>): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const token = localStorage.getItem('token');
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/export/csv?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  },
};
