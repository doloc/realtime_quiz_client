import type { Question, RoomConfig } from './room';

export interface QuizCreateData {
    roomId: string;
    config: RoomConfig;
    questions: Question[];
}

export interface JoinQuizResponse {
    message: string;
    sessionId: string;
    quizId: string;
    username: string;
}