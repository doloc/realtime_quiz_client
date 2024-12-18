import { roomApi } from './api';

export const createRoom = async (): Promise<string> => {
  try {
    const { roomId } = await roomApi.createRoom();
    return roomId;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw new Error('Failed to create room. Please try again.');
  }
};