import { FC, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useGameStore } from '../store/gameStore';
import { RoomConfig } from '../components/admin/RoomConfig';
import { QuestionList } from '../components/admin/QuestionList';
import { WaitingScreen } from '../components/admin/WaitingScreen';
import { Button } from '../components/ui/Button';
import type { RoomConfig as RoomConfigType, Question } from '../types';

export const AdminRoom: FC = () => {
    // const { roomId } = useParams<{ roomId: string }>();
    const { createQuiz, isCreating, error: quizError } = useQuiz();
    const { room, setRoom } = useGameStore();

    const [config, setConfig] = useState<RoomConfigType>({
        title: '',
        description: '',
        type: 'public',
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [configError, setConfigError] = useState<string>();
    const [showWaitingScreen, setShowWaitingScreen] = useState(false);
    const validateForm = () => {
        if (!config.title || !config.description) {
        setConfigError('Please fill in all required fields');
        return false;
        }
        
        if (questions.length === 0) {
        setConfigError('Please add at least one question');
        return false;
        }

        const invalidQuestions = questions.some(question => {
        const requiredAnswers = question.options
            .filter(option => option.isRequired)
            .every(option => option.text.trim());
        return !requiredAnswers || question.correctAnswers.length === 0;
        });

        if (invalidQuestions) {
        setConfigError('Please fill in all required answers and select at least one correct answer for each question');
        return false;
        }

        return true;
    };

    const handleStartSetup = async () => {
        if (!validateForm()) return;
        
        setConfigError('');
        
        const createQuizRs = await createQuiz({
            // roomId: roomId!,
            config,
            questions,
        });

        if (createQuizRs) {
        setRoom({
            id: createQuizRs.quizId,
            config,
            questions,
            participants: [],
            currentQuestion: 0,
            status: 'waiting',
        });
        
        setShowWaitingScreen(true);
        }
    };

    if (showWaitingScreen && room) {
        return <WaitingScreen room={room} onStart={() => {}} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Create Quiz Room</h1>
                    {/* <p className="text-gray-600">Room Code: {roomId}</p> */}
                </div>

                <div className="space-y-8">
                    <div className="border-b pb-6">
                    <h2 className="text-lg font-semibold mb-4">Room Configuration</h2>
                    <RoomConfig
                        config={config}
                        onChange={setConfig}
                        error={configError}
                    />
                    </div>

                    <div>
                    <h2 className="text-lg font-semibold mb-4">Questions</h2>
                    <QuestionList
                        questions={questions}
                        onChange={setQuestions}
                    />
                    </div>

                    {(configError || quizError) && (
                    <p className="text-sm text-red-500">{configError || quizError}</p>
                    )}

                    <div className="pt-4 flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleStartSetup}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating Quiz...' : 'Continue to Waiting Room'}
                    </Button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};