
const sendMessage =  (message) => {
    return new Promise((resolve, reject) => {
        if(message.type == undefined) return reject('发送的请求消息类型不合法')
        chrome.runtime.sendMessage( message, (response) => {
            response? resolve(response): resolve('异常中断')

          })
    })
}



const Storage = {
    // 可以直接存储和获取js数据obj等

    set(obj){
        return new Promise( (resolve, reject) => {
        if(Object.prototype.toString.call(obj) !== '[object Object]' && JSON.stringify(obj) === '{}'){
            resolve('设定失败:参数必须是object且不能为空')
        }else{
            let tip = '77'
            let l = 0
            for(const key in obj) {
                l ++
                if(obj[key] == undefined) return tip = `${key}设定成功失败,值不能为undefined`
                chrome.storage.local.set({[key]: obj[key]}, ()=> {
                    tip = ` ${l}:${key}设定成功,值为${JSON.stringify(obj[key])}`
                    if(key == 'taskData') return 
                    console.log("🚀 chrome.storage.local.set ~ :", tip)
                })
            }
            resolve(tip)
        }
    })
    },

    get(strORarr){
        return new Promise((resolve, reject) => {
        if(strORarr.length < 1 || strORarr == '' || strORarr == ['']){
           resolve('获取失败:参数必须是字符串或者数组,且不能为空')
        }
            if(typeof strORarr == 'string'){
                chrome.storage.local.get([strORarr], (res)=> {
                    let r = res[strORarr] || ''
                        resolve(r)
                  })
            }else {
                let obj = {}
                for(const val of strORarr) {
                    chrome.storage.local.get([val], (res)=> {
                            obj[val] = res[val] || ''
                      })
                }
                resolve(obj)
            }
        })
    },
    remove(strORarr){
        if(strORarr.length > 0){
            chrome.storage.local.remove(strORarr)
        }else{
            console.log('移除失败:参数必须是字符串或者数组,且不能为空')
        }
    },
    clear(){
        chrome.storage.local.clear()
    }



}

class myCookies  {
    get(){
        let cookies = document.cookie
        let arr = cookies.split('; ')
        let cookieToObj = {}
        arr.forEach(item => {
            let arr2 = item.split('=')
            cookieToObj = {...cookieToObj, ...{[arr2[0]]:arr2[1] }} 
        })
        return cookieToObj
    }
    removeAll(){
        let cookieToObj = this.get()
        cookieToObj.keys.forEach(key => {

        })
        
    }
}



const  injectFile = () => {
    //----参考------https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions/9517879#9517879
        const s = document.createElement('script')
        s.src = chrome.runtime.getURL('/inject.js')
        s.onload = function() {
            this.remove()
        };//--<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------此处分号不可去掉--------应该是立即执行函数必须以分号分隔------
        (document.head || document.documentElement).appendChild(s) // ------document.documentElement----指向html标签

}


    //  存储列表
    const storeShops = async (item) => {
            //  如果能走到这里,说明拿到了店铺数据, 存入storage
            const storedShops = await Storage.get('storedShops') || []
            await Promise.all(
                storedShops.map(async item2 => {
                    if(item2.shopName === item.shopName) return
                    storedShops.push(item)
                    await Storage.set({storedShops})
                })
            
            )
        }

export  { sendMessage, Storage, injectFile, storeShops }





