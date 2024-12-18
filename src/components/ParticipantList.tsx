import React from 'react';
import { Users } from 'lucide-react';
import type { User } from '../types';

interface ParticipantListProps {
  participants: User[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Users className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Participants ({participants.length})</h3>
      </div>
      
      {participants.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Waiting for participants to join...
        </p>
      ) : (
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-700">{participant.name}</span>
              <span className="text-sm text-gray-500">Ready</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};