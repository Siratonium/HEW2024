// window.addEventListener("load", ()=>{
//     const img = document.getElementById("backImg")  
//     if(img){
//         const dis = document.getElementById("dis")
//         console.log(`${window.screen.width} , ${window.screen.height}`)
//         dis.textContent = `${window.screen.width} , ${window.screen.height}`
//         img.style.width = window.screen.width
//         img.style.height = window.screen.height
//         console.log(img)
//     }
// })

// ハイライトシステム
// TOPページ
let isTop = document.getElementById("top_wrap")
if(isTop){
    let hoverAreas = document.getElementsByClassName("hover")
    console.log(hoverAreas)
    for(let i = 0; i < hoverAreas.length; i++){
        let img = document.getElementById("backImg")
        hoverAreas[i].addEventListener("mouseover", (e)=>{
            if(e.target.id == "shelf"){
                img.src = "image/background/mainPage_hover_shelf.png"

            }else if(e.target.id == "check"){
                img.src = "image/background/mainPage_hover_account.png"

            }else if(e.target.id == "poster"){
                img.src = "image/background/mainPage_hover_poster.png"

            }
        })
        hoverAreas[i].addEventListener("mouseout", (e)=>{
            img.src = "image/background/mainPage.png"

        })
    }
}
// 棚ページ
let isShelf = document.getElementById("product_block")
if(isShelf){
    let hoverAreas = document.getElementsByClassName("hover")
    console.log(hoverAreas)
    for(let i = 0; i < hoverAreas.length; i++){
        let img = document.getElementById("back_img")    
        hoverAreas[i].addEventListener("mouseover", (e)=>{
            if(e.target.id == "cart"){
                img.src = "image/background/shelf_hover_kago.png"

            }else if(e.target.id == "cat"){
                img.src = "image/background/shelf_hover_neko.png"

            }
        })
        hoverAreas[i].addEventListener("mouseout", (e)=>{
            img.src = "image/background/shelf.png"

        })
    }
}