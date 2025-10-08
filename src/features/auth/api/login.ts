import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LoginCredentials } from '../types';

interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }
    },
  });
};