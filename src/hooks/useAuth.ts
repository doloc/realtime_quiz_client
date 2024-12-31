import { useState, useCallback } from 'react';
import { login as authLogin } from '../services/auth';
import { authApi } from '../services/api';
import { deleteCookie } from '../utils/cookie';

export const useAuth = () => {
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        setError(undefined);
        
        try {
        await authLogin(username, password);
        return true;
        } catch (err) {
        setError('Invalid username or password');
        return false;
        } finally {
        setIsLoading(false);
        }
    }, []);

    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return false;

        setIsLoading(true);
        try {
        await authApi.verifyToken();
        return true;
        } catch (err) {
        // Clear both token and session on verification failure
        localStorage.removeItem('jwt_token');
        deleteCookie('sessionId');
        return false;
        } finally {
        setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        deleteCookie('sessionId');
    }, []);

    return {
        login,
        verifyToken,
        logout,
        error,
        isLoading,
    };
};