import { FC } from 'react';

interface QuestionProgressProps {
    currentQuestion: number;
    totalQuestions: number;
}

export const QuestionProgress: FC<QuestionProgressProps> = ({
    currentQuestion,
    totalQuestions,
}) => {
    return (
        <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-md">
            <span className="font-semibold text-gray-800">
                {currentQuestion} <span className="text-gray-400">/</span> {totalQuestions}
            </span>
        </div>
    );
};