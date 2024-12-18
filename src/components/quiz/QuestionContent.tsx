import React from 'react';
import type { Question } from '../../types/websocket';

interface QuestionContentProps {
  question: Question;
  onAnswerSelect: (index: number) => void;
  isAnswerSelected: boolean;
}

export const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  onAnswerSelect,
  isAnswerSelected,
}) => {
  return (
    <div className="p-6 space-y-6">
      {question.imageUrl && (
        <div className="flex justify-center">
          <img
            src={question.imageUrl}
            alt="Question"
            className="max-h-48 rounded-lg object-contain"
          />
        </div>
      )}
      
      <h2 className="text-xl font-semibold text-center text-gray-800">
        {question.text}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            disabled={isAnswerSelected}
            className={`
              h-24 text-lg font-semibold rounded-lg transition-colors
              ${isAnswerSelected
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : 'bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-800'
              }
            `}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};