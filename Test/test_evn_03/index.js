const express = require("express")
const sqlite = require("sqlite3")
const bodyParser = require("body-parser")
const session = require("express-session")


const app = express()
// const port = 3000
const port = 80
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(session({
    secret: "dagasiyakohirudo",
    resave: true,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        secure: false
    }
}))



// TOPページ
app.get("/", (req, res)=> {
    req.session.destroy()
    res.render("index")
})

// 会員登録フォーム
// エラー文セット
let ErrorString = {}
let sessionCol = 0
function initError(){
    ErrorString = {
        "user_name" : "",
        "user_mail" : "",
        "user_id" : "",
        "password" : "",
        "C_password" : "",
        "contry" : "",
        "postcode" : "",
        "state" : "",
        "city" : "",
        "address_line1" : "",
        "address_line2" : "",
    }
}
app.get("/Signup", (req, res)=> {
    initError()
    res.render("signup", {ErrorString: ErrorString, session: req.session})
})
app.post("/Signup", (req, res)=> {
    initError()
    // フォーム情報取得
    FormDataKeys = Object.keys(req.body)
    FormDataKeys.forEach(e => {
        // セッションに保存(パスワード以外)
        if (e != "password" || e != "C_password"){
            req.session[e] = req.body[e]
        }
        // 未入力検査
        if (req.body[e] === ""){
            ErrorString[e] = "上記の項目が未入力です"
        }else{

            // 入力値検査
                // 処理を入力
                
            // パスワード一致検査
            if(req.body["password"]!= req.body["C_password"]){
                ErrorString["C_password"] = "パスワードが一致しません"
            }
        }
    })
    console.log(req.session)
    res.render("signup", {ErrorString: ErrorString, session: req.session})
})



app.listen(port, ()=>{
    console.log(`Open port ${port}`)
})  