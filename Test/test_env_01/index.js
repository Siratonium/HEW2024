const express = require("express")
const bodyParser = require("body-parser")

const app = express()

// const port = 80
const port = 3000

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// ページ遷移、初期読み込み
// TOPページ
app.get("/", (req, res) => {
    res.render("index")
})
// 棚ページ
app.get("/shelf", (req, res) => {
    res.render("shelf")
})
// ポスターページ
app.get("/poster", (req, res) => {
    res.render("poster", {page: "poster"})
})
// 会計ページ
app.get("/check", (req, res) => {
    res.render("check")
})

// データ送受信（POST）
app.post("/sub", (req, res) => {
    console.log(req.body)
    if(req.body.subsc == 1){
        // 登録情報入力
        return res.render(req.body.page, {
            view: true
        })
    }
})
app.post("/subsc", (req, res) => {
    console.log(req.body)
    if(req.body.subsc == 0){
        // 登録情報入力
        return res.render(req.body.page)
    }
})


app.listen(port, ()=>{
    console.log(`open port ${port}`)
})