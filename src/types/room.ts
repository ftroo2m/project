export interface Room {
  id: number;
  type: RoomType;
  completed: boolean;
}

// 房间类型常量
export const ROOM_TYPES = ['monster', 'elite', 'bonfire', 'boss'] as const;

// 动态推导房间类型
export type RoomType = typeof ROOM_TYPES[number];