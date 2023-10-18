//  此处封装获取淘宝店铺  商品数量方法

import * as cheerio from 'cheerio'
import  {sendMessage, storeShops}  from './api'

// item ={shopName, shopUrl, shopType}
const wait = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const searchTB = async (item) => {
    await wait(5)
    const {shopName, shopUrl, shopType} = item
    // 1. 获得商品页数据
    // const headers = {
    //     Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    //     }
    let itemPage = await sendMessage({type: 'myfetch', url: shopUrl, config: { responseType: 'GBKHTML', method: 'GET'}})
    console.log("🚀 ~ file: getTb.js:17 ~ searchTB ~ itemPage:", itemPage)
    //出现滑块验证
   /* <script>sessionStorage.x5referer = window.location.href;
   window.location.replace("https://item.taobao.com//item.htm/_____tmd__2fSUem.htm&x5step=1");
   window._config_ = {"action":"captcha","url":"https://item.taobao.com//item.htm/_____tmd_____/punish?x5secdata=xcsjRKcjIZ46a2Y75ZUQiyC5JLo7UALgHzeJyMgCTDtszISWyftijBjCYHKvm1PffX6A3OuE%2b35dQ1BZd%2b0E%2bDHhnzITPNJ1exFa6A%2bGINTKQP5ORHZDN3DVW6%2fa0EVTRDXXbf4ZZNU96fo8fh1Qr5NlYNXap1DqGFqp8CYTa3O2SQpztDwkW2desc4shZ9dVc2BsSL1hQ%2fSUDv1l5orN2Hg%3d%3d__bx__item.taobao.com%2fitem.htm&x5step=1"};
   </script><!--rgv587_flag:sm-->

   */
  let slideData = itemPage.match(/(?<=window.location.replace\(").*(?="\);)/)
  if (slideData  != null) {
    let slideUrl = slideData[0]
    window.location.replace(slideUrl)
    return item
  }
  if(typeof itemPage === 'string'){  // 当淘宝检测频繁触发反爬,需要登录  会返回对象 包含h5url 而不是html页面

        const $ = cheerio.load(itemPage);
        // 如果出错,没有拿到数据
        let checkErr = $('title').text().includes('您查看的页面找不到了!')
        if(checkErr) {
            alert('请关闭页面重新打开,或者登录账号后重试!')
            throw new Error('请关闭页面重新打开,或者登录账号后重试!')
        }
        // 2. 如果拿到商品页面数据  获取店铺首页 搜索页的数据

        // 2.2 获取店铺首页 搜索页url       
        //  let shopUrl = window.g_config.idata.shop.url  只能使用字符串匹配   url :
        let shopUrl = itemPage.match(/(?<=url : ').*(?=\/')/) 
        shopUrl = shopUrl == null ? null : shopUrl[0]
        if(shopUrl === null ){ 
            
            console.log("🚀 ~ file: getTb.js:45 ~ searchTB ~ itemPage找不到店铺搜索页url:", itemPage)
            throw new Error('找不到店铺搜索页url')
        }
        const searchUrl = `https:${shopUrl}/search.htm`

        // 3.  获得搜索页结果后  
        await wait(3)
        let searchPage = await sendMessage({type: 'myfetch', url: searchUrl, config: { responseType: 'GBKHTML', method: 'GET',}})
        try {
            searchPage = JSON.parse(searchPage)
            
        } catch (error) {
            
        }
        if(typeof searchPage == 'object'){
            // throw new Error('请求过于频繁')
            // 需要过滑块的验证码
            if(searchPage.ret){
                console.log("🚀 ~ file: getTb.js:44 ~ searchTB ~ 请求过于频繁:",searchPage)
                let url = searchPage.data.url
                 console.log("🚀 ~ file: getTb.js:49 ~ searchTB ~ url:", url)
                 setTimeout(() => {
                    window.location.replace(url)
                  }, 2000);
                }
                if(searchPage.url) {
                    // 无法加载   过于频繁
                    setTimeout(() => {
                        window.location.replace(searchPage.url)
                      }, 2000);
                    //   if(searchPage.url.includes('login.taobao.com')){
                    //     //需要登录
                    //   }
                }
                //移除cookies
                // document.cookie = ''
                // localStorage.clear()
                // throw new Error('请求过于频繁')
                return item
        } 
        // 3.1   还需 获取 异步数据  "/i/asynSearch.htm?input_charset=gbk&mid=w-2790737131-0&wid=2790737131&path=/search.htm&amp;search=y"
        // 核心参数 mid=w-2790737131-0  从而得到商品数量数据
            const $2 = cheerio.load(searchPage);
        let asyncUrl = $2('#J_ShopAsynSearchURL').attr('value')
        asyncUrl = `https:${shopUrl}${asyncUrl}`
        // 4. 获取异步结果页

        await wait(3)
        let asyncPage = await sendMessage({type: 'myfetch', url: asyncUrl, config: { responseType: 'GBKJSON', method: 'GET'}})
         // 提取商品数字
        let strNum = asyncPage.match(/(?<=共搜索到<span>).*(?=<\/span>个符合条件的商品)/)
        strNum = strNum == null? null : strNum[0]
        if(strNum == null) return item
        let num = strNum.trim()
         item.num = num
            // html 有乱码
        // item.msg = '意外错误'
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
    



export default searchTB

