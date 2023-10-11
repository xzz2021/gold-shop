import React, { useEffect, useState } from "react";

function App() {
  // $('#App').
  const [inputValue, setInputValue ] = useState('')
  const [itemsValue, setItemsValue ] = useState('')

  useEffect(()=> {
    let currentValue = localStorage.getItem('itemsValue') || ''
    setItemsValue(currentValue)

  },[])
  const confirm = () => {
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
        
    </div>
  );
}
export default App;