// Utility functions for countdown calculations
export const calculateTimeLeft = (targetTime: number): number => {
  const now = Date.now();
  const difference = targetTime - now;
  return Math.max(Math.ceil(difference / 1000), 0);
};

export const formatTime = (seconds: number): string => {
  return seconds.toString().padStart(2, '0');
};