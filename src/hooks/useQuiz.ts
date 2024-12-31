import { useState } from 'react';
import { checkQuizAvailability, createQuiz, joinQuiz } from '../services/quiz';
import type { QuizCreateData, JoinQuizResponse } from '../types';
import { getCookie } from '../utils/cookie';

export const useQuiz = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [error, setError] = useState<string>();

    const handleCreateQuiz = async (quizData: QuizCreateData) => {
        setIsCreating(true);
        setError(undefined);

        try {
        await createQuiz(quizData);
        return true;
        } catch (err) {
        setError('Failed to create quiz. Please try again.');
        return false;
        } finally {
        setIsCreating(false);
        }
    };

    const handleJoinQuiz = async (roomId: string, username: string): Promise<JoinQuizResponse | null> => {
        setIsJoining(true);
        setError(undefined);

        try {
        const response = await joinQuiz(roomId, username);
        return response;
        } catch (err) {
        setError('Failed to join quiz. Please check the room code and try again.');
        return null;
        } finally {
        setIsJoining(false);
        }
    };

    const handleCheckQuizAvailability = async (roomId: string) => {
        setIsReconnecting(true);
        setError(undefined);
        try {
        const sessionId = getCookie('sessionId');
        if (!sessionId) {
            console.error('No session ID found');
            return null;
        }
        const response = await checkQuizAvailability(roomId, sessionId);
        return response;
        } catch (err) {
        setError('Failed to check quiz availability. Please try again.');
        return null;
        } finally {
        setIsReconnecting(false);
        }
    }

    return {
        createQuiz: handleCreateQuiz,
        joinQuiz: handleJoinQuiz,
        checkQuizAvailability: handleCheckQuizAvailability,
        isCreating,
        isJoining,
        isReconnecting,
        error,
    };
};