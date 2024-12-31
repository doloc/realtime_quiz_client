// Add these utility functions to the existing quiz.ts file
export const calculateAnswerPercentage = (count: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
};

export const getMaxAnswerCount = (counts: number[]): number => {
    return Math.max(...counts, 0);
};