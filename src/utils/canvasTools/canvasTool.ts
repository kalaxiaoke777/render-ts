import type { DrawPointOption, DrawLineOption,DrawPolygonOption } from "./types";

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
    /**
   * 绘制多边形
   * @param points 顶点坐标数组 [[x1, y1], [x2, y2], ...]
   * @param color 线条颜色
   * @param fill 是否填充
   * @param fillColor 填充颜色
   * @param lineWidth 线宽
   */
  drawPolygon(
    points: [number, number][],
    color: string = "black",
    fill: boolean = false,
    fillColor: string = "rgba(164, 180, 21, 0.1)",
    lineWidth: number = 1
  ): void {
    if (!this.ctx || points.length < 3) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i][0], points[i][1]);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    if (fill) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    this.ctx.restore();
  }
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
