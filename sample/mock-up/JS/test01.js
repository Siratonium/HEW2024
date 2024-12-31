class test01 {
    // static basket = []

    constructor(){
        this.basket = []
    }

    index(){
        let hoverList = ["poster", "check", "shelf", "basket"]
        let highList = ["bgposter_h", "bgcheck_h", "bgroomshelf_h", "bgbasket_h"]
        function mouseover(t_point, t_view){
            let point = document.getElementById(t_point)
            point.addEventListener("mouseover", ()=>{
                let view = document.getElementById(t_view)
                view.style.opacity = 1
                point.addEventListener("mouseleave", ()=>{
                    view.style.opacity = 0
                })
            })
        }
        for (let i = 0 ; i < 4; i++){
            mouseover(hoverList[i], highList[i])
        }
    }
    shelf(){

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
        this.basket = []
        // カートに入れる
        let inBnt = document.getElementById("to_cart")
        inBnt.addEventListener("click", ()=>{
            let name = document.getElementsByClassName("com_title")[0].textContent
            let sum = document.getElementById("buy_input").value
            let flag = true
            for (let i = 0; i< this.basket.length; i++){
                if(name == this.basket[i][0]){
                    console.log(this.basket[i][1])
                    this.basket[i][1] = Number(sum) + Number(this.basket[i][1])
                    flag = false
                }
            }
            if (flag){
                this.basket.push([name, sum, 50])
            }
            this.memo()
        })
    }
    memo(){
        // 親要素(挿入先)
        let ele0 = document.getElementsByClassName("memo_list")[0]
        // 初期化
        ele0.innerHTML = ""
        // 以下作成
        for (let i=0; i<this.basket.length; i++){
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
            h1.textContent = this.basket[i][0]
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
            select.value = this.basket[i][1]
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
            fee_p.textContent = `¥${this.basket[i][2]}`
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
    check(){
        let basketList = document.getElementsByClassName("basketlist")[0]
        let total = 0
        let fee = 0
        for(let i=0; i<this.basket.length; i++){
            let com_name = this.basket[i][0]
            let com_quantity = this.basket[i][1]
            let com_fee = this.basket[i][2]
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
                countFee[e.target.id.slice(6)].textContent = `¥${e.target.value * this.basket[e.target.id.slice(6)][2]}`
                this.basket[e.target.id.slice(6)][1] = e.value
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
        
        
    }
}
export{test01}