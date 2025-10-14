import style from "./index.module.css";

import GPU from "@/component/threeView";
import InputFile from "@/component/inputFiles";
import { useState } from "react";

const WebGPU = () => {
  const [fileContent, setFileContent] = useState<string>("");
  const [imgfileContent, setImgFileContent] = useState<HTMLImageElement | null>(
    null
  );
  return (
    <div className={style.three}>
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
      <GPU fileContent={fileContent} imgfileContent={imgfileContent} />
    </div>
  );
};

export default WebGPU;
