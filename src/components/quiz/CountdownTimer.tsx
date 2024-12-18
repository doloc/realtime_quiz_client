import React from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  timeLeft: number;
  totalTime: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeLeft,
  totalTime,
}) => {
  const percentage = (timeLeft / totalTime) * 100;
  
  return (
    <div className="absolute top-0 left-0 w-full">
      <div className="relative h-2 bg-gray-200">
        <div
          className="absolute h-full bg-blue-500 transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="absolute top-4 right-4 flex items-center text-gray-600">
        <Timer className="h-5 w-5 mr-2" />
        <span className="font-semibold">{timeLeft}s</span>
      </div>
    </div>
  );
};