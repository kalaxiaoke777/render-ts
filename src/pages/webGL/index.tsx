import { useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";
import MyCanavs from "@/component/MyCanavs";
import InputFile from "@/component/inputFiles";

const WebGL = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 600, height: 600 });
  const [showCanvas, setShowCanvas] = useState(false);
  const [fileContent, setFileContent] = useState<string>("");
  const [imgfileContent, setImgFileContent] = useState<HTMLImageElement | null>(
    null
  );

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
      <InputFile
        setFileContent={setFileContent}
        buttonText="上传模型"
        fileType=".obj"
      />

      <InputFile
        _styles={{ position: "fixed", right: 12 }}
        setFileContent={setImgFileContent}
        buttonText="上传材质"
        fileType=".png,.jpg,.jpeg"
      />
      <MyCanavs
        width={size.width - 5}
        height={size.height - 8}
        fileContent={fileContent}
        imgfileContent={imgfileContent}
      />
    </div>
  );
};
export default WebGL;
