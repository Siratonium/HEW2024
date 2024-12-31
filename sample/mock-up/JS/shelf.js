// import { test01 } from "./test01.js"
// const test = new test01
// test.shelf()


let hover = document.getElementById("c_basket")
hover.addEventListener("mouseover", ()=>{
    let high = document.getElementById("bgbasket_h")
    high.style.opacity = 1
    hover.addEventListener("mouseleave", ()=>{
        high.style.opacity = 0
    })
})
hover.addEventListener("click", ()=>{
    let memo = document.getElementById("memo_h")
    let bascket = document.getElementsByClassName("memo")[0]
    memo.style.opacity = 1
    memo.style.zIndex = 100
    bascket.style.display = "block"
    let pop = document.getElementsByClassName("com_card")[0]
    pop.style.display = "none"
    let des = document.getElementById("b_c")
    des.addEventListener("click", ()=>{
        memo.style.opacity = 0
        memo.style.zIndex = 0
        bascket.style.display = "none"
    })
})
let hover2 = document.getElementById("prev_in")
hover2.addEventListener("mouseover", ()=>{
    let trans = document.getElementById("arrow")
    trans.id = "arrow_hover"
    hover2.addEventListener("mouseleave", ()=>{
        trans.id= "arrow"
    })
})

let com = document.getElementsByClassName("com")
for(let i = 0; i < com.length; i++){
    com[i].addEventListener("click", (e)=>{
        let pop = document.getElementsByClassName("com_card")[0]
        pop.style.display = "block"
        // 商品カード情報の確定
        let title = document.getElementsByClassName("com_title")[0]
        title.textContent = `商品No.${e.target.id}`
        let sum = document.getElementById("buy_input")
        sum.value = 1
        let dis = document.getElementById("c_c")
        dis.addEventListener("click", ()=>{
            pop.style.display = "none"
        })
    })
}
let basket = []
function memo(){
// 親要素(挿入先)
let ele0 = document.getElementsByClassName("memo_list")[0]
// 初期化
ele0.innerHTML = ""
// 以下作成
for (let i=0; i<basket.length; i++){
    // 第0子要素（作成元親要素）
    let chil0 = document.createElement("li")
    chil0.style.marginBottom = "10px"
    // 第1子要素
    let chil1 = document.createElement("p")
    chil1.className = "memo_number"
    chil1.textContent = i+1
    // 第2子要素
    let chil2 = document.createElement("div")
    chil2.className = "memo_img"
    let img = document.createElement("img")
    chil2.appendChild(img)
    // 第3子要素
    let chil3 = document.createElement("div")
    chil3.className = "memo_title"
    let h1 = document.createElement("h1")
    h1.textContent = basket[i][0]
    let div = document.createElement("div")
    div.className = "memo_command"
    let p1 = document.createElement("p")
    let p2 = document.createElement("p") 
    p1.className = "memo_c"
    p1.id = "det"
    p1.textContent = "商品詳細"
    p2.className = "memo_c"
    p2.id = "del"
    p2.textContent = "削除"
    let p3 = document.createElement("p")
    p3.textContent = "数量"
    p3.style.fontSize = "16px"
    let select = document.createElement("select")
    select.className = "memo_qv"
    select.style.fontSize = "16px"
    for(let i=1; i<11; i++){
        let option = document.createElement("option")
        option.style.fontSize = "14px"

        if (i != 10){
            option.value = i
            option.textContent = i

        }else{
            option.value = "over"
            option.textContent = "+10"
        }
        select.appendChild(option)
    }
    select.value = basket[i][1]
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(select)
    chil3.appendChild(h1)
    chil3.appendChild(div)
    // 第4子要素
    let chil4 = document.createElement("div")
    chil4.className = "memo_q"

    let fee = document.createElement("div")
    fee.className = "memo_fee"
    let fee_p = document.createElement("p")
    fee_p.textContent = `¥${basket[i][2]}`
    fee_p.style.fontSize = "20px"
    fee.appendChild(fee_p)
    chil4.appendChild(fee)
    // 合成
    chil0.appendChild(chil1)
    chil0.appendChild(chil2)
    chil0.appendChild(chil3)
    chil0.appendChild(chil4)
    // 作成完了
    ele0.appendChild(chil0)
}
}


// let comdel = document.getElementsByClassName("com")
// for(let i=0; i < comdel.length; i++){
//     let div = document.createElement("div")
//     div.className = "com_del"
//     comdel[i].appendChild(div)
// }

// カートに入れる
let inBnt = document.getElementById("to_cart")
inBnt.addEventListener("click", ()=>{
    let name = document.getElementsByClassName("com_title")[0].textContent
    let sum = document.getElementById("buy_input").value
    let flag = true
    for (let i = 0; i< basket.length; i++){
        if(name == basket[i][0]){
            console.log(basket[i][1])
            basket[i][1] = Number(sum) + Number(basket[i][1])
            flag = false
        }
    }
    if (flag){
        basket.push([name, sum, 50])
    }
    memo()
})