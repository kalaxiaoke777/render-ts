export type DrawPointOption = {
  coordinate: [number, number];
  color?: string;
  size?: number;
};
export type DrawLineOption = {
  coordinates: [number, number][];
  color?: string;
  fillSize?: number;
};
export type DrawPolygonOption = {
  points: [number, number][];
  color?: string;
  fillSize?: number;
  fill?: boolean;
  fillStyle?: string;
};