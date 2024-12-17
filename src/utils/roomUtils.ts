import type { Room } from '../types/room';

export const getRoomIcon = (type: Room['type']): string => {
  switch (type) {
    case 'monster': return '👾';
    case 'elite': return '💀';
    case 'bonfire': return '🔥';
    case 'boss': return '👑';
    default: return '❓';
  }
};