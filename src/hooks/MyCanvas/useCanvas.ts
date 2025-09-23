import { useEffect, useRef, useState } from "react";
import CanvasTools from "@/utils/canvasTools/canvasTool";
import type { DrawPointOption, DrawLineOption } from "@/types/global";
const useCanvas = (width: number, height: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState([] as DrawPointOption[]);
  const [lines, setLines] = useState([] as DrawLineOption[]);
  useEffect(() => {
    setPoints([
      {
        coordinate: [100, 100],
        color: "red",
        size: 5,
      },
      {
        coordinate: [100, 200],
        color: "black",
        size: 50,
      },
      {
        coordinate: [100, 300],
        color: "blue",
        size: 10,
      },
    ]);
    setLines([
      {
        coordinates: [
          [300, 200],
          [300, 300],
        ],
        color: "green",
        fillSize: 5,
      },
      {
        coordinates: [
          [100, 200],
          [100, 300],
          [100, 400],
          [100, 500],
        ],
        color: "red",
        fillSize: 5,
      },
      {
        coordinates: [
          [200, 200],
          [200, 300],
          [200, 400],
          [200, 500],
          [200, 600],
        ],
        color: "yellow",
        fillSize: 5,
      },
    ]);
  });
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const canvasTools = new CanvasTools(canvas!);
      // canvasTools.drawPoint(points);
      // canvasTools.drawLine(lines);
    }
  }, [width, height, points, lines]);

  return canvasRef;
};

export default useCanvas;
