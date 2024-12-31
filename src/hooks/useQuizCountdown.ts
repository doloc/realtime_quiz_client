import { useState, useEffect } from 'react';

interface UseQuizCountdownProps {
    startTime?: number;
    onComplete?: () => void;
}

export const useQuizCountdown = ({
    startTime,
    onComplete,
}: UseQuizCountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if (!startTime) {
        setIsActive(false);
        return;
        }

        setIsActive(true);
        const targetTime = Date.now() + parseInt(startTime.toString(), 10) * 1000;
        
        const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(Math.ceil((targetTime - now) / 1000), 0);
        
        setTimeLeft(remaining);

        if (remaining <= 0) {
            clearInterval(timer);
            setIsActive(false);
            onComplete?.();
        }
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime, onComplete]);

    return {
        timeLeft,
        isActive,
    };
};