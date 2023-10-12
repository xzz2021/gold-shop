

import $ from 'jquery'
import { useEffect, useState } from 'react';
const OperateApp = () => {
    
    const goToBottomEase = async () =>  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'})
    const wait = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));


    // 一, 爬取所有店铺信息
    const getAllShops = async () => {
        await goToBottomEase()
        await wait(1)
        let shopsArr = [] 
        let skipItem = [ '天猫超市', '天天特卖工厂店' ]
        const  eachDiv = $('.Content--content--sgSCZ12 .Content--contentInner--QVTcU0M div')
        eachDiv.each(function(){
            //1. 获取店铺名
            let shopName = $(this).find('.ShopInfo--TextAndPic--yH0AZfx a').text()
            // 2. 去除指定的店铺  或者重复的
            if(skipItem.includes(shopName)) return
            // 3. 把已有的店铺名存档
            skipItem.push(shopName)
            // 4. 存档 店铺名 及url
            let shopUrl = $(this).find('.Card--doubleCardWrapper--L2XFE73').attr('href')
            shopsArr.push({shopName, shopUrl: `https:${shopUrl}`})
        })
        // shopsArr = [...new Set(shopsArr)]
        console.log("🚀 ~ file: operate.jsx:31 ~ getAllShops ~ shopsArr:", shopsArr)
        return shopsArr
    }
    // 二, 过滤店铺
    const filterShops = async () => {
        // 获得所有过滤后的店铺信息
       let allShops =  await getAllShops()
       console.log("🚀 ~ file: operate.jsx:28 ~ filterShops ~ allShops:", allShops)
       return allShops

    }

    // 三, 模拟访问店铺
    const visitShopUrl = async () => {
        // const allShops = await getAllShops()
        // let testUrl = allShops[0].shopUrl
        let testUrl = "//item.taobao.com/item.htm?id=670106893826&ns=1&abbucket=12#detail"
        testUrl = `https:${testUrl}`
        console.log("🚀 ~ file: operate.jsx:44 ~ visitShopUrl ~ testUrl:", testUrl)
        fetch(testUrl, { redirect: 'follow' }).then(async res => {
            console.log("🚀 ~ file: operate.jsx:48 ~ fetch ~ res:", res)
            
            return res.text()
        }).then(res => {
            console.log("🚀 ~ file: operate.jsx:48 ~ fetch ~ res:", res)
            
        })
    }


    useEffect(()=>{

        // getAllShops()
        // filterShops()
        visitShopUrl()
    }, [])


    // 1. 获取去重后的店铺信息(名称,shopid, 参数)
    // 2. 根据店铺信息获取商品数量(类型区别: 淘宝/天猫 )


}


export default OperateApp