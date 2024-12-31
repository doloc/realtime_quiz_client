import { FC } from 'react';
import { Trophy, Medal, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuizEndResultPayload } from '../../types/websocket';

interface PlayerQuizEndScreenProps {
    result: QuizEndResultPayload;
    onPlayAgain?: () => void;
    onExit?: () => void;
}

export const PlayerQuizEndScreen: FC<PlayerQuizEndScreenProps> = ({
    result,
    onPlayAgain,
    onExit,
}) => {
    const getRankingMessage = () => {
        if (result.ranking === 1) return "Congratulations! You're the winner!";
        if (result.ranking === 2) return "Great job! You got second place!";
        if (result.ranking === 3) return "Well done! You're in third place!";
        return `You finished in ${result.ranking}${getRankingSuffix(result.ranking)} place`;
    };

    const getRankingSuffix = (rank: number) => {
        if (rank > 3 && rank < 21) return 'th';
        switch (rank % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
        }
    };

    const getRankingIcon = () => {
        switch (result.ranking) {
        case 1:
            return <Trophy className="h-24 w-24 text-yellow-400" />;
        case 2:
            return <Medal className="h-24 w-24 text-gray-400" />;
        case 3:
            return <Medal className="h-24 w-24 text-amber-600" />;
        default:
            return <Users className="h-24 w-24 text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                {getRankingIcon()}
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quiz Complete!
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                {getRankingMessage()}
                </p>

                <div className="space-y-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-lg text-gray-700">
                    Your Score: <span className="font-bold text-blue-600">{result.score}</span>
                    </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">
                    Out of {result.totalPlayers} {result.totalPlayers === 1 ? 'player' : 'players'}
                    </p>
                </div>
                </div>

                <div className="space-x-4">
                {onPlayAgain && (
                    <Button onClick={onPlayAgain} size="lg">
                    Play Again
                    </Button>
                )}
                {onExit && (
                    <Button onClick={onExit} variant="secondary" size="lg">
                    Exit Quiz
                    </Button>
                )}
                </div>
            </div>
        </div>
    );
};