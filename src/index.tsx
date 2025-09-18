import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
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
      <Route path="/" element={<App />}>
        <Route path="webgl" element={<WebGL />}></Route>
        <Route path="webgpu" element={<WebGPU />}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
