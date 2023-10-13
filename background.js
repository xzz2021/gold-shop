


import myfetch from './src/myfetch'

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      const { type, url, config } = message
      if(type === 'myfetch') {
      (async () => {
        let res =  await myfetch(url, config)
        sendResponse(res)})()
         return true
    }
})

if(DEBUG){   // 开发模式时为真   //   生产模式为假
    const { bgdListenMsg } = require('ws-reload-plugin')
     bgdListenMsg()
 }

