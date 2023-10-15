

import $ from 'jquery'
import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio'
import  sendMessage  from './api'
import falseRes from './test copy'
import searchTB from './getTb'
// import falseRes2 from './test copy 2'
const OperateApp = () => {
    
    const goToBottomEase = async () =>  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'})
    const wait = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));


    // 一, 爬取所有店铺信息
    const getAllShops = async () => {
        await wait(2)
        await goToBottomEase()
        await wait(1)
        let shopsArr = [] 
        let skipItem = [ '天猫超市', '天天特卖工厂店', '苏宁易购官方旗舰店', "淘工厂官方店", "百亿补贴官方频道" ]
        const  eachDiv = $('.Content--content--sgSCZ12 .Content--contentInner--QVTcU0M > div')
        if(eachDiv.length == 0 || !eachDiv) return shopsArr
        eachDiv.each(function(){
            //1. 获取店铺名
            let shopName = $(this).find('.ShopInfo--TextAndPic--yH0AZfx a').text()
            // 2. 去除指定的店铺  或者重复的
            if(skipItem.includes(shopName)) return
            // 3. 把已有的店铺名存档
            skipItem.push(shopName)
            // 4. 存档 店铺名 及url
            const tempDiv = $(this).find('.Card--doubleCardWrapper--L2XFE73')
            // if(tempDiv === undefined) return
            let tempUrl = tempDiv.attr('href')
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
            let spm = tempDiv.find('.MainPic--mainPicWrapper--iv9Yv90').attr('data-spm-anchor-id')
            // console.log("🚀 ~ file: operate.jsx:42 ~ eachDiv.each ~ tempDiv:", tempDiv)
            // if(spm === undefined) { spm = }
            let shopUrl = `${tempUrl}&spm=${spm}`
            shopsArr.push({shopName, shopUrl, shopType})
        })
            console.log("🚀 ~ file: operate.jsx:47 ~ eachDiv.each ~ shopsArr:", shopsArr)
            return shopsArr
    }


    // 三, 模拟访问店铺
    const visitShopUrl = async () => {

        // const allShops = await getAllShops()
        // if(allShops.length == 0) return
        let allShops = falseRes
        const newAllShops = await Promise.all(
            allShops.map( async item => {
                if(item.shopType == 'taobao'){
                    // window.open(item.shopUrl)
                    // 一. 获得商品页数据
                let newItem =  await searchTB(item)
                return newItem
        }else{
            return item
        }
}))
        
            console.log("🚀 ~ file: operate.jsx:83 ~ visitShopUrl ~ newAllShops:", newAllShops)


        }


        // 2. 如果是天猫店铺

        // let res = await sendMessage({type: 'myfetch', config: {url: testUrl, responseType: 'TEXT'}})
        // console.log("🚀 ~ file: operate.jsx:52 ~ visitShopUrl ~ res:", res)
        // return 
        // const $ = cheerio.load(falseRes);
        // let checkErr = $('title').text().includes('您查看的页面找不到了!')
        // if(checkErr) return alert('请登录账号后重试!')
        // console.log("🚀 ~ file: operate.jsx:56 ~ visitShopUrl ~ checkErr:", checkErr)



        // const virtualVisit = async()=>{
        //     let shopUrl = 'https://item.taobao.com/item.htm?id=672002374556&ns=1&abbucket=6&spm=a21n57.1.0.i3.4bff523cTNRfaU'
        //     let itemPage = await sendMessage({type: 'myfetch', url: shopUrl, config: { responseType: 'GBKHTML', method: 'GET', headers: { 'Referer': 'https://s.taobao.com/'}}})
        //     console.log("🚀 ~ file: operate.jsx:103 ~ visuialVisit ~ itemPage:", itemPage)
        // }
    useEffect(()=>{
        if(!(location.host == 's.taobao.com')) return
        // getAllShops()
        // filterShops()
        visitShopUrl()
        // virtualVisit()
    }, [])


    // 1. 获取去重后的店铺信息(名称,shopid, 参数)
    // 2. 根据店铺信息获取商品数量(类型区别: 淘宝/天猫 )


}


export default OperateApp