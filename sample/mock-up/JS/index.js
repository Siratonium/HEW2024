// import { test01 } from "./test01.js"
// const test = new test01
// test.index()

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
