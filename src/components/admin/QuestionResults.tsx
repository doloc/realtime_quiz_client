import React from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import { Button } from '../Button';
import { AnswerBar } from './AnswerBar';
import { getMaxAnswerCount } from '../../utils/quiz';
import type { QuestionRequestPayload, QuestionResultPayload } from '../../types/websocket';

interface QuestionResultsProps {
  questionData: QuestionRequestPayload;
  resultData: QuestionResultPayload;
  onNext: () => void;
  onEnd?: () => void;
}

export const QuestionResults: React.FC<QuestionResultsProps> = ({
  questionData,
  resultData,
  onNext,
  onEnd,
}) => {
  const { currentQuestion, totalQuestions, question } = questionData;
  const { answerCounts, correctAnswer, totalAnswered } = resultData;
  const isLastQuestion = currentQuestion === totalQuestions;
  const maxCount = getMaxAnswerCount(answerCounts);

  const handleAction = () => {
    if (isLastQuestion) {
      onEnd?.();
    } else {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Question Results</h2>
            <div className="text-gray-600">
              {totalAnswered} {totalAnswered === 1 ? 'response' : 'responses'}
            </div>
          </div>

          <div className="space-y-6">
            {question.options.map((option, index) => (
              <AnswerBar
                key={index}
                count={answerCounts[index]}
                totalAnswers={totalAnswered}
                maxCount={maxCount}
                isCorrect={index === correctAnswer}
                text={option.text}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleAction}
              className="flex items-center"
              size="lg"
              variant={isLastQuestion ? 'primary' : 'secondary'}
            >
              {isLastQuestion ? (
                <>
                  Get Results
                  <Trophy className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};