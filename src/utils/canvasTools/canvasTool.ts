import type { DrawPointOption, DrawLineOption } from "./types";

class CanvasTools {
  canvas_: HTMLCanvasElement;
  ctx: any;
  windowHeight: number;
  windowWidth: number;
  constructor(
    _canvas: HTMLCanvasElement,
    windowHeight = window.innerHeight,
    windowWidth = window.innerWidth
  ) {
    this.windowHeight = windowHeight;
    this.windowWidth = windowWidth;
    this.canvas_ = _canvas;
    this.ctx = _canvas.getContext("2d");
  }
  draw() {}
  drawLine(lines: DrawLineOption[]): void {
    if (!this.ctx) return;
    lines.forEach((line) => {
      this.ctx.strokeStyle = line.color || "black";
      this.ctx.lineWidth = line.fillSize || 1;
      this.ctx.beginPath();
      line.coordinates.forEach((coordinate, index) => {
        if (index === 0) {
          this.ctx.moveTo(coordinate[0], coordinate[1]);
        } else {
          this.ctx.lineTo(coordinate[0], coordinate[1]);
        }
      });
      this.ctx.stroke();
      this.ctx.closePath();
    });
  }
  drawRect() {}
  drawPoint(points: DrawPointOption[]): void {
    if (!this.ctx) return;

    points.forEach((point) => {
      this.ctx.fillStyle = point.color || "black";
      this.ctx?.fillRect(
        point.coordinate[0],
        point.coordinate[1],
        point.size || 1,
        point.size || 1
      );
    });
  }
}
export default CanvasTools;
