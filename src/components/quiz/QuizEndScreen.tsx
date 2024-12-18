import React from 'react';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { Button } from '../Button';
import { Leaderboard } from './Leaderboard';
import type { QuizEndResultPayload } from '../../types/websocket';

interface QuizEndScreenProps {
  result: QuizEndResultPayload;
  currentUserId?: string;
  onPlayAgain?: () => void;
  onExit?: () => void;
}

export const QuizEndScreen: React.FC<QuizEndScreenProps> = ({
  result,
  currentUserId,
  onPlayAgain,
  onExit,
}) => {
  const { winners, finalScores } = result;
  const winner = winners[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Winner Section */}
        <div className="text-center text-white">
          <Trophy className="h-24 w-24 mx-auto mb-4 text-yellow-400 animate-bounce" />
          <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl opacity-90">
            Congratulations to {winner.name} for winning with {winner.score} points!
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <Leaderboard
            entries={finalScores}
            highlightUserId={currentUserId}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {onPlayAgain && (
            <Button
              onClick={onPlayAgain}
              className="flex items-center"
              size="lg"
            >
              <Star className="mr-2 h-5 w-5" />
              Play Again
            </Button>
          )}
          {onExit && (
            <Button
              onClick={onExit}
              variant="secondary"
              className="flex items-center"
              size="lg"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Exit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}