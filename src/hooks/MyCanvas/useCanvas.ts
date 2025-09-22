import { useEffect, useRef } from "react";

const useCanvas = (width: number, height: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      let x = 0;
      const y = 50;
      const rectWidth = 200;
      const rectHeight = 100;
      let animationFrameId: number;

      const draw = () => {
        ctx!.clearRect(0, 0, width, height);
        ctx!.fillStyle = "red";
        ctx!.fillRect(x, y, rectWidth, rectHeight);
        x += 2;
        if (x > width) x = -rectWidth;
        animationFrameId = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [width, height]);

  return canvasRef;
};

export default useCanvas;
