
// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./src/app.jsx";

// const body = document.querySelector('body')
// body.insertAdjacentHTML('afterbegin',`<div id="injectReact"></div>`)

// const rootElement = document.getElementById("injectReact");
// const root = createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import './src/index'
import './src/style.css'



  // 开发模式时  的  自动刷新
  if(DEBUG){   // 开发模式时为真   //   生产模式为假
    const { createWsConnect } = require('ws-reload-plugin')
    createWsConnect({})
  }