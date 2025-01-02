import { quizApi } from './api';
import type { QuizCreateData, JoinQuizResponse } from '../types';
import { setCookie, COOKIE_EXPIRY } from '../utils/cookie';

export const createQuiz = async (quizData: QuizCreateData): Promise<void> => {
    try {
        await quizApi.createQuiz(quizData);
    } catch (error) {
        console.error('Failed to create quiz:', error);
        throw new Error('Failed to create quiz. Please try again.');
    }
};

export const joinQuiz = async (roomId: string, username: string): Promise<JoinQuizResponse> => {
    try {
        const response = await quizApi.joinQuiz(roomId, username);
        
        // Save sessionId to cookie
        setCookie('sessionId', response.sessionId, COOKIE_EXPIRY.HOUR);
        
        return response;
    } catch (error) {
        console.error('Failed to join quiz:', error);
        throw new Error('Failed to join quiz. Please try again.');
    }
};