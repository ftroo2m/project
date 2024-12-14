export interface Room {
  id: number;
  type: 'monster' | 'elite' | 'bonfire' | 'boss';
  completed: boolean;
}

export const ROOM_TYPES = ['monster', 'elite', 'bonfire', 'boss'] as const;