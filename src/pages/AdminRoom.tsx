import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useGameStore } from '../store/gameStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { RoomConfig } from '../components/RoomConfig';
import { QuestionList } from '../components/QuestionList';
import { WaitingScreen } from '../components/WaitingScreen';
import { QuestionDisplay } from '../components/admin/QuestionDisplay';
import { QuestionResults } from '../components/admin/QuestionResults';
import { Button } from '../components/Button';
import type { RoomConfig as RoomConfigType, Question } from '../types';
import type { 
  QuestionRequestPayload, 
  QuestionResultPayload,
  ParticipantPayload 
} from '../types/websocket';

export const AdminRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { createQuiz, isCreating, error: quizError } = useQuiz();
  const { room, setRoom, updateParticipants } = useGameStore();

  const [config, setConfig] = useState<RoomConfigType>({
    title: '',
    description: '',
    type: 'public',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [configError, setConfigError] = useState<string>();
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionRequestPayload | null>(null);
  const [questionResultData, setQuestionResultData] = useState<QuestionResultPayload | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Initialize WebSocket connection and handlers
  const { sendMessage } = useWebSocket(
    {
      role: 'host',
      quizId: roomId!,
    },
    {
      onQuestionRequest: (data: QuestionRequestPayload) => {
        setCurrentQuestionData(data);
        setQuestionResultData(null);
        setTimeLeft(data.timeLimit);
      },
      onQuestionResult: (data: QuestionResultPayload) => {
        setQuestionResultData(data);
      },
      onParticipantJoined: (data: ParticipantPayload) => {
        if (room) {
          updateParticipants([...room.participants, data.participant]);
        }
      },
      onParticipantLeft: (data: ParticipantPayload) => {
        if (room) {
          updateParticipants(
            room.participants.filter(p => p.id !== data.participant.id)
          );
        }
      },
    }
  );

  // Timer effect for countdown
  useEffect(() => {
    if (!currentQuestionData || !timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionData, timeLeft]);

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
    
    const success = await createQuiz({
      roomId: roomId!,
      config,
      questions,
    });

    if (success) {
      setRoom({
        id: roomId!,
        config,
        questions,
        participants: [],
        currentQuestion: 0,
        status: 'waiting',
      });
      
      setShowWaitingScreen(true);
    }
  };

  const handleStartQuiz = useCallback(() => {
    sendMessage('START_QUIZ', { quizId: roomId });
  }, [sendMessage, roomId]);

  const handleNextQuestion = useCallback(() => {
    sendMessage('REQUEST_NEXT_QUESTION', { quizId: roomId });
  }, [sendMessage, roomId]);

  const handleEndQuiz = useCallback(() => {
    sendMessage('QUIZ_END', { quizId: roomId });
  }, [sendMessage, roomId]);

  if (showWaitingScreen && room) {
    return <WaitingScreen room={room} onStart={handleStartQuiz} />;
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
      <QuestionDisplay
        questionData={currentQuestionData}
        timeLeft={timeLeft}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Create Quiz Room</h1>
            <p className="text-gray-600">Room Code: {roomId}</p>
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