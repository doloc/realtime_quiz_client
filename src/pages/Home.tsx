import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { LoginModal } from '../components/auth/LoginModal';
import { useAuth } from '../hooks/useAuth';
import { useQuiz } from '../hooks/useQuiz';
import { createRoom } from '../services/room';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { login, verifyToken, error: authError } = useAuth();
  const { joinQuiz, isJoining, error: quizError } = useQuiz();
  
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomId || !username) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await joinQuiz(roomId, username);
      if (response) {
        // Navigate to player room with quiz info
        navigate(`/play/${response.quizId}?username=${encodeURIComponent(response.username)}`);
      }
    } catch (err) {
      setError('Failed to join room. Please check the room code and try again.');
    }
  };

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    try {
      // First, check if there's a token and verify it
      const isAuthenticated = await verifyToken();
      
      if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
      }

      // If authenticated, create a new room
      const newRoomId = await createRoom();
      navigate(`/admin/${newRoomId}`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    const success = await login(username, password);
    if (success) {
      setShowLoginModal(false);
      // Create new room after successful login
      try {
        const newRoomId = await createRoom();
        navigate(`/admin/${newRoomId}`);
      } catch (err) {
        setError('Failed to create room. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            English Learning Quiz
          </h1>
          <p className="text-gray-600 mt-2">
            Join a room or create your own quiz session
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Room Code"
            placeholder="Enter room code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {(error || quizError) && (
            <p className="text-red-500 text-sm">{error || quizError}</p>
          )}
          <Button
            className="w-full"
            size="lg"
            onClick={handleJoinRoom}
            disabled={isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Room'}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
          >
            {isCreatingRoom ? 'Creating Room...' : 'Create New Room'}
          </Button>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        error={authError}
      />
    </div>
  );
};