//  此处封装获取淘宝店铺  商品数量方法

import * as cheerio from 'cheerio'
import  {sendMessage, Storage, storeShops, wait}  from './api'

// item ={shopName, shopUrl, shopType}

const searchTM = async (item) => {
    await wait(5)
    const {shopName, shopUrl, shopType} = item
    // 1. 获得商品页数据
    const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        }
    let itemPage = await sendMessage({type: 'myfetch', url: shopUrl, config: { responseType: 'GBKHTML', method: 'GET', headers}})
    // console.log("🚀 ~ file: getTm.js:17 ~ searchTM ~ itemPage:", itemPage)
    if(typeof itemPage === 'string'){ 
    // at_autype=4%5f67870070&
    let shopId = itemPage.match(/(?<=at_autype=4%5f).*(?=&aplus)/)
    shopId = shopId == null ? null : shopId[0]
    if(shopId == null) return item
    let shopHost = `https://shop${shopId}.taobao.com/`
    // 获得搜索页 url
    let searchUrl = `${shopHost}search.htm`
    // 3.  获得搜索页   url 

    await wait(5)
    let searchPage = await sendMessage({type: 'myfetch', url: searchUrl, config: { responseType: 'GBKHTML', method: 'GET',}})
    console.log("🚀 ~ file: getTm.js:29 ~ searchTM ~ searchPage:22222222222",)
    // console.log("🚀 ~ file: getTm.js:29 ~ searchTM ~ searchPage:", searchPage)
    if(searchPage.ret){ 
        console.log("🚀 ~ file: getTb.js:44 ~ searchTB ~ 请求过于频繁:",searchPage)
        let url = searchPage?.data?.url
          url  &&  window.location.replace(url)

        
    }
    if(searchPage.url) {
        // 无法加载   过于频繁
            window.location.replace(searchPage.url)
        //   if(searchPage.url.includes('login.taobao.com')){
        //     //需要登录
        //   }
    }
    
    //  天猫店铺必须将shop133235转换成实际店铺url  <meta property="og:url" content="https://carany.tmall.com/">
    let tmHost = searchPage.match(/(?<=<meta property="og:url" content=").*(?=">)/)
    tmHost = tmHost == null ? null : tmHost[0]
    if(tmHost == null) return item

    // <input id="J_ShopAsynSearchURL" type="hidden" value="/i/asynSearch.htm?mid=w-19014068001-0&wid=19014068001&path=/search.htm&amp;search=y" />
    let asyncUrl = searchPage.match(/(?<=value="\/).*(?=&wid=)/)
    asyncUrl = asyncUrl == null ? null : asyncUrl[0]
    if(asyncUrl == null) return item
    //获得搜索页   异步加载结果  的 url
    asyncUrl = tmHost + asyncUrl
     // 4. 获取异步结果页

     await wait(5)
     let asyncPage = await sendMessage({type: 'myfetch', url: asyncUrl, config: { responseType: 'GBKJSON', method: 'GET'}})
     console.log("🚀 ~ file: getTm.js:52 ~ searchTM ~ asyncPage:3333333333")

    const num = asyncPage.match(/(?<=<dl class=)(?=\\"item \\")/g).length
    item.num = num
    if(num){
        //  如果能走到这里,说明拿到了店铺数据, 存入storage
        await storeShops(item)
    }
    return item
    }else if (typeof itemPage === 'object') {
    if(itemPage.ret){ 
        alert('请求过于频繁,请过几分钟重试: 哎哟喂,被挤爆啦,请稍后重试')
        throw new Error('请求过于频繁')
    }
    if(itemPage.dialogSize){ 
        alert('需要登录')
        throw new Error('需要登录')
    }

    }else{
        alert('意外错误')
        throw new Error('意外错误')
    }
}
    



export default searchTM

