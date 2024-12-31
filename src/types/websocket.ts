// Message Types
export type ServerMessageType =
  | 'QUIZ_START_COUNTDOWN'
  | 'QUESTION_REQUEST'
  | 'QUESTION_RESULT'
  | 'PLAYER_QUESTION_RESULT'
  | 'PARTICIPANT_JOINED'
  | 'PARTICIPANT_LEFT'
  | 'LEADER_BOARD'
  | 'QUIZ_END_RESULT';

export type ClientMessageType =
  | 'START_QUIZ'
  | 'SUBMIT_ANSWER'
  | 'REQUEST_NEXT_QUESTION'
  | 'QUIZ_END';

// Base Message Interface
export interface WebSocketMessage<T = any> {
    type: ServerMessageType | ClientMessageType;
    payload: T;
}

// Payload Types
export interface QuizStartCountdownPayload {
    quizId: string;
    startTime: number;
}

// export interface Question {
//   id: string;
//   text: string;
//   imageUrl?: string;
//   options: Array<{
//     text: string;
//     isCorrect?: boolean;
//   }>;
// }

export interface QuestionRequestPayload {
    quizId: string;
    question: string;
    answers: string[];
    currentQuestion: number;
    totalQuestions: number;
    timeLimit: number;
}

export interface QuestionResultPayload {
    quizId: string;
    correctAnswer: string;
    answerStats: number[];
    totalAnswered: number;
}

export interface PlayerQuestionResultPayload {
    quizId: string;
    currentQuestion: number;
    isCorrect: boolean;
    points: number;
    totalPoints: number;
    ranking: number;
    streak: number;
}

export interface ParticipantPayload {
    id: string;
    name: string;
}

export interface LeaderboardEntry {
    playerId: string;
    playerName: string;
    score: number;
}

export interface LeaderboardPayload {
    quizId: string;
    leaderboard: LeaderboardEntry[];
}

export interface QuizEndResultPayload {
    quizId: string;
    ranking: number;
    score: number;
    totalPlayers: number;
}