import { authApi } from './api';
import { setCookie, COOKIE_EXPIRY } from '../utils/cookie';

interface LoginResponse {
  message: string;
  sessionId: string;
  token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await authApi.login(username, password);
    
    // Save token to localStorage
    localStorage.setItem('jwt_token', response.token);
    
    // Save sessionId to cookie (1 hour expiry)
    setCookie('sessionId', response.sessionId, COOKIE_EXPIRY.HOUR);
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Invalid username or password');
  }
};