import { useEffect, useRef, useState } from "react";
import CanvasTools from "@/utils/canvasTools/canvasTool";
import type { DrawPointOption, DrawLineOption } from "@/types/global";
import Obj from "@/utils/objTools/readObj";

function dot(a: number[], b: number[]) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}
function cross(a: number[], b: number[]) {
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0]
  ];
}
function normalize(a: number[]) {
  const len = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
  return [a[0]/len, a[1]/len, a[2]/len];
}

const useCanvas = (width: number, height: number, fileContent: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

// ...existing code...
// ...existing code...
  useEffect(() => {
    let objInstance = new Obj(fileContent);
    const projectionMat = [
      [0.5, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    const viewMat = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);
    const W = canvas.width | 0;
    const H = canvas.height | 0;

    const screenCoords = objInstance.toScreenCoords(
      projectionMat,
      viewMat,
      W,
      H
    );

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // z-buffer（越大越近）
    const zBuffer = new Float32Array(W * H);
    zBuffer.fill(-Infinity);

    // 环境光 + 方向光
    const AMBIENT = 0.25;
    const lightDir = normalize([0.5, 0.7, 1]);

    // 准备像素缓冲
    const image = ctx.createImageData(W, H);
    const data = image.data;

    // 2D 边函数与重心坐标
    const edge = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
      (cx - ax) * (by - ay) - (cy - ay) * (bx - ax);

    const setPixel = (x: number, y: number, r: number, g: number, b: number, a = 255) => {
      const idx = ((y * W) + x) << 2;
      data[idx    ] = r | 0;
      data[idx + 1] = g | 0;
      data[idx + 2] = b | 0;
      data[idx + 3] = a | 0;
    };

    objInstance.f.forEach((face) => {
      const vIdx = face.v;
      if (!vIdx || vIdx.length < 3) return;

      // 顶点世界坐标
      const v1 = objInstance.v[vIdx[0]];
      const v2 = objInstance.v[vIdx[1]];
      const v3 = objInstance.v[vIdx[2]];
      if (!v1 || !v2 || !v3) return;

      // 平面法线（用于平坦着色或作为插值缺省）
      const e1 = [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]];
      const e2 = [v3[0]-v1[0], v3[1]-v1[1], v3[2]-v1[2]];
      let nFace = cross(e1, e2);
      const nLen = Math.hypot(nFace[0], nFace[1], nFace[2]);
      if (nLen < 1e-6) return; // 退化三角形
      nFace = [nFace[0]/nLen, nFace[1]/nLen, nFace[2]/nLen];

      // 顶点法线（Gouraud/Phong 基础）可选
      let n1: number[] | null = null, n2: number[] | null = null, n3: number[] | null = null;
      if (face.vn && face.vn.length >= 3 && objInstance.vn) {
        const nn1 = objInstance.vn[face.vn[0]];
        const nn2 = objInstance.vn[face.vn[1]];
        const nn3 = objInstance.vn[face.vn[2]];
        if (nn1 && nn2 && nn3) {
          const norm = (a: number[]) => {
            const l = Math.hypot(a[0], a[1], a[2]) || 1;
            return [a[0]/l, a[1]/l, a[2]/l];
          };
          n1 = norm(nn1); n2 = norm(nn2); n3 = norm(nn3);
        }
      }

      // 屏幕三角形
      const p1 = screenCoords[vIdx[0]];
      const p2 = screenCoords[vIdx[1]];
      const p3 = screenCoords[vIdx[2]];
      if (!p1 || !p2 || !p3) return;

      // 三角形面积（符号）
      const area = edge(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
      if (area === 0) return;

      // 包围盒并裁剪到画布
      const minX = Math.max(0, Math.floor(Math.min(p1[0], p2[0], p3[0])));
      const maxX = Math.min(W - 1, Math.ceil(Math.max(p1[0], p2[0], p3[0])));
      const minY = Math.max(0, Math.floor(Math.min(p1[1], p2[1], p3[1])));
      const maxY = Math.min(H - 1, Math.ceil(Math.max(p1[1], p2[1], p3[1])));

      // 顶点深度
      const z1 = v1[2], z2 = v2[2], z3 = v3[2];

      for (let y = minY; y <= maxY; y++) {
        // 像素中心采样
        const py = y + 0.5;
        for (let x = minX; x <= maxX; x++) {
          const px = x + 0.5;

          // 重心权重（带符号，和为1）
          const w1 = edge(p2[0], p2[1], p3[0], p3[1], px, py) / area;
          const w2 = edge(p3[0], p3[1], p1[0], p1[1], px, py) / area;
          const w3 = edge(p1[0], p1[1], p2[0], p2[1], px, py) / area;

          // 点在三角形内（同号或包含边）
          if (w1 >= 0 && w2 >= 0 && w3 >= 0 || w1 <= 0 && w2 <= 0 && w3 <= 0) {
            // 插值深度
            const z = w1*z1 + w2*z2 + w3*z3;
            const zIdx = (y * W) + x;
            if (z > zBuffer[zIdx]) {
              zBuffer[zIdx] = z;

              // 法线：优先插值顶点法线，否则用面法线
              let n = nFace;
              if (n1 && n2 && n3) {
                const nx = w1*n1[0] + w2*n2[0] + w3*n3[0];
                const ny = w1*n1[1] + w2*n2[1] + w3*n3[1];
                const nz = w1*n1[2] + w2*n2[2] + w3*n3[2];
                const nl = Math.hypot(nx, ny, nz) || 1;
                n = [nx/nl, ny/nl, nz/nl];
              }

              // 漫反射 + 环境光
              const ndotl = Math.max(0, dot(n, lightDir));
              const brightness = AMBIENT + (1 - AMBIENT) * ndotl;
              const g = (255 * brightness) | 0;

              setPixel(x, y, g, g, g, 255);
            }
          }
        }
      }
    });

    // 提交像素
    ctx.putImageData(image, 0, 0);
  }, [fileContent, width, height]);
// ...existing code...
// ...existing code...

  return canvasRef;
};

export default useCanvas;