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

export const getRoomDescription = (type: Room['type']): string => {
  switch (type) {
    case 'monster': return 'Battle a regular enemy';
    case 'elite': return 'Face a powerful elite enemy';
    case 'bonfire': return 'Rest and heal your wounds';
    case 'boss': return 'Challenge the floor boss';
    default: return '';
  }
};