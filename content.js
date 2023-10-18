

import { injectFile } from './src/api'
import './src/style.css'

injectFile()

import './src/index'
  // 开发模式时  的  自动刷新
  if(DEBUG){   // 开发模式时为真   //   生产模式为假
    const { createWsConnect } = require('ws-reload-plugin')
    createWsConnect({})
  }

 