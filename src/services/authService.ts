import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
  refreshToken: string;
}

export const loginRequest = (payload: LoginPayload) => api.post<AuthResponse>('/auth/login', payload);

export const registerRequest = (payload: RegisterPayload) => api.post<AuthResponse>('/auth/register', payload);
