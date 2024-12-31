import { FC } from 'react';
import { QuestionProgress } from './QuestionProgress';
import { CountdownTimer } from './CountdownTimer';
import { QuestionContent } from './QuestionContent';
import type { QuestionRequestPayload } from '../../types/websocket';

interface QuestionDisplayProps {
    questionData: QuestionRequestPayload;
    onAnswerSelect: (index: number) => void;
    isAnswerSelected: boolean;
}

export const QuestionDisplay: FC<QuestionDisplayProps> = ({
    questionData,
    onAnswerSelect,
    isAnswerSelected,
}) => {
  const { question, answers, currentQuestion, totalQuestions, timeLimit } = questionData;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <QuestionProgress
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />
      
      <CountdownTimer
        totalTime={timeLimit}
      />

      <QuestionContent
        question={question}
        answers={answers}
        onAnswerSelect={onAnswerSelect}
        isAnswerSelected={isAnswerSelected}
      />
    </div>
  );
};