import React, { useEffect, useState } from "react";

import OperateApp from "./operate"
import  {sendMessage, Storage, storeShops, wait}  from './api'

function App() {
  // $('#App').
  const [inputValue, setInputValue ] = useState('')
  const [itemsValue, setItemsValue ] = useState('')

  useEffect(()=> {
    let currentValue = localStorage.getItem('itemsValue') || ''
    setItemsValue(currentValue)

  },[])
  const confirm = async() => {
    const headers = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      }
      // let searchUrl = 'https://shop136753256.taobao.com/search.htm?spm=2013.1.0.0.65724178D8Pq3j&search=y'
      let searchUrl = 'https://shop136753256.taobao.com/search.htm'
    let searchPage = await sendMessage({type: 'myfetch', url: searchUrl, config: { responseType: 'GBKHTML', method: 'GET',headers}})
    console.log("🚀 ~ file: app.jsx:17 ~ confirm ~ searchPage:", searchPage)


    return
    localStorage.setItem('itemsValue', inputValue)
    setItemsValue(inputValue)
    setInputValue('')
  }
  const onInputChange = (e) => {
    let vv = e.target.value
    vv = vv.replace(/[^0-9]/ig,"")
    let numValue = Number(vv)
    if(numValue < 3 || numValue > 20) {
       alert('输入数字必须大于3小于20')
      setInputValue('') 
       
    }else{
      setInputValue(numValue) 
    }
  }
  return (
    <div className="App">
      <h3>当前设定的商品数:  { itemsValue }</h3>
        <div>
        <input type="text" style={ {margin: '10px 0'}} value={ inputValue } onChange={ (e)=> {onInputChange(e)} }/>
        </div>
        <div className="xzzBtn">
            <button onClick={ confirm }>确定</button>
        </div>
        <OperateApp />
    </div>
  );
}
export default App;