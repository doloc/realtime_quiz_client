import { FC } from 'react';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuizNotificationPopupProps {
  message: string;
  onGoHome: () => void;
}

export const QuizNotificationPopup: FC<QuizNotificationPopupProps> = ({
  message,
  onGoHome,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-center mb-4">
          {message}
        </h3>

        <Button
          onClick={onGoHome}
          className="w-full flex items-center justify-center"
          size="lg"
        >
          <Home className="mr-2 h-5 w-5" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};