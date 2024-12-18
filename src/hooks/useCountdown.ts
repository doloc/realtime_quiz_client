import { useState, useEffect } from 'react';
import { calculateTimeLeft } from '../utils/countdown';

interface UseCountdownProps {
  targetTime: number;
  onComplete?: () => void;
  interval?: number;
}

export const useCountdown = ({
  targetTime,
  onComplete,
  interval = 1000,
}: UseCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => calculateTimeLeft(targetTime));

  useEffect(() => {
    if (!targetTime) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(targetTime);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onComplete?.();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetTime, onComplete, interval]);

  return timeLeft;
};