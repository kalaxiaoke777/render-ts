import { useEffect, useRef } from "react";

const useCanvas = (width: number, height: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        
        // 绘制红色矩形
        ctx.fillStyle = "red";
        ctx.fillRect(50, 50, 200, 100);
        
        // 绘制蓝色边框矩形
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(300, 200, 150, 150);
        
        // 绘制绿色圆形
        ctx.beginPath();
        ctx.arc(400, 100, 50, 0, Math.PI * 2);
        ctx.fillStyle = "green";
        ctx.fill();
        
        console.log('Canvas drawing completed', { width, height });
      }
    }
  }, [width, height]);

  return canvasRef;
}

export default useCanvas;
