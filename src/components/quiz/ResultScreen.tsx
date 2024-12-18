import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResultScreenProps {
  isCorrect: boolean;
  points: number;
  streak: number;
  position: number;
  totalPlayers: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  isCorrect,
  points,
  streak,
  position,
  totalPlayers,
}) => {
  return (
    <div className={`
      min-h-screen flex flex-col items-center justify-center p-6 text-white
      ${isCorrect ? 'bg-green-500' : 'bg-red-500'}
    `}>
      <div className="text-center space-y-6">
        <div className="text-4xl font-bold mb-8">
          {isCorrect ? (
            <div className="flex items-center">
              <CheckCircle className="h-12 w-12 mr-3" />
              Correct
            </div>
          ) : (
            <div className="flex items-center">
              <XCircle className="h-12 w-12 mr-3" />
              Incorrect
            </div>
          )}
        </div>

        {streak > 1 && (
          <div className="text-xl">
            Answer Streak <span className="inline-block bg-white/20 rounded-full px-3 py-1">{streak}</span>
          </div>
        )}

        {points > 0 && (
          <div className="text-3xl font-bold">
            +{points} points
          </div>
        )}

        <div className="text-xl mt-8">
          You're in {position}{getOrdinalSuffix(position)} place
          {totalPlayers > 1 && ` out of ${totalPlayers}`}
        </div>
      </div>
    </div>
  );
};