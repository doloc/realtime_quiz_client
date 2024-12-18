import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { StartCountdown } from '../components/quiz/StartCountdown';
import { QuestionDisplay } from '../components/quiz/QuestionDisplay';
import { WaitingForResults } from '../components/quiz/WaitingForResults';
import { PlayerQuestionResult } from '../components/quiz/PlayerQuestionResult';
import { useWebSocket } from '../hooks/useWebSocket';
import type { QuestionRequestPayload, PlayerQuestionResultPayload } from '../types/websocket';

export const PlayerRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionRequestPayload | null>(null);
  const [questionResult, setQuestionResult] = useState<PlayerQuestionResultPayload | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [startTime, setStartTime] = useState<number | undefined>();

  const handleQuizStart = useCallback(() => {
    setShowCountdown(false);
    setCurrentQuestion(null);
    setQuestionResult(null);
    setSelectedAnswer(null);
  }, []);

  const { sendMessage } = useWebSocket(
    {
      role: 'player',
      quizId: roomId!,
    },
    {
      onQuizStartCountdown: (data) => {
        setShowCountdown(true);
        setStartTime(parseInt(data.startTime.toString(), 10));
      },
      onQuestionRequest: (data) => {
        setCurrentQuestion(data);
        setSelectedAnswer(null);
        setQuestionResult(null);
      },
      onPlayerQuestionResult: (data) => {
        setQuestionResult(data);
        setCurrentQuestion(null);
      },
    }
  );

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    sendMessage('SUBMIT_ANSWER', {
      quizId: roomId,
      currentQuestion: currentQuestion.currentQuestion,
      answer: answerIndex,
    });
  };

  if (showCountdown) {
    return (
      <StartCountdown
        startTime={startTime}
        onComplete={handleQuizStart}
      />
    );
  }

  if (questionResult) {
    return <PlayerQuestionResult result={questionResult} />;
  }

  if (selectedAnswer !== null && !questionResult) {
    return <WaitingForResults />;
  }

  if (currentQuestion) {
    return (
      <QuestionDisplay
        questionData={currentQuestion}
        onAnswerSelect={handleAnswerSelect}
        isAnswerSelected={selectedAnswer !== null} timeLeft={5}      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Waiting for quiz to start...</h2>
        <p className="text-gray-600 mt-2">The host will begin the quiz shortly</p>
      </div>
    </div>
  );
};