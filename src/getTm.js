//  此处封装获取淘宝店铺  商品数量方法

import * as cheerio from 'cheerio'
import  {sendMessage}  from './api'

// item ={shopName, shopUrl, shopType}
const wait = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const searchTM = async (item) => {
    wait(2)
    const {shopName, shopUrl, shopType} = item
    // 1. 获得商品页数据
    const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        }
    let itemPage = await sendMessage({type: 'myfetch', url: shopUrl, config: { responseType: 'GBKHTML', method: 'GET', headers}})
    // console.log("🚀 ~ file: getTm.js:17 ~ searchTM ~ itemPage:", itemPage)
    if(typeof itemPage === 'string'){ 
    // at_autype=4%5f67870070&
    let shopId = itemPage.match(/(?<=at_autype=4%5f).*(?=&aplus)/)[0]
    let shopHost = `https://shop${shopId}.taobao.com/`
    // 获得搜索页 url
    let searchUrl = `${shopHost}search.htm`
    // 3.  获得搜索页   url 

    
    wait(1)
    let searchPage = await sendMessage({type: 'myfetch', url: searchUrl, config: { responseType: 'GBKHTML', method: 'GET',}})
    if(searchPage.ret){ 
        alert('请求过于频繁,请过几分钟重试: 哎哟喂,被挤爆啦,请稍后重试')
        throw new Error('请求过于频繁')
    }
    if(searchPage.dialogSize){ 
        alert('需要登录')
        throw new Error('需要登录')
    }

    //  天猫店铺必须将shop133235转换成  <meta property="og:url" content="https://carany.tmall.com/">
    let tmHost = searchPage.match(/(?<=<meta property="og:url" content=").*(?=">)/)[0]
    // <input id="J_ShopAsynSearchURL" type="hidden" value="/i/asynSearch.htm?mid=w-19014068001-0&wid=19014068001&path=/search.htm&amp;search=y" />
    let asyncUrl = searchPage.match(/(?<=value="\/).*(?=&wid=)/)[0]
    // console.log("🚀 ~ file: getTm.js:33 ~ searchTM ~ asyncUrl:", asyncUrl)
    //获得搜索页   异步加载结果  的 url
    //  i/asynSearch.htm?mid=w-14205850773-0
    asyncUrl = tmHost + asyncUrl
    // console.log("🚀 ~ file: getTm.js:35 ~ searchTM ~ asyncUrl:", asyncUrl)
     // 4. 获取异步结果页
     wait(5)
     let asyncPage = await sendMessage({type: 'myfetch', url: asyncUrl, config: { responseType: 'GBKJSON', method: 'GET'}})
     // 移除编码反义问题
    //  asyncPage = asyncPage.replace('\"', '"')
    //  console.log("🚀 ~ file: getTm.js:43 ~ searchTM ~ asyncPage:", asyncPage)
    // const $ = cheerio.load(asyncPage);
    //  let itemDiv = $('.skin-box-bd .J_TItems .items')
    //  console.log("🚀 ~ file: getTm.js:47 ~ searchTM ~ itemDiv:", itemDiv)
    //  let num = itemDiv.length
    const num = asyncPage.match(/(?<=<dl class=)(?=\\"item \\")/g).length
    //  console.log("🚀 ~ file: getTm.js:47 ~ searchTM ~ num:", num)
    item.num = num
    if(num){
        //  如果能走到这里,说明拿到了店铺数据, 存入storage
        const storedShops = await Storage.get('storedShops') || []
        storedShops.push(item)
        await Storage.set({storedShops})
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

