//  此处封装获取淘宝店铺  商品数量方法

import * as cheerio from 'cheerio'
import  sendMessage  from './api'

// item ={shopName, shopUrl, shopType}
const wait = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const searchTB = async (item) => {
    wait(2)
    const {shopName, shopUrl, shopType} = item
    // 2. 获得商品页数据
    const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        }
    let itemPage = await sendMessage({type: 'myfetch', url: shopUrl, config: { responseType: 'GBKHTML', method: 'GET', headers,}})
    console.log("🚀 ~ file: getTb.js:14 ~ searchTB ~ itemPage:", itemPage)
    if(typeof itemPage === 'string'){  // 当淘宝检测频繁触发反爬,需要登录  会返回对象 包含h5url 而不是html页面
        const $ = cheerio.load(itemPage);
        // 如果出错,没有拿到数据
        let checkErr = $('title').text().includes('您查看的页面找不到了!')
        if(checkErr) {
            alert('请关闭页面重新打开,或者登录账号后重试!')
            item.num = 0
            return item
        }
        // 如果拿到商品页面数据
        let shopUrl = $('.popup-inner ul > li > h4 > a').attr('href');
        console.log("🚀 ~ file: getTb.js:26 ~ searchTB ~ shopUrl:", shopUrl)
        shopUrl = `https:${shopUrl}`
        // 提取店铺 host
        let shopHost = shopUrl.replace('search.htm?search=y','')
        // 3. 通过商品页获得含有商品数量的店铺页数据
        wait(1)
        let shopPage = await sendMessage({type: 'myfetch', url: shopUrl, config: { responseType: 'GBKHTML', method: 'GET',}})
        
        const $2 = cheerio.load(shopPage);
    let searchParams = $2('#bd >layout>.col-main>.main-wrap> .J_TModule> .skin-box input').attr('value')
    let searchUrl = shopHost + searchParams
    wait(1)
    let numPage = await sendMessage({type: 'myfetch', url: searchUrl, config: { responseType: 'GBKHTML', method: 'GET',}})
    console.log("🚀 ~ file: getTb.js:28 ~ getTB ~ numPage:", numPage)
    item.num = 0
    return item
    }
    if(itemPage.ret){ 
        item.msg = '哎哟喂,被挤爆啦,请稍后重试'
        return item
    }
    if(itemPage.dialogSize){ 
        item.msg = '需要登录'
        return item
    }
    item.msg = '意外错误'
    return item
}

export default searchTB