import { FC } from 'react';

interface QuestionHeaderProps {
    roomCode: string;
    currentQuestion: number;
    totalQuestions: number;
}

export const QuestionHeader: FC<QuestionHeaderProps> = ({
    roomCode,
    currentQuestion,
    totalQuestions,
}) => {
    return (
        <div className="flex justify-between items-center p-4 bg-white border-b">
            <div className="text-gray-600">PIN: {roomCode}</div>
            <div className="text-gray-600">
                {currentQuestion} of {totalQuestions}
            </div>
        </div>
    );
};