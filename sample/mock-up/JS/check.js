// import { test01 } from "./test01.js"
// const test = new test01
// test.check()


let basket = [
    ["商品名No.1", 3, 50]
]
let basketList = document.getElementsByClassName("basketlist")[0]
let total = 0
let fee = 0
for(let i=0; i<basket.length; i++){
    let com_name = basket[i][0]
    let com_quantity = basket[i][1]
    let com_fee = basket[i][2]
    total += com_quantity
    fee += com_quantity * com_fee
    // 親
    let li = document.createElement("li")
    li.className = "line"
    // 子要素０
    let num = document.createElement("i")
    num.textContent = i + 1
    num.className = "num"
    // 子要素１
    let img = document.createElement("img")
    img.className = "img"
    // 子要素２
    let divName = document.createElement("div")
    divName.className = "name"
    let comName = document.createElement("p")
    comName.className = "com_name"
    comName.textContent = com_name
    // コントロール
    let control = document.createElement("div")
    control.className = "control"
    let select = document.createElement("select")
    select.name = "quantity"
    select.id = `count_${i}`
    select.className = "count_select"
    select.addEventListener("change", (e)=>{
        let countFee = document.getElementsByClassName("count_fee")
        countFee[e.target.id.slice(6)].textContent = `¥${e.target.value * basket[e.target.id.slice(6)][2]}`
        basket[e.target.id.slice(6)][1] = e.value
        let totalCom = document.getElementsByClassName("total_com")[0]
        total = 0
        let select = document.getElementsByClassName("count_select")
        for (let i = 0; i < select.length; i++){
            total += Number(select[i].value)
        }
        totalCom.textContent = `商品${total}点 合計`
        let totalFee = document.getElementsByClassName("total_fee")[0]
        fee = 0
        for(let i = 0; i < countFee.length; i++){
            fee += Number(String(countFee[i].textContent).slice(1))
        }
        totalFee.textContent = `¥${fee}`
    })
    for(let i=1; i<11; i++){
        let option = document.createElement("option")
        if (i != 10){
            option.value = i
            option.textContent = i  
        }else{
            option.value = "over"
            option.textContent = "+10"
        }
        select.appendChild(option)
    }
    select.options[com_quantity - 1].selected = true
    // オーバー
    let over = document.createElement("div")
    over.className = "over"
    let input = document.createElement("input")
    input.type = "number"
    input.value = 10
    let overBnt = document.createElement("button")
    overBnt.textContent = "更新"
    over.appendChild(input)
    over.appendChild(overBnt)
    // 削除
    let del = document.createElement("p")
    del.className = "delet"
    del.textContent = "削除"
    control.appendChild(select)
    control.appendChild(over)
    control.appendChild(del)
    divName.appendChild(comName)
    divName.appendChild(control)
    // 子要素３
    let divCount = document.createElement("div")
    divCount.className = "count"
    let countFee = document.createElement("p")
    countFee.className = "count_fee"
    countFee.textContent = `¥${com_quantity * com_fee}`
    divCount.appendChild(countFee)
    li.appendChild(num)
    li.appendChild(img)
    li.appendChild(divName)
    li.appendChild(divCount)
    basketList.appendChild(li)
}
let totalCom = document.getElementsByClassName("total_com")[0]
totalCom.textContent = `商品${total}点 合計`
let totalFee = document.getElementsByClassName("total_fee")[0]
totalFee.textContent = `¥${fee}`

