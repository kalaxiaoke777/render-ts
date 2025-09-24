import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import View from "@/pages/view";
import WebGL from "@/pages/webGL";
import WebGPU from "@/pages/webGPU";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<View />}>
        <Route index element={<div>欢迎来到首页</div>} />
        <Route path="webgl" element={<WebGL />} />
        <Route path="webgpu" element={<WebGPU />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
