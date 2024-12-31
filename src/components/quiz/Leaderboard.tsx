import { FC } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardEntry } from '../../types/websocket';

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    highlightUserId?: string;
}

export const Leaderboard: FC<LeaderboardProps> = ({ entries, highlightUserId }) => {
    const getRankIcon = (rank: number) => {
        switch (rank) {
        case 1:
            return <Trophy className="h-6 w-6 text-yellow-500" />;
        case 2:
            return <Medal className="h-6 w-6 text-gray-400" />;
        case 3:
            return <Award className="h-6 w-6 text-amber-600" />;
        default:
            return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Leaderboard</h2>
            
            <div className="space-y-4">
                {entries.map((entry, idx) => (
                <div
                    key={idx}
                    className={`
                    flex items-center justify-between p-4 rounded-lg
                    ${entry.playerId === highlightUserId ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}
                    `}
                >
                    <div className="flex items-center space-x-4">
                    <div className="w-8 text-center font-bold text-gray-600">
                        {getRankIcon(idx + 1) || `#${idx + 1}`}
                    </div>
                    <span className="font-medium">{entry.playerName}</span>
                    </div>
                    <span className="font-bold text-blue-600">{entry.score}</span>
                </div>
                ))}
            </div>
        </div>
    );
}