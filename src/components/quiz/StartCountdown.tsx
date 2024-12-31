import { FC, useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface StartCountdownProps {
    timeLeft?: number;
    onComplete?: () => void;
}

export const StartCountdown: FC<StartCountdownProps> = ({
    timeLeft,
    onComplete,
}) => {
    const [countDown, setCountDown] = useState<number>(timeLeft || 0);
    useEffect(() => {
        if (!timeLeft) return;

        const timer = setInterval(() => {
        setCountDown(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countDown === 0) {
        onComplete?.();
        }
    }, [countDown, onComplete]);

    return (
        <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center text-white">
            <div className="text-center space-y-6">
                <Timer className="h-16 w-16 mx-auto animate-pulse" />
                <h2 className="text-4xl font-bold">Quiz Starting in</h2>
                <div className="text-8xl font-bold tabular-nums">
                {countDown}
                </div>
                <p className="text-xl text-blue-100">Get ready!</p>
            </div>
        </div>
    );
};