window.addEventListener("load", ()=>{
    const img = document.getElementById("backImg")  
    if(img){
        const dis = document.getElementById("dis")
        console.log(`${window.screen.width} , ${window.screen.height}`)
        dis.textContent = `${window.screen.width} , ${window.screen.height}`
        img.style.width = window.screen.width
        img.style.height = window.screen.height
        console.log(img)
    }
})
