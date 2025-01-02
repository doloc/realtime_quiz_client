import { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Question } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface QuestionListProps {
    questions: Question[];
    onChange: (questions: Question[]) => void;
}

export const QuestionList: FC<QuestionListProps> = ({
    questions,
    onChange,
}) => {
    const handleAddQuestion = () => {
        const newQuestion: Question = {
        id: Math.random().toString(36).substring(2, 9),
        text: '',
        options: [
            { text: '', isRequired: true },  // Answer 1 (required)
            { text: '', isRequired: true },  // Answer 2 (required)
            { text: '', isRequired: false }, // Answer 3 (optional)
            { text: '', isRequired: false }, // Answer 4 (optional)
        ],
        correctAnswers: [],
        timeLimit: 30,
        };
        onChange([...questions, newQuestion]);
    };

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        onChange(newQuestions);
    };

    const validateQuestion = (question: Question): string | null => {
        if (!question.text.trim()) {
        return 'Question text is required';
        }
        
        // Check required answers (1 and 2)
        if (!question.options[0].text.trim() || !question.options[1].text.trim()) {
        return 'Answers 1 and 2 are required';
        }

        // At least one correct answer must be selected
        if (question.correctAnswers.length === 0) {
        return 'Select at least one correct answer';
        }

        return null;
    };

    return (
        <div className="space-y-6">
            {questions.map((question, index) => {
                const error = validateQuestion(question);
                
                return (
                <div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-4"
                >
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h3 className="font-semibold">Question {index + 1}</h3>
                        <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteQuestion(index)}
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <Input
                        type="number"
                        className="w-32"
                        placeholder="Time (seconds)"
                        value={question.timeLimit}
                        min={5}
                        max={120}
                        onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].timeLimit = parseInt(e.target.value);
                        onChange(newQuestions);
                        }}
                    />
                    </div>

                    <Input
                    placeholder="Enter your question"
                    value={question.text}
                    onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].text = e.target.value;
                        onChange(newQuestions);
                    }}
                    required
                    />

                    <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3">
                        <Input
                            className="flex-1"
                            placeholder={`Answer ${optionIndex + 1}${option.isRequired ? ' (Required)' : ' (Optional)'}`}
                            value={option.text}
                            onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].options[optionIndex].text = e.target.value;
                            onChange(newQuestions);
                            }}
                            required={option.isRequired}
                        />
                        <div className="flex items-center space-x-2">
                            <input
                            type="checkbox"
                            className="w-5 h-5 rounded text-blue-600"
                            checked={question.correctAnswers.includes(optionIndex)}
                            onChange={(e) => {
                                const newQuestions = [...questions];
                                if (e.target.checked) {
                                newQuestions[index].correctAnswers.push(optionIndex);
                                } else {
                                newQuestions[index].correctAnswers = newQuestions[index].correctAnswers
                                    .filter(answer => answer !== optionIndex);
                                }
                                onChange(newQuestions);
                            }}
                            />
                            <span className="text-sm text-gray-600">Correct</span>
                        </div>
                        </div>
                    ))}
                    </div>

                    {error && (
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                    )}
                </div>
                );
            })}
            
            <Button
                variant="secondary"
                className="mt-6"
                onClick={handleAddQuestion}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
            </Button>
        </div>
    );
};