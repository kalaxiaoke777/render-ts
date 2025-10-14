import style from "./index.module.css";

import GPU from "@/component/threeView";

const WebGPU = () => {
  return (
    <div className={style.three}>
      <GPU />
    </div>
  );
};

export default WebGPU;
