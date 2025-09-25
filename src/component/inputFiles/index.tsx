import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Upload } from "antd";
import styles from "./index.module.scss";
interface InputFileProps {
  setFileContent: (content: string) => void;
}

const InputFile: React.FC<InputFileProps> = ({ setFileContent }) => {
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

  const props = {
    multiple: true,
    accept: ".obj",
    beforeUpload: upload,
  };
  return (
    <Upload className={styles.input} {...props}>
      <Button color="cyan" icon={<UploadOutlined />}>
        上传
      </Button>
    </Upload>
  );
};

export default InputFile;
