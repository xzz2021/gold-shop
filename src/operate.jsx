

import $ from 'jquery'
import { useEffect } from 'react';
import falseRes from './test copy'
import searchTB from './getTb'
import searchTM from './getTm'
import { Storage, wait } from './api'
const OperateApp = () => {
    
    const goToBottomEase = async () =>  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'})

    // 一, 爬取所有店铺信息
    const getAllShops = async () => {
        await wait(2)
        await goToBottomEase()
        await wait(1)

        // 如果没有数据,重载页面
        let shopsArr = [] 
        let  eachDiv = $('.Content--content--sgSCZ12 .Content--contentInner--QVTcU0M > div')
        // if(eachDiv.length == 0 || !eachDiv) {  return  location.reload() }
        if(eachDiv.length == 0 || !eachDiv) {  return  shopsArr }

        let  skipItem = [ '天猫超市', '天天特卖工厂店', '苏宁易购官方旗舰店', "淘工厂官方店", "百亿补贴官方频道" ]

        // 获取 之前爬虫 已存储 的店铺数据
        const storedShops = await Storage.get('storedShops') || []
        
        eachDiv = eachDiv.slice(4,7)
        console.log("🚀 ~ file: operate.jsx:31 ~ getAllShops ~ eachDiv:", eachDiv)
        eachDiv.each(function(){
            //1. 获取店铺名
            const shopName = $(this).find('.ShopInfo--TextAndPic--yH0AZfx a').text()
            // 2. 去除指定的店铺  或者重复的
            if(skipItem.includes(shopName)) return
            // 3. 把新的的店铺名存档
            skipItem.push(shopName)
            
            // const tempDiv = $(this).find('.Card--doubleCardWrapper--L2XFE73')

            // 判断之前是否爬取过此店铺
            const storedShopsLength = storedShops.length
            if(storedShopsLength == 0){
                let tempUrl = $(this).find('.Card--doubleCardWrapper--L2XFE73').attr('href')
                // 5. 判断是否是淘宝店铺
                let shopType = ''
                if(tempUrl.includes('item.taobao.com')) {
                    // 如果是淘宝店
                    tempUrl = tempUrl.replace('#detail', '')
                    shopType = 'taobao'
                }else {
                    // 天猫店铺
                    shopType = 'tmall'

                }
                tempUrl = `https:${tempUrl}`
                let spm = $(this).find('.Card--doubleCardWrapper--L2XFE73 .MainPic--mainPicWrapper--iv9Yv90').attr('data-spm-anchor-id')
                let shopUrl = `${tempUrl}&spm=${spm}`
                shopsArr.push({shopName, shopUrl, shopType})
            }else{
                for(let i = 0; i< storedShopsLength; i++){
                    // 如果之前爬取过, 将此项直接 存入 shopsArr
                    if(shopName == storedShops[i].shopName){   
                        shopsArr.push(storedShops[i])
                        // toLast(storedShops, i)
                }else{
                    //  如果没有数据, 则属于首次爬取, 继续执行
                    // 4. 存档 店铺 url
            let tempUrl = $(this).find('.Card--doubleCardWrapper--L2XFE73').attr('href')

            // 5. 判断是否是淘宝店铺
            let shopType = ''
            if(tempUrl.includes('item.taobao.com')) {
                // 如果是淘宝店
                tempUrl = tempUrl.replace('#detail', '')
                shopType = 'taobao'
            }else {
                // 天猫店铺
                shopType = 'tmall'

            }
            tempUrl = `https:${tempUrl}`
            let spm = $(this).find('.Card--doubleCardWrapper--L2XFE73 .MainPic--mainPicWrapper--iv9Yv90').attr('data-spm-anchor-id')
            let shopUrl = `${tempUrl}&spm=${spm}`
            shopsArr.push({shopName, shopUrl, shopType})
                }
            }
        }
            
        })
        return shopsArr
    }


    // 二, 模拟访问店铺   拿到所有num
    const visitShopUrl = async () => {

        const shopsArr = await getAllShops()
        console.log("🚀 ~ file: operate.jsx:100 ~ visitShopUrl ~ shopsArr:", shopsArr)
        // 
        // let shopsArr = falseRes
        if(shopsArr.length == 0) return
        const newShopsArr = await Promise.all(
            shopsArr.map( async item => {
                // 如果num存在说明是之前爬取过的  所以直接掠过
                if(item.num) return item

                if(item.shopType == 'taobao'){
                    // 一. 获得商品页数据
                let tbItem =  await searchTB(item)
                return tbItem
        }else{
            //   如果是天猫店铺
            let tmItem =  await searchTM(item)
                return tmItem
        }
}))
console.log("🚀 ~ file: operate.jsx:120 ~ visitShopUrl ~ newShopsArr:", newShopsArr)

        return newShopsArr
        }


       // 三, 获取完整  数量  数据 之后, 重新遍历dom列表
       const forCycleDom = async () => {
        //  获取所有带num结果的 结果 数组
            const newShopsArr = await visitShopUrl()
            const  eachDiv = $('.Content--content--sgSCZ12 .Content--contentInner--QVTcU0M > div')
            eachDiv.each(async function(){
                let shopName = $(this).find('.ShopInfo--TextAndPic--yH0AZfx a').text()
                await Promise.all(
                    newShopsArr.map( async item => {
                        if(item.shopName == shopName && item.num < 1000 ){
                            // 边框高亮
                            $(this).css({'style': 'border: 2px solid red; position: relative'})
                            let dom = `
                            <div style="
                                background: #ffffff;
                                position: absolute;
                                bottom: 45px;
                                right: 10px;
                                color: red;
                            ">店铺商品总数:${item.num}</div>`
                            $(this).find('.ShopInfo--shopInfo--ORFs6rK ').after(dom)
                        }
                    })
                    )

            })
            displaySto()

       }

       const  displaySto = async () => {
        await wait(30)
        const storedShops = await Storage.get('storedShops') || []
        console.log("🚀 ~ file: operate.jsx:159 ~ useEffect ~ storedShops:", storedShops)
       }
    useEffect(()=>{
        
        // if(location.search == '' || location.host == 'error.taobao.com') return
        if(location.host == 's.taobao.com') {
            // getAllShops()
            // filterShops()
            // visitShopUrl()
            // displaySto()
            // forCycleDom()
            // Storage.remove('storedShops')
        }
    }, [])


}


export default OperateApp