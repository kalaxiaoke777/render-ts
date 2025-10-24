import style from "./index.module.css";
import { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

const Badylon = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 创建引擎和场景
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // 创建摄像机
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    // 创建光源
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    // 创建一个球体
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      scene
    );

    // 渲染循环
    engine.runRenderLoop(() => {
      scene.render();
    });

    // 组件卸载时清理
    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div className={style.badylon}>
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "calc(99vh - 64px)" }}
      />
    </div>
  );
};

export default Badylon;
