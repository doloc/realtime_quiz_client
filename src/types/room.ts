export interface RoomConfig {
  title: string;
  description: string;
  type: 'public' | 'private';
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  options: Array<{
    text: string;
    isRequired: boolean;
  }>;
  correctAnswers: number[];
  timeLimit: number;
}

export interface Room {
  id: string;
  config: RoomConfig;
  questions: Question[];
  participants: User[];
  currentQuestion: number;
  status: 'waiting' | 'active' | 'finished';
}