const express = require("express")
const sqlite = require("sqlite3")
const bodyParser = require("body-parser")
const { render } = require("ejs")
<<<<<<< HEAD

const db = new sqlite.Database("hew.db")
db.serialize(
    
)
=======
// import { controleDatabase } from "./lib/ctrldb.js"

>>>>>>> e6db7f1 (Start!)

const app = express()
// const port = 3000
const port = 80

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// TOPページ
app.get("/", (req, res)=> {
    res.render("index")
})
// 会計ページ
app.get("/Check", (req, res)=> {
    res.render("check")
})
// ポスターページ
app.get("/Poster", (req, res)=> {
    res.render("poster")
})
// 棚ページ
app.get("/Shelf", (req, res)=> {
    res.render("shelf")
})
// 会員登録・ログイン
app.post("/Sign", (req, res)=> {
    console.log(req.body)
    return res.render(req.body.page, {view: true, output: req.body.output})
})
// お気に入り
app.post("/Favorite", (req, res)=> {
    return res.render("favorite")
})
// 買い物かご
app.post("/Cart", (req, res)=> {
    return res.render("cart")
})
// お気に入り
app.get("/Favorite", (req, res)=> {
    return res.render("favorite")
})
// 買い物かご
app.get("/Cart", (req, res)=> {
    return res.render("cart")
})


app.listen(port, ()=>{
    console.log(`Open port ${port}`)
})