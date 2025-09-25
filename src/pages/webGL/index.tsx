import { useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";
import MyCanavs from "@/component/MyCanavs";
import InputFile from "@/component/inputFiles";

const WebGL = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 600, height: 600 });
  const [showCanvas, setShowCanvas] = useState(false);
  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    setShowCanvas(true); // 组件挂载

    return () => {
      window.removeEventListener("resize", handleResize);
      setShowCanvas(false); // 组件卸载
    };
  }, []);

  return (
    <div ref={canvasRef} className={styles.app}>
      <InputFile setFileContent={setFileContent} />
      <MyCanavs
        width={size.width - 5}
        height={size.height - 8}
        fileContent={fileContent}
      />
    </div>
  );
};
export default WebGL;
