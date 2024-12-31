import { FC } from 'react';
import { Loader2 } from 'lucide-react';

export const WaitingForResults: FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-500 text-white">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Waiting for other players...</h2>
        <p className="text-lg mt-2">Your answer has been recorded</p>
        </div>
    );
};