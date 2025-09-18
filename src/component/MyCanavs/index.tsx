import React, { useEffect, useRef } from "react";
import styles from "./index.module.scss";

const MyCanavs = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contents = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      console.log(
        contents.current?.clientWidth,
        contents.current?.clientHeight
      );
      canvas.width = contents.current?.clientWidth || 800;
      canvas.height = contents.current?.clientHeight || 600;
      const gl = canvas.getContext("webgl");
    }
  }, []);

  return (
    <div
      ref={contents}
      className={styles.Canvas}
      style={{
        border: "2px solid #1976d2",
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      <canvas ref={canvasRef} className={styles.webgl} id="webgl"></canvas>
    </div>
  );
};
export default MyCanavs;
