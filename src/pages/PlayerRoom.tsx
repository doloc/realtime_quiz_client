import { useState, useCallback, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StartCountdown } from '../components/quiz/StartCountdown';
import { QuestionDisplay } from '../components/quiz/QuestionDisplay';
import { WaitingForResults } from '../components/player/WaitingForResults';
import { PlayerQuestionResult } from '../components/player/PlayerQuestionResult';
import { useWebSocket } from '../hooks/useWebSocket';
import type { QuestionRequestPayload, PlayerQuestionResultPayload, QuizStartCountdownPayload, QuizEndResultPayload, QuizPayload } from '../types/websocket';
import { PlayerQuizEndScreen } from '../components/player/PlayerQuizEndScreen';
import { QuizNotificationPopup } from '../components/quiz/QuizNotificationPopupProps';

export const PlayerRoom: FC = () => {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const [currentQuestion, setCurrentQuestion] = useState<QuestionRequestPayload | null>(null);
    const [questionResult, setQuestionResult] = useState<PlayerQuestionResultPayload | null>(null);
    const [quizEndResult, setQuizEndResult] = useState<QuizEndResultPayload | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showCountdown, setShowCountdown] = useState(false);
    const [startTime, setStartTime] = useState<number | undefined>();
    const [notification, setNotification] = useState<QuizPayload>();

    const handleQuizStart = useCallback(() => {
        setShowCountdown(false);
        setCurrentQuestion(null);
        setQuestionResult(null);
        setSelectedAnswer(null);
    }, []);

    const { sendMessage } = useWebSocket(
        {
            role: 'player',
            quizId: roomId!,
            playerName: URLSearchParams ? new URLSearchParams(window.location.search).get('username') || '' : '',
        },
        {
            onQuizStartCountdown: (data: QuizStartCountdownPayload) => {
                setShowCountdown(true);
                setStartTime(parseInt(data.startTime.toString(), 10));
            },
            onQuestionRequest: (data: QuestionRequestPayload) => {
                setCurrentQuestion(data);
                setSelectedAnswer(null);
                setQuestionResult(null);
            },
            onPlayerQuestionResult: (data: PlayerQuestionResultPayload) => {
                setQuestionResult(data);
                setSelectedAnswer(null);
                setCurrentQuestion(null);
            },
            onQuizEndResult: (data: QuizEndResultPayload) => {
                setQuizEndResult(data);
                setCurrentQuestion(null);
                setQuestionResult(null);
            },
            onQuizEnded: (data: QuizPayload) => {
                setNotification(data);
            },
            onQuizNotFound: (data: QuizPayload) => {
                setNotification(data);
            },
        }
    );

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null || !currentQuestion) return;
            setSelectedAnswer(answerIndex);
            sendMessage('SUBMIT_ANSWER', {
            quizId: roomId,
            questionId: currentQuestion.questionId,
            currentQuestion: currentQuestion.currentQuestion,
            answer: currentQuestion.answers[answerIndex],
        });
    };

    if (notification) {
        return (
            <QuizNotificationPopup
                message={notification.message}
                onGoHome={() => navigate('/')}
            />
        )
    }

    if (showCountdown) {
        return (
        <StartCountdown
            timeLeft={startTime}
            onComplete={handleQuizStart}
        />
        );
    }

    if (questionResult) {
        return <PlayerQuestionResult result={questionResult} />;
    }

    if (selectedAnswer !== null && !questionResult) {
        return <WaitingForResults />;
    }

    if (currentQuestion) {
        return (
        <QuestionDisplay
            questionData={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            isAnswerSelected={selectedAnswer !== null} />
        );
    }

    if (quizEndResult) {
        return (
        <PlayerQuizEndScreen result={quizEndResult} onPlayAgain={() => navigate('/')}  />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Waiting for quiz to start...</h2>
                <p className="text-gray-600 mt-2">The host will begin the quiz shortly</p>
            </div>
        </div>
    );
};