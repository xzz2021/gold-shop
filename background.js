


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


 //
 const clearCookie = () => {
 chrome.cookies.getAll(
     {domain: ".taobao.com"},
     cookies => {
         cookies.forEach(item => {
          chrome.cookies.remove(
            { name: item.name, url: 'https://*.taobao.com'},
            item2 => {
              console.log("🚀 ~ file: operate.jsx:169 ~ useEffect ~ item2: ", item2)
          }
            
          )
         });
         
     }
   )
    }



  chrome.cookies.getAll(
    {domain: ".taobao.com"},
    cookies => {
        console.log("🚀 ~ file: operate.jsx:169 ~ useEffect ~ cookies:4444", cookies)
        
    }
  )