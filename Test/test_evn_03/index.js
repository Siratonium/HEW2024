const express = require("express")
const sqlite = require("sqlite3")
const bodyParser = require("body-parser")
const session = require("express-session")
const moment = require("moment")
const currentTime = moment()
const today = currentTime.format("YYYY-MM-DD")
const nowYear = currentTime.format("YYYY")
const bcrypt = require("bcrypt")
const { render } = require("ejs")


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

const DB = new sqlite.Database("hew.db")

// TOPページ
app.get("/", (req, res)=> {
    // セッション内容処理
    const sessionKeys = Object.keys(req.session)
    sessionKeys.forEach(e => {
        if ( e != "cookie" & e != "login"){
            req.session[e] = ""
        }
    })
    res.render("index", {session: req.session})
})
// 棚ページ
let productNo = 0
let next = true
let prev = false
app.get("/Shelf", (req, res) => {
    // 商品データの取得
    DB.all(`select * from product;`, (err, row) => {
        if(err){
            console.log(err)
        }else{
            if(row){
                console.log(productNo)
                return res.render("shelf", {rows: row, productNo: productNo, next: next, prev: prev}) 
            }
        }
    })
})
app.get("/Shelf/next", (req, res) => {
    DB.all(`select * from product;`, (err, row) => {
        if(row){
            productNo += 30
            if(productNo + 30 >= row.length){
                next = false
            }
            prev = true
            return res.redirect("/Shelf")

        }
    })
})
app.get("/Shelf/prev", (req, res) => {
    productNo -= 30
    if (productNo <= 0){
        productNo = 0
        prev = false
        next = true
    }
    return res.redirect("/Shelf")
})
// カゴページ
app.get("/Cart", (req, res) => {

})









// 会員登録システム
let ErrorString = {}
function initError(){
    ErrorString = {
        "user_name" : "",
        "user_mail" : "",
        "user_id" : "",
        "password" : "",
        "C_password" : "",
        "postcode" : "",
        "state" : "",
        "city" : "",
        "address_line1" : "",
        "address_line2" : "",
    }
}
app.get("/Signup", (req, res)=> {
    initError()
    return res.render("signup", {ErrorString: ErrorString, session: req.session, nowYear: nowYear})
})
app.post("/Signup", (req, res)=> {
    // initError()
    let error = false
    // フォーム情報取得
    FormDataKeys = Object.keys(req.body)
    FormDataKeys.forEach(e => {
        // セッションに保存(パスワード以外)
        if (e != "password" || e != "C_password"){
            req.session[e] = req.body[e]
        }
        // 未入力検査
        if (req.body[e] === ""){
            if(e != "address_line2"){
                ErrorString[e] = "上記の項目が未入力です"
                error = true
            }
        }else{

            // 入力値検査
                // 処理を入力
                
            // パスワード一致検査
            if(req.body["password"]!= req.body["C_password"]){
                ErrorString["C_password"] = "パスワードが一致しません"
                error = true
            }
        }
    })
    if (error) {
        return res.render("signup", {ErrorString: ErrorString, session: req.session, nowYear: nowYear})
    }else{
        const address = req.body.postcode+" "+req.body.state+" "+req.body.city+" "+req.body.address_line1+" "+req.body.address_line2
        const birthday = req.body.birth_year+"-"+req.body.birth_month+"-"+req.body.birth_day
        bcrypt.hash(req.body.password, 1)
            .then((hashedpassword) => {
                DB.serialize(function(){
                    DB.run(`insert into user
                        (user_id, user_name, birthday, email, password, address, registration_at)
                        values
                        ($user_id, $user_name, $birthday, $email, $password, $address, $registration_at);`,{
                            $user_id: req.body.user_id,
                            $user_name: req.body.user_name,
                            $birthday: birthday,
                            $email: req.body.user_mail,
                            $password: hashedpassword,
                            $address: address,
                            $registration_at: today
                        },(err)=>{
                        // 既存のユーザではないか検査
                            if (err == null){
                                console.log("登録完了")
                                return res.render("signup_comp")
                            }else if(err.errno == 19){
                                const errRow = err.message.split(" ")[err.message.split(" ").length - 1]
                                if (errRow == "user.email"){
                                    ErrorString["user_mail"] = "すでに登録されているメールアドレスです。"
                                    req.session["user_mail"] = ""
                                }else if(errRow == "user.user_id"){
                                    ErrorString["user_id"] = "すでに登録されているユーザ名です。"
                                    req.session["user_id"] = ""
                                }
                                return res.render("signup", {ErrorString: ErrorString, session: req.session, nowYear: nowYear})
                            }
                        })
                })
            })

    }
})

// ログインシステム
app.get("/Login", (req, res) => {
    return res.render("login", {session: req.session})
})
app.post("/Login", (req, res) => {
    // ユーザ名検索
    const userInput = req.body.user_input
    DB.serialize(function(){
        DB.get(`select user_id, password
            from user
            where user_id = $userInput or email = $userInput`, {
            $userInput : userInput
        },(err, row)=>{
            if(row){
                bcrypt.compare(req.body.password, row.password)
                .then((result)=>{
                    if(result){
                        req.session.login = row.user_id
                        return res.redirect("/")
                    }else{
                        req.session.loginErr = "ユーザ名、メールアドレスまたはパスワードが違います。"
                        return res.render("login", {session: req.session})
                    }
                })
            }else{
                req.session.loginErr = "ユーザ名、メールアドレスまたはパスワードが違います。"
                return res.render("login", {session: req.session})
            }
        })
    })
})
// ログアウトシステム
app.get("/Logout", (req, res)=> {
    req.session.login = false
    return res.redirect("/")    
})
// 3D画像表示
app.get("/Cg", (req, res) => {
    return res.render("cg")
})





app.listen(port, ()=>{
    console.log(`Open port ${port}`)
})
