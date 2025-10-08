import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};