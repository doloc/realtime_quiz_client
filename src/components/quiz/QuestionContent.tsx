import { FC } from 'react';

interface QuestionContentProps {
    question: string;
    answers: string[];
    onAnswerSelect: (index: number) => void;
    isAnswerSelected: boolean;
}

export const QuestionContent: FC<QuestionContentProps> = ({
    question,
    answers,
    onAnswerSelect,
    isAnswerSelected,
}) => {
    return (
        <div className="p-6 space-y-6">
            {/* {question.imageUrl && (
                <div className="flex justify-center">
                <img
                    src={question.imageUrl}
                    alt="Question"
                    className="max-h-48 rounded-lg object-contain"
                />
                </div>
            )} */}
            
            <h2 className="text-xl font-semibold text-center text-gray-800">
                {question}
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {answers.map((option, index) => option.length !== 0 && (
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
                    {option}
                </button>
                ))}
            </div>
        </div>
    );
};