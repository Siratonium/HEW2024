const off_tab = document.getElementsByClassName("fal")[0]
console.log(off_tab)
off_tab.addEventListener("click", (e)=> {
    async function form(t_id){
        const id = t_id
        console.log(id)
        const f = document.createElement("form")
        f.method = "post"
        f.action = "/sing"
        f.id = "change"
        const output = document.createElement("input")
        output.type = "hidden"
        output.name = "output"
        output.value = `${id}`
        f.appendChild(output)
        // const btn = document.createElement("input")
        // btn.type = "submit"
        // f.appendChild(btn)
        off_tab.appendChild(f)
    }
    async function submit() {
        await form(e.target.id)
        const f = document.getElementById("change")
        console.log(f)
        // f.submit()
    }
    submit()

})