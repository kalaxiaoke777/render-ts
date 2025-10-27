import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Upload } from "antd";
import styles from "./index.module.scss";
interface InputFileProps {
  setFileContent: (content: any) => void;
  buttonText?: string;
  _styles?: React.CSSProperties;
  fileType: string;
}

const InputFile: React.FC<InputFileProps> = ({
  setFileContent,
  buttonText,
  _styles,
  fileType = ".obj",
}) => {
  const upload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
    // 阻止自动上传
    return false;
  };
  const uploadImg = (file: any) => {
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => setFileContent(img);
    return false;
  };

  const props = {
    multiple: true,
    accept: fileType,
    beforeUpload: fileType === ".obj" ? upload : uploadImg,
  };
  return (
    <Upload className={styles.input} {...props} style={_styles}>
      <Button color="cyan" icon={<UploadOutlined />}>
        {buttonText || "上传文件"}
      </Button>
    </Upload>
  );
};

export default InputFile;
