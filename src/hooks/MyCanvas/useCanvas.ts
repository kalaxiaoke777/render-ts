import { useEffect, useRef, useState } from "react";
import CanvasTools from "@/utils/canvasTools/canvasTool";
import type { DrawPointOption, DrawLineOption } from "@/types/global";
import Obj from "@/utils/objTools/readObj";
const useCanvas = (width: number, height: number, fileContent: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<DrawPointOption[]>([]);
  const [lines, setLines] = useState<DrawLineOption[]>([]);
  const [obj, setObj] = useState<Obj | null>(null);

  // 只在初始化时设置一次点和线
  useEffect(() => {
    console.log(fileContent);

    let objInstance = new Obj(fileContent);
    const projectionMat = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    const viewMat = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const screenCoords = objInstance.toScreenCoords(
      projectionMat,
      viewMat,
      width,
      height
    );
    const pointOptions: DrawPointOption[] = screenCoords.map(([x, y]) => ({
      coordinate: [x, y],
      color: "red",
      size: 5,
    }));
    // setPoints(pointOptions);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const canvasTools = new CanvasTools(canvas);
      canvasTools.drawPoint(pointOptions);
    }
  }, [fileContent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const canvasTools = new CanvasTools(canvas);
      // canvasTools.drawPoint(points);
      // canvasTools.drawLine(lines);
    }
  }, [width, height, points, lines]);

  return canvasRef;
};

export default useCanvas;
