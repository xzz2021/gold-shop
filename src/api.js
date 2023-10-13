
const sendMessage =  (message) => {
    return new Promise((resolve, reject) => {
        if(message.type == undefined) return reject('发送的请求消息类型不合法')
        chrome.runtime.sendMessage( message, (response) => {
            response? resolve(response): resolve('异常中断')

          })
    })
}
export default sendMessage





