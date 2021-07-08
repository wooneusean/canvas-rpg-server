export default class Player {
  socketId: string;
  name: string;
  position: Vector2;
  dimensions: Vector2 = { x: 20, y: 50 };
  color: string = '#FA0';

  constructor(socketId: string, name: string, position: Vector2, dimensions?: Vector2, color?: string) {
    this.socketId = socketId;
    this.name = name;
    this.position = position;
    this.dimensions = dimensions;
    this.color = color;
  }
}

export interface Vector2 {
  x: number;
  y: number;
}
