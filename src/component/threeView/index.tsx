import React, { useRef, useEffect } from "react";
import style from "./index.module.css";
import * as THREE from "three";
import { OrbitControls, OBJLoader } from "three-stdlib";

interface MyGPUProps {
  fileContent: string; // OBJ 文本
  imgfileContent: any; // HTMLImageElement 或其它可用来源
}

const GPU: React.FC<MyGPUProps> = ({ fileContent, imgfileContent }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // 保持对 three 关键对象的引用，便于在依赖变更时复用/清理
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  // 初始化 three 基础设施（只做一次）
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      3000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    // 颜色空间兼容处理
    // @ts-ignore
    if (
      THREE.SRGBColorSpace &&
      renderer.outputColorSpace !== THREE.SRGBColorSpace
    ) {
      // @ts-ignore
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 基本光照
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    // 动画循环
    let stopped = false;
    const animate = () => {
      if (stopped) return;
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 自适应窗口尺寸
    const onResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current)
        return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 清理
    return () => {
      stopped = true;
      window.removeEventListener("resize", onResize);
      if (controlsRef.current) controlsRef.current.dispose();
      if (rendererRef.current) {
        mountRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      // 释放模型与纹理
      if (modelGroupRef.current && sceneRef.current) {
        sceneRef.current.remove(modelGroupRef.current);
      }
      disposeGroup(modelGroupRef.current);
      modelGroupRef.current = null;
      disposeTexture(textureRef.current);
      textureRef.current = null;

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, []);

  // 当传入的 OBJ 文本或图片发生变化时，解析并渲染模型
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;
    if (!fileContent) return;

    // 移除旧模型
    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      disposeGroup(modelGroupRef.current);
      modelGroupRef.current = null;
    }
    // 清理旧纹理
    if (textureRef.current) {
      disposeTexture(textureRef.current);
      textureRef.current = null;
    }

    // 构建纹理
    let texture: THREE.Texture | null = null;
    if (imgfileContent) {
      if (imgfileContent instanceof HTMLImageElement) {
        texture = new THREE.Texture(imgfileContent);
        texture.needsUpdate = true;
      } else if (typeof imgfileContent === "string") {
        // 如果传来的是 URL/base64
        const loader = new THREE.TextureLoader();
        texture = loader.load(imgfileContent);
      } else if (imgfileContent instanceof ImageBitmap) {
        const canvas = document.createElement("canvas");
        canvas.width = imgfileContent.width;
        canvas.height = imgfileContent.height;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(imgfileContent, 0, 0);
        texture = new THREE.CanvasTexture(canvas);
      }
      if (texture) {
        // 颜色空间兼容处理
        // @ts-ignore
        if (THREE.SRGBColorSpace)
          (texture as any).colorSpace = THREE.SRGBColorSpace;
        texture.flipY = true; // OBJ 常见纹理坐标满足默认约定
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        textureRef.current = texture;
      }
    }

    // 解析 OBJ
    const loader = new OBJLoader();
    let object: THREE.Group;
    try {
      object = loader.parse(fileContent);
    } catch (e) {
      console.error("OBJ 解析失败:", e);
      return;
    }

    // 统一应用材质与法线
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry as THREE.BufferGeometry;
        if (!geom.getAttribute("normal")) {
          geom.computeVertexNormals();
        }
        let material: THREE.Material;
        if (texture) {
          material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.0,
            roughness: 1.0,
            side: THREE.DoubleSide,
          });
        } else {
          material = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.0,
            roughness: 1.0,
            side: THREE.DoubleSide,
          });
        }
        // 释放旧材质
        if (Array.isArray(mesh.material))
          mesh.material.forEach((m) => m.dispose());
        else mesh.material?.dispose();
        mesh.material = material;
      }
    });

    // 将模型加入场景并居中对焦
    sceneRef.current.add(object);
    modelGroupRef.current = object;
    fitCameraToObject(
      cameraRef.current,
      controlsRef.current || undefined,
      object
    );
  }, [fileContent, imgfileContent]);

  return <div ref={mountRef} className={style.three}></div>;
};

export default GPU;

// 工具函数：相机对焦与距离调整
function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls | undefined,
  object: THREE.Object3D
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance =
    maxSize / (2 * Math.tan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance);

  const direction = new THREE.Vector3()
    .subVectors(camera.position, controls?.target || new THREE.Vector3())
    .normalize();
  camera.position.copy(direction.multiplyScalar(distance).add(center));
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  if (controls) {
    controls.target.copy(center);
    controls.update();
  }
}

// 资源释放
function disposeGroup(group: THREE.Group | null) {
  if (!group) return;
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      if (mesh.geometry) mesh.geometry.dispose();
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      materials.forEach((m) => {
        if (!m) return;
        // @ts-ignore
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
}

function disposeTexture(tex: THREE.Texture | null) {
  if (!tex) return;
  tex.dispose();
}
