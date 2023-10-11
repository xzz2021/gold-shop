import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx";

const body = document.querySelector('body')
body.insertAdjacentHTML('afterbegin',`<div id="injectReact"></div>`)

const rootElement = document.getElementById("injectReact");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);