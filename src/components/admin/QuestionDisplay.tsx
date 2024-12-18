import React from 'react';
import { QuestionProgress } from '../quiz/QuestionProgress';
import { CountdownTimer } from '../quiz/CountdownTimer';
import type { QuestionRequestPayload } from '../../types/websocket';

interface QuestionDisplayProps {
  questionData: QuestionRequestPayload;
  timeLeft: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questionData,
  timeLeft,
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

      <div className="max-w-4xl mx-auto p-6 pt-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {question.imageUrl && (
            <div className="mb-8 flex justify-center">
              <img
                src={question.imageUrl}
                alt="Question"
                className="max-h-64 rounded-lg object-contain"
              />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            {question.text}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-lg border-2 min-h-[100px] flex items-center justify-center
                  ${option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                `}
              >
                <p className="text-lg font-medium text-center">
                  {option.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};