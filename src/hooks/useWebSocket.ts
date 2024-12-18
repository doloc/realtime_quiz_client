import { useEffect, useRef, useCallback, useState } from 'react';
import { getCookie } from '../utils/cookie';
import type {
  WebSocketMessage,
  ServerMessageType,
  ClientMessageType,
  QuizStartCountdownPayload,
  QuestionRequestPayload,
  QuestionResultPayload,
  ParticipantPayload,
  LeaderboardPayload,
  QuizEndResultPayload,
  PlayerQuestionResultPayload,
} from '../types/websocket';

interface WebSocketConfig {
  role: 'host' | 'player';
  quizId: string;
}

interface WebSocketHandlers {
  onQuizStartCountdown?: (data: QuizStartCountdownPayload) => void;
  onQuestionRequest?: (data: QuestionRequestPayload) => void;
  onQuestionResult?: (data: QuestionResultPayload) => void;
  onPlayerQuestionResult?: (data: PlayerQuestionResultPayload) => void;
  onParticipantJoined?: (data: ParticipantPayload) => void;
  onParticipantLeft?: (data: ParticipantPayload) => void;
  onLeaderboard?: (data: LeaderboardPayload) => void;
  onQuizEndResult?: (data: QuizEndResultPayload) => void;
}

export const useWebSocket = (
  { role, quizId }: WebSocketConfig,
  handlers?: WebSocketHandlers
) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const sessionId = getCookie('sessionId');
    if (!sessionId) {
      console.error('No session ID found');
      return;
    }

    const wsUrl = `ws://localhost:8080/ws?role=${role}&quizId=${quizId}&sessionId=${sessionId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setTimeout(connect, 3000); // Reconnect after 3 seconds
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleServerMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }, [role, quizId]);

  const handleServerMessage = (message: WebSocketMessage) => {
    switch (message.type as ServerMessageType) {
      case 'QUIZ_START_COUNTDOWN':
        handlers?.onQuizStartCountdown?.(message.payload as QuizStartCountdownPayload);
        break;
      case 'QUESTION_REQUEST':
        handlers?.onQuestionRequest?.(message.payload as QuestionRequestPayload);
        break;
      case 'QUESTION_RESULT':
        handlers?.onQuestionResult?.(message.payload as QuestionResultPayload);
        break;
      case 'PARTICIPANT_JOINED':
        handlers?.onParticipantJoined?.(message.payload as ParticipantPayload);
        break;
      case 'PARTICIPANT_LEFT':
        handlers?.onParticipantLeft?.(message.payload as ParticipantPayload);
        break;
      case 'LEADER_BOARD':
        handlers?.onLeaderboard?.(message.payload as LeaderboardPayload);
        break;
      case 'QUIZ_END_RESULT':
        handlers?.onQuizEndResult?.(message.payload as QuizEndResultPayload);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  };

  const sendMessage = useCallback(<T extends object>(
    type: ClientMessageType,
    payload: T
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<T> = { type, payload };
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return { sendMessage, isConnected };
};