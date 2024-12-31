import { create } from 'zustand';
import { Room, User, Question } from '../types';

interface GameState {
    room: Room | null;
    currentUser: User | null;
    isAdmin: boolean;
    setRoom: (room: Room) => void;
    setCurrentUser: (user: User) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    updateParticipants: (participants: User[]) => void;
    updateCurrentQuestion: (questionIndex: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
    room: null,
    currentUser: null,
    isAdmin: false,
    setRoom: (room) => set({ room }),
    setCurrentUser: (user) => set({ currentUser: user }),
    setIsAdmin: (isAdmin) => set({ isAdmin }),
    updateParticipants: (participants) =>
        set((state) => ({
        room: state.room ? { ...state.room, participants } : null,
        })),
    updateCurrentQuestion: (questionIndex) =>
        set((state) => ({
        room: state.room ? { ...state.room, currentQuestion: questionIndex } : null,
        })),
}));