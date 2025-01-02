import { FC, useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ParticipantList } from '../admin/ParticipantList';
import { StartCountdown } from '../quiz/StartCountdown';
import { useWebSocket } from '../../hooks/useWebSocket';
import type { Room } from '../../types';
import type { LeaderboardPayload, ParticipantPayload, QuestionRequestPayload, QuestionResultPayload, QuizPayload, QuizStartCountdownPayload } from '../../types/websocket';
import { useGameStore } from '../../store/gameStore';
import { QuestionResults } from './QuestionResults';
import { QuestionDisplay } from './QuestionDisplay';
import { QuizEndScreen } from './QuizEndScreen';
import { useNavigate } from 'react-router-dom';
import { QuizNotificationPopup } from '../quiz/QuizNotificationPopupProps';

interface WaitingScreenProps {
    room: Room;
    onStart: () => void;
}

export const WaitingScreen: FC<WaitingScreenProps> = ({ room, onStart }) => {
    const navigate = useNavigate();
    const [showCountdown, setShowCountdown] = useState(false);
    const [currentQuestionData, setCurrentQuestionData] = useState<QuestionRequestPayload | null>(null);
    const [questionResultData, setQuestionResultData] = useState<QuestionResultPayload | null>(null);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardPayload | null>(null);
    const { updateParticipants } = useGameStore();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [notification, setNotification] = useState<QuizPayload>();

    const { sendMessage } = useWebSocket(
        {
            role: 'host',
            quizId: room.id,
            },
        {
            onQuizStartCountdown: (data: QuizStartCountdownPayload) => {
                console.log('Quiz start countdown', data);
                setTimeLeft(data.startTime);
                setShowCountdown(true);
            },
            onQuestionRequest: (data: QuestionRequestPayload) => {
                console.log('Question request', data);
                setCurrentQuestionData(data);
                setQuestionResultData(null);
                setTimeLeft(data.timeLimit);
            },
            onQuestionResult: (data: QuestionResultPayload) => {
                console.log('Question result', data);
                setQuestionResultData(data);
            },
            onParticipantJoined: (data: ParticipantPayload) => {
                console.log('Participant joined', data);
                if (room) {
                updateParticipants([...room.participants, data]);
                }
            },
            onParticipantLeft: (data: ParticipantPayload) => {
                if (room) {
                updateParticipants(
                    room.participants.filter(p => p.id !== data.id)
                );
                }
            },
            onLeaderboard: (data: LeaderboardPayload) => {
                console.log('Leaderboard', data);
                setLeaderboardData(data);
                setCurrentQuestionData(null);
                setQuestionResultData(null);
            },
            onQuizEnded: (data: QuizPayload) => {
                setNotification(data);
            },
            onQuizNotFound: (data: QuizPayload) => {
                setNotification(data);
            },
        }
    );

    const onComplete = () => {
        console.log('Countdown complete');
        setShowCountdown(false);
        onStart();
    }

    const shareLink = `${window.location.origin}/play/${room.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
    };

    const handleStartQuiz = () => {
        sendMessage('START_QUIZ', { quizId: room.id });
    };
    
    const handleNextQuestion = () => {
        sendMessage('REQUEST_NEXT_QUESTION', { quizId: room.id, currentQuestion: currentQuestionData?.currentQuestion });
    }

    const handleEndQuiz = () => {
        sendMessage('QUIZ_END', { quizId: room.id });
    }

    if (notification) {
        return (
            <QuizNotificationPopup
                message={notification.message}
                onGoHome={() => navigate('/')}
            />
        )
    }

    if (showCountdown) {
        return <StartCountdown timeLeft={timeLeft} onComplete={onComplete} />;
    }

    if (questionResultData && currentQuestionData) {
        return (
        <QuestionResults
            questionData={currentQuestionData}
            resultData={questionResultData}
            onNext={handleNextQuestion}
            onEnd={handleEndQuiz}
        />
        );
    }
    
    if (currentQuestionData) {
        return (
        <QuestionDisplay questionData={currentQuestionData} />
        );
    }

    if (leaderboardData) {
        return (
        <QuizEndScreen result={leaderboardData} onPlayAgain={() => navigate('/')} />
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                    <h1 className="text-2xl font-bold text-gray-800">{room.config.title}</h1>
                    <p className="text-gray-600">Room Code: {room.id}</p>
                    </div>
                    <Button
                    variant="secondary"
                    onClick={handleCopyLink}
                    className="flex items-center"
                    >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ParticipantList participants={room.participants} />
                    
                    <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Quiz Information</h3>
                        <div className="space-y-2">
                        <p><span className="font-medium">Questions:</span> {room.questions.length}</p>
                        <p><span className="font-medium">Type:</span> {room.config.type}</p>
                        <p className="text-sm text-gray-600">{room.config.description}</p>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleStartQuiz}
                        disabled={room.participants.length === 0}
                    >
                        Start Quiz
                    </Button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};