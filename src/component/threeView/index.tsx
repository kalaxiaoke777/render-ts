import React, { useRef, useEffect } from "react";
import style from "./index.module.css";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

const GPU = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 创建场景
    const scene = new THREE.Scene();
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current!.clientWidth / mountRef.current!.clientHeight,
      0.1,
      3000
    );
    camera.position.set(0, 0, 10);
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      mountRef.current!.clientWidth,
      mountRef.current!.clientHeight
    );
    mountRef.current!.appendChild(renderer.domElement);

    // 添加 OrbitControls 控件
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 简单添加一个立方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 清理
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef} className={style.three}></div>;
};

export default GPU;
