import { FC } from 'react';
import { calculateAnswerPercentage } from '../../utils/quiz';

interface AnswerBarProps {
    count: number;
    totalAnswers: number;
    maxCount: number;
    isCorrect: boolean;
    text: string;
}

export const AnswerBar: FC<AnswerBarProps> = ({
    count,
    totalAnswers,
    maxCount,
    isCorrect,
    text,
}) => {
    const percentage = calculateAnswerPercentage(count, totalAnswers);
    const relativeWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

    return (
        <div className="space-y-2">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
            <span className="font-medium">{text}</span>
            {isCorrect && (
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                Correct Answer
                </span>
            )}
            </div>
            <span className="text-gray-600">
            {count} {count === 1 ? 'response' : 'responses'} ({percentage}%)
            </span>
        </div>
        <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
            <div
            className={`absolute h-full transition-all duration-1000 ${
                isCorrect ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${relativeWidth}%` }}
            />
        </div>
        </div>
    );
};