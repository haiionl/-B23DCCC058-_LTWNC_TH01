import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import "./style.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Không tìm thấy phần tử #app để khởi chạy ứng dụng.");
}

createRoot(rootElement).render(
  createElement(Provider, { store, children: createElement(App) }),
);
