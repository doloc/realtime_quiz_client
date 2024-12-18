import React from 'react';
import { Timer } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';
import { formatTime } from '../../utils/countdown';

interface StartCountdownProps {
  startTime?: number;
  onComplete?: () => void;
}

export const StartCountdown: React.FC<StartCountdownProps> = ({
  startTime,
  onComplete,
}) => {
  const timeLeft = useCountdown({
    targetTime: startTime ? Date.now() + parseInt(startTime.toString(), 10) * 1000 : 0,
    onComplete,
  });

  if (!startTime || timeLeft <= 0) return null;

  return (
    <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-6">
        <Timer className="h-16 w-16 mx-auto animate-pulse" />
        <h2 className="text-4xl font-bold">Quiz Starting in</h2>
        <div className="text-8xl font-bold tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <p className="text-xl text-blue-100">Get ready!</p>
      </div>
    </div>
  );
};