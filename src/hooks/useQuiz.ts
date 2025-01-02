import { useState } from 'react';
import { createQuiz, joinQuiz } from '../services/quiz';
import type { QuizCreateData, JoinQuizResponse, CreateQuizResponse } from '../types';

export const useQuiz = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [isReconnecting] = useState(false);
    const [error, setError] = useState<string>();

    const handleCreateQuiz = async (quizData: QuizCreateData): Promise<CreateQuizResponse | null> => {
        setIsCreating(true);
        setError(undefined);

        try {
            const response = await createQuiz(quizData);
            return response;
        } catch (err) {
            setError('Failed to create quiz. Please try again.');
            return null;
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

    return {
        createQuiz: handleCreateQuiz,
        joinQuiz: handleJoinQuiz,
        isCreating,
        isJoining,
        isReconnecting,
        error,
    };
};