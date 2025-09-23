import { useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";
import MyCanavs from "@/component/MyCanavs";
import InputFile from "@/component/inputFiles";

const WebGL = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 600, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={canvasRef} className={styles.app}>
      <MyCanavs width={size.width - 5} height={size.height - 8}></MyCanavs>
      <InputFile></InputFile>
    </div>
  );
};
export default WebGL;
