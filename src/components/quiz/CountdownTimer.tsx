import { FC, useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
    totalTime: number;
}

export const CountdownTimer: FC<CountdownTimerProps> = ({
    totalTime,
}) => {
    const [ timeLeft, setTimeLeft ] = useState(totalTime);
    const [ percentage, setPercentage ] = useState(100);
    useEffect(() => {
        const interval = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 0) {
            clearInterval(interval);
            return 0;
            }
            return prev - 1;
        });
        }, 1000);
        setPercentage((timeLeft / totalTime) * 100);
        return () => clearInterval(interval);
    }, [timeLeft]);
    
    return (
        <div className="absolute top-0 left-0 w-full">
            <div className="relative h-2 bg-gray-200">
                <div
                className="absolute h-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="absolute top-4 left-4 flex items-center text-gray-600">
                <Timer className="h-5 w-5 mr-2" />
                <span className="font-semibold">{timeLeft}s</span>
            </div>
        </div>
    );
};