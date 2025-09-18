import styles from "./index.module.scss";
import MyCanavs from "@/component/MyCanavs";

const WebGL = () => {
  return (
    <div className={styles.app}>
      <MyCanavs></MyCanavs>
    </div>
  );
};
export default WebGL;
