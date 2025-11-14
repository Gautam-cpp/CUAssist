import api from './api';

/**
 * Makes a POST request with FormData
 * @param endpoint - API endpoint
 * @param data - FormData to send
 * @returns Response data
 */
export async function postFormData<T = any>(endpoint: string, data: FormData): Promise<T> {
  const response = await api.post(endpoint, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data as T;
}
