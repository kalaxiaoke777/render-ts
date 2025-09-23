// ...existing code...
type Vertex = [number, number, number];
type TexCoord = [number, number, number?];
type Normal = [number, number, number];

interface Face {
  v: number[]; // 顶点索引（0-based）
  vt?: number[]; // 纹理索引（0-based）
  vn?: number[]; // 法线索引（0-based）
}

interface ParseResult {
  v: Vertex[];
  vt: TexCoord[];
  vn: Normal[];
  f: Face[];
  rawLines: number; // 行数统计
}

class Obj {
  v: Vertex[] = [];
  vt: TexCoord[] = [];
  vn: Normal[] = [];
  f: Face[] = [];
  rawLines = 0;

  constructor(txt: string) {
    const parsed = this.readObjTxt(txt);
    this.v = parsed.v;
    this.vt = parsed.vt;
    this.vn = parsed.vn;
    this.f = parsed.f;
    this.rawLines = parsed.rawLines;
  }

  private readObjTxt(txt: string): ParseResult {
    const v: Vertex[] = [];
    const vt: TexCoord[] = [];
    const vn: Normal[] = [];
    const f: Face[] = [];
    let rawLines = 0;

    const lines = txt.split(/\r?\n/);
    rawLines = lines.length;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const parts = trimmed.split(/\s+/);
      const head = parts[0];

      switch (head) {
        case "v": {
          if (parts.length >= 4) {
            const x = Number(parts[1]);
            const y = Number(parts[2]);
            const z = Number(parts[3]);
            v.push([x, y, z]);
          }
          break;
        }
        case "vt": {
          // 可能 2 或 3 个值
          const u = Number(parts[1]);
          const vv = Number(parts[2]);
          const w = parts[3] !== undefined ? Number(parts[3]) : undefined;
          vt.push(w !== undefined ? [u, vv, w] : [u, vv]);
          break;
        }
        case "vn": {
          if (parts.length >= 4) {
            vn.push([Number(parts[1]), Number(parts[2]), Number(parts[3])]);
          }
          break;
        }
        case "f": {
          // 面：f v1 v2 v3 ...
          const faceTokens = parts.slice(1);
          const face: Face = { v: [], vt: [], vn: [] };
          faceTokens.forEach((token) => {
            const seg = this.parseFaceToken(token);
            face.v.push(seg.v);
            if (seg.vt !== undefined) face.vt!.push(seg.vt);
            if (seg.vn !== undefined) face.vn!.push(seg.vn);
          });
          if (!face.vt!.length) delete face.vt;
          if (!face.vn!.length) delete face.vn;
          f.push(face);
          break;
        }
        default:
          // 其他关键词暂不处理（o g usemtl mtllib s 等）
          break;
      }
    }

    return { v, vt, vn, f, rawLines };
  }

  private parseFaceToken(token: string): {
    v: number;
    vt?: number;
    vn?: number;
  } {
    // 支持: v / v/vt / v//vn / v/vt/vn
    const [vStr, vtStr, vnStr] = token.split("/");
    const toIdx = (s?: string) =>
      s && s.length > 0 ? Number(s) - 1 : undefined; // OBJ 索引从 1 开始，转 0-based
    const v = toIdx(vStr);
    if (v === undefined || isNaN(v))
      throw new Error("非法 face 顶点索引: " + token);
    const vt = toIdx(vtStr);
    const vn = toIdx(vnStr);
    return { v, vt, vn };
  }

  // 简单导出为你的渲染数据格式（可按需修改）
  toBuffers() {
    return {
      positions: this.v.flat(),
      normals: this.vn.flat(),
      uvs: this.vt.flat(),
      faces: this.f.map((face) => face.v),
    };
  }
}

export default Obj;
// ...existing code...
