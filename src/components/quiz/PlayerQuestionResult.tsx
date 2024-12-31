import { FC } from 'react';
import { CheckCircle, XCircle, TrendingUp, Trophy } from 'lucide-react';
import type { PlayerQuestionResultPayload } from '../../types/websocket';

interface PlayerQuestionResultProps {
    result: PlayerQuestionResultPayload;
}

export const PlayerQuestionResult: FC<PlayerQuestionResultProps> = ({ result }) => {
    const { isCorrect, points, totalPoints, ranking } = result;

    return (
        <div className={`
            min-h-screen flex flex-col items-center justify-center p-6
            ${isCorrect ? 'bg-green-500' : 'bg-red-500'}
            text-white transition-colors duration-500
        `}>
            <div className="text-center space-y-8">
                {/* Result Icon & Text */}
                <div className="flex flex-col items-center space-y-4">
                {isCorrect ? (
                    <>
                    <CheckCircle className="h-20 w-20" />
                    <h2 className="text-4xl font-bold">Correct!</h2>
                    </>
                ) : (
                    <>
                    <XCircle className="h-20 w-20" />
                    <h2 className="text-4xl font-bold">Incorrect!</h2>
                    </>
                )}
                </div>

                {result.streak && result.streak > 1 && (
                <div className="text-xl">
                    Answer Streak <span className="inline-block bg-white/20 rounded-full px-3 py-1">{result.streak}</span>
                </div>
                )}

                {/* Points Gained */}
                {points > 0 && (
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-2xl font-bold">+{points} points</span>
                    </div>
                </div>
                )}

                {/* Total Score */}
                <div className="text-xl">
                Total Score: <span className="font-bold">{totalPoints}</span>
                </div>

                {/* Current Ranking */}
                <div className="flex flex-col items-center space-y-2">
                <Trophy className="h-6 w-6" />
                <p className="text-lg">
                    You're in <span className="font-bold">{ranking}</span> place!
                </p>
                </div>
            </div>
        </div>
    );
};