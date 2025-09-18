import React from "react";
import useCanvas from "@/hooks/MyCanvas/useCanvas";
import styles from "./index.module.scss";

interface MyCanavsProps {
  width: number;
  height: number;
}

const MyCanavs: React.FC<MyCanavsProps> = ({ width, height }) => {
  const canvasRef = useCanvas(width, height);
  return (
    <canvas ref={canvasRef} className={styles.webgl} id="webgl"></canvas>
  );
};
export default MyCanavs;
