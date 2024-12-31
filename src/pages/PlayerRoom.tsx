import { useState, useCallback, FC } from 'react';
import { useParams } from 'react-router-dom';
import { StartCountdown } from '../components/quiz/StartCountdown';
import { QuestionDisplay } from '../components/quiz/QuestionDisplay';
import { WaitingForResults } from '../components/quiz/WaitingForResults';
import { PlayerQuestionResult } from '../components/quiz/PlayerQuestionResult';
import { useWebSocket } from '../hooks/useWebSocket';
import type { QuestionRequestPayload, PlayerQuestionResultPayload, QuizStartCountdownPayload, QuestionResultPayload, QuizEndResultPayload } from '../types/websocket';
import { PlayerQuizEndScreen } from '../components/quiz/PlayerQuizEndScreen';

export const PlayerRoom: FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [currentQuestion, setCurrentQuestion] = useState<QuestionRequestPayload | null>(null);
    const [questionResult, setQuestionResult] = useState<PlayerQuestionResultPayload | null>(null);
    const [quizEndResult, setQuizEndResult] = useState<QuizEndResultPayload | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showCountdown, setShowCountdown] = useState(false);
    const [startTime, setStartTime] = useState<number | undefined>();

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
            setCurrentQuestion(null);
        },
        onQuizEndResult: (data: QuizEndResultPayload) => {
            setQuizEndResult(data);
            setCurrentQuestion(null);
            setQuestionResult(null);
        }
        }
    );

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null || !currentQuestion) return;

        setSelectedAnswer(answerIndex);
        sendMessage('SUBMIT_ANSWER', {
        quizId: roomId,
        currentQuestion: currentQuestion.currentQuestion,
        answer: answerIndex,
        });
    };

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
        <PlayerQuizEndScreen result={quizEndResult}  />
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