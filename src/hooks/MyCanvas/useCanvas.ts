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

    let objInstance = new Obj(fileContent);
    const projectionMat = [
      [0.5, 0, 0, 0],
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
    // 根据obj中的f 绘制三角
    const lineOptions: DrawLineOption[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const canvasTools = new CanvasTools(canvas);
    objInstance.f.forEach((face) => {
      const v = face.v;
      if (v.length >= 3) {
        const [p1, p2, p3] = v;
        lineOptions.push(

        );
        const canvas = canvasRef.current;
        if (canvas) {
          canvasTools.drawPolygon(
            [
              screenCoords[p1],
              screenCoords[p2],
              screenCoords[p3]
            ],
            "white",
            true,
            `white` // 随机填充色
          );
        }
      }
    });

  }, [fileContent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const canvasTools = new CanvasTools(canvas);
    }
  }, [width, height, points, lines]);

  return canvasRef;
};

export default useCanvas;
