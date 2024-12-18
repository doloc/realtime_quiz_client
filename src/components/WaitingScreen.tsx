import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './Button';
import { ParticipantList } from './ParticipantList';
import { StartCountdown } from './quiz/StartCountdown';
import { useWebSocket } from '../hooks/useWebSocket';
import { useCountdown } from '../hooks/useCountdown';
import type { Room } from '../types';
import type { QuizStartCountdownPayload } from '../types/websocket';

interface WaitingScreenProps {
  room: Room;
  onStart: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ room, onStart }) => {
  const [showCountdown, setShowCountdown] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const { sendMessage } = useWebSocket(
    {
      role: 'host',
      quizId: room.id,
    },
    {
      onQuizStartCountdown: (data: QuizStartCountdownPayload) => {
        setStartTime(data.startTime);
        setShowCountdown(true);
      },
    }
  );

  const timeLeft = useCountdown({
    targetTime: startTime,
    onComplete: () => {
      setShowCountdown(false);
      onStart();
    },
  });

  const shareLink = `${window.location.origin}/play/${room.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const handleStartQuiz = () => {
    sendMessage('START_QUIZ', { quizId: room.id });
  };

  if (showCountdown) {
    return <StartCountdown startTime={startTime} />;
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
                // disabled={room.participants.length === 0}
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