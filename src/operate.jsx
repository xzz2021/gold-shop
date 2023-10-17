

import $ from 'jquery'
import { useEffect, useState } from 'react';
import falseRes from './test copy'
import searchTB from './getTb'
import searchTM from './getTm'
// import falseRes2 from './test copy 2'
const OperateApp = () => {
    
    const goToBottomEase = async () =>  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'})
    // 异步等待
    const wait = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    //将指定项转移到最后一项,返回指定向的value index不能为0
    const toLast =  (arr, index) =>  {
        if(index == 0) {
            arr.push(arr.shift())
        }else{
            arr.push(arr.splice(index , 1)[0])
        }
    }

    // 一, 爬取所有店铺信息
    const getAllShops = async () => {
        await wait(2)
        await goToBottomEase()
        await wait(1)

        // 如果没有数据,重载页面
        let shopsArr = [] 
        const  eachDiv = $('.Content--content--sgSCZ12 .Content--contentInner--QVTcU0M > div')
        // if(eachDiv.length == 0 || !eachDiv) {  return  location.reload() }
        if(eachDiv.length == 0 || !eachDiv) {  return  shopsArr }

        let  skipItem = [ '天猫超市', '天天特卖工厂店', '苏宁易购官方旗舰店', "淘工厂官方店", "百亿补贴官方频道" ]
        // skipItem1 = skipItem1.map(item => {return {shopName: item}})


        // 获取 之前爬虫 已存储 的店铺数据
        const storedShops = await Storage.get('storedShops') || []
        
        eachDiv.each(function(){
            //1. 获取店铺名
            let shopName = $(this).find('.ShopInfo--TextAndPic--yH0AZfx a').text()
            // 2. 去除指定的店铺  或者重复的
            if(skipItem.includes(shopName)) return
            // 3. 把新的的店铺名存档
            skipItem.push(shopName)

            // 判断之前是否爬取过此店铺
            let storedShopsLength = storedShops.length
            if(storedShopsLength > 1) { 
                for(let i = 0; i< storedShopsLength; i++){
                    // 如果之前爬取过, 将此项转移到数组最后
                    if(shopName == storedShops[i].shopName){   
                        shopsArr.push(storedShops[i])
                        // toLast(storedShops, i)
                }
            }
        }
            // 4. 存档 店铺 url
            const tempUrl = $(this).find('.Card--doubleCardWrapper--L2XFE73').attr('href')

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
            let shopUrl = `${tempUrl}&spm=${spm}`
            shopsArr.push({shopName, shopUrl, shopType})
        })

        // 爬取列完列表  最后存储新的顺序  storage  也就是将当前爬取过的店铺信息  放到storage数组最后
        await Storage.set({storedShops})
        return shopsArr
    }


    // 三, 模拟访问店铺
    const visitShopUrl = async () => {

        // const allShops = await getAllShops()
        // 
        let allShops = falseRes
        if(allShops.length == 0) return
        const newAllShops = await Promise.all(
            allShops.map( async item => {
                // 如果num存在说明是之前爬取过的  所以直接掠过
                if(item.num) return item
                if(item.shopType == 'taobao'){
                    // window.open(item.shopUrl)
                    // 一. 获得商品页数据
                let tbItem =  await searchTB(item)
                return tbItem
        }else{
            //   如果是天猫店铺
            let tmItem =  await searchTM(item)
                return tmItem
        }
}))
        return newAllShops
        }


       // 四, 获取完整  数量  数据 之后, 重新遍历dom列表
       const forCycleDom = async () => {
        //  获取所有带num结果的 结果 数组
            const newAllShops = await visitShopUrl()
            const  eachDiv = $('.Content--content--sgSCZ12 .Content--contentInner--QVTcU0M > div')
            eachDiv.each(async function(){
                let shopName = $(this).find('.ShopInfo--TextAndPic--yH0AZfx a').text()
                await Promise.all(
                    newAllShops.map( async (item) => {
                        if(item.shopName == shopName){
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


       }
    useEffect(()=>{
        // if(location.search == '' || location.host == 'error.taobao.com') return
        if(location.host == 's.taobao.com') {
            // getAllShops()
            // filterShops()
            visitShopUrl()
            // virtualVisit()
        }
    }, [])


    // 1. 获取去重后的店铺信息(名称,shopid, 参数)
    // 2. 根据店铺信息获取商品数量(类型区别: 淘宝/天猫 )


}


export default OperateApp