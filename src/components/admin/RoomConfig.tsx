import { FC } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { RoomConfig as RoomConfigType } from '../../types';

interface RoomConfigProps {
    config: RoomConfigType;
    onChange: (config: RoomConfigType) => void;
    error?: string;
}

export const RoomConfig: FC<RoomConfigProps> = ({
    config,
    onChange,
    error,
}) => {
    return (
        <div className="space-y-4">
            <Input
                label="Room Title"
                placeholder="Enter room title"
                value={config.title}
                onChange={(e) => onChange({ ...config, title: e.target.value })}
                required
            />
            <Input
                label="Description"
                placeholder="Enter room description"
                value={config.description}
                onChange={(e) => onChange({ ...config, description: e.target.value })}
                required
            />
            <Select
                label="Room Type"
                value={config.type}
                onChange={(e) => onChange({ ...config, type: e.target.value as 'public' | 'private' })}
                options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
                ]}
                required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};