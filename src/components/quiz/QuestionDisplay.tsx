import React from 'react';
import { QuestionProgress } from './QuestionProgress';
import { CountdownTimer } from './CountdownTimer';
import { QuestionContent } from './QuestionContent';
import type { QuestionRequestPayload } from '../../types/websocket';

interface QuestionDisplayProps {
  questionData: QuestionRequestPayload;
  timeLeft: number;
  onAnswerSelect: (index: number) => void;
  isAnswerSelected: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questionData,
  timeLeft,
  onAnswerSelect,
  isAnswerSelected,
}) => {
  const { question, currentQuestion, totalQuestions, timeLimit } = questionData;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <QuestionProgress
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />
      
      <CountdownTimer
        timeLeft={timeLeft}
        totalTime={timeLimit}
      />

      <QuestionContent
        question={question}
        onAnswerSelect={onAnswerSelect}
        isAnswerSelected={isAnswerSelected}
      />
    </div>
  );
};