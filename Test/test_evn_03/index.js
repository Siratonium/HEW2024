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

const Max = function (a, b) {return Math.max(a, b);}
const Min = function (a, b) {return Math.min(a, b);}

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
let modal = false
DB.all(`select * 
    from product 
    join description on 
    product.product_id = description.product_id`,
    (err, row) =>{
    if(row){
        app.get("/Shelf", (req, res) => {
            // 商品データの取得
            if(err){
                console.log(err)
            }else{
                if(row){
                    return res.render("shelf", {
                        rows: row,
                        len: row.length,
                        productNo: productNo,
                        next: next,
                        prev: prev,
                        modal: modal
                    }) 
                }
            }
        })
        app.get("/Shelf/next", (req, res) => {
            if(row){
                productNo += 30
                if(productNo + 30 >= row.length){
                    next = false
                }
                prev = true
                return res.redirect("/Shelf")
            }
        })
        app.get("/Shelf/prev", (req, res) => {
            productNo -= 30
            if (productNo <= 0){
                productNo = 0
                prev = false
                next = true
            }
            modal = false
            return res.redirect("/Shelf")
        })
    }
    // 商品モーダル
    for (let i = 0; i < row.length; i++){
        app.get(`/Shelf/p_${i + 1}`, (req, res) => {
            modal = `p_${i + 1}`
            return res.redirect("/Shelf")
        })
    }
})
// カゴへ追加
app.post("/Shelf/Cart", (req, res) => {
    // ログイン判定
    if(req.session.login){
        DB.serialize(()=>{
            DB.all(`select * from cart
                where user_number = $userNumber`,
                {$userNumber: req.session.login.userNumber},
                (err, row) => {
                    // 条件に一致するレコードがなかった場合
                    if(row.length == 0){
                        // カートテーブルのレコード数
                        DB.all(`select * from cart`, (err, rows) => {
                            let cartId = "c_1"
                            if(rows.length != 0){
                                let cartIdList = []
                                rows.forEach(data => {
                                    cartIdList.push(data.cart_id.slice(2))
                                })
                                if(cartIdList.reduce(Min) != 1){
                                    cartId = `c_${cartIdList.reduce(Min) - 1}`
                                }else{
                                    cartId = `c_${cartIdList.reduce(Max) + 1}`
                                }
                            }                            
                            // カートテーブル新規作成
                            DB.run(`insert into cart
                                (cart_id, user_number, created_at)
                                values
                                ($cart_id, $user_number, $created_at)`,{
                                    $cart_id: cartId,
                                    $user_number: req.session.login.userNumber,
                                    $created_at: today
                                },(err) => {
                                    if(err != null){
                                        console.log(`row128 Error: ${err}`)
                                    }
                                })
                            console.log("新規作成")
                        })
                    }
                }
            )
            // カートテーブルでヒットしたデータとフォームデータからカートアイテムテーブルに挿入
            DB.all(`select * from cart
                where user_number = $userNumber`,
                {$userNumber: req.session.login.userNumber},
                (err, data) => {
                    DB.all(`select cart_item_id, product_id from cart_item`,
                        (err, cart_item_row)=>{
                        if(err != null){
                            console.log(`row155 Error${err}`)
                        }else{
                            let cartItemId = "c_i_1"
                            if(cart_item_row.length != 0){
                                let cartItemIdList = []
                                cart_item_row.forEach(data => {
                                    cartItemIdList.push(data.cart_item_id.slice(4))
                                })
                                if(cartItemIdList.reduce(Min) != 1){
                                    cartItemId = `c_i_${cartItemIdList.reduce(Min) - 1}`
                                }else{
                                    cartItemId = `c_i_${cartItemIdList.reduce(Max) + 1}`
                                }
                            }
                            const cartId = data[0].cart_id
                            const productId = req.body.p_id
                            const quantity = req.body.quantity
                            let duplicate = false
                            for(let i = 0; i < cart_item_row.length; i++){
                                if(cart_item_row[i].product_id == productId){
                                    duplicate = true
                                }
                            }
                            if(duplicate){
                                DB.run(`update cart_item
                                    set quantity = quantity + $inputQuantity
                                    where cart_id = $cart_id and product_id = $product_id`,{
                                    $inputQuantity: quantity,
                                    $cart_id: cartId,
                                    $product_id: productId
                                })
                            }else{
                                DB.run(`insert into cart_item
                                    (cart_item_id, cart_id, product_id, quantity)
                                    values
                                    ($cart_item_id, $cart_id, $product_id, $quantity)`,{
                                        $cart_item_id: cartItemId,
                                        $cart_id: cartId,
                                        $product_id: productId,
                                        $quantity: quantity
                                    },(err)=>{
                                        if(err != null){
                                            console.log(`row169 Error${err}`)
                                        }
                                    })
                            }
                        }
                    })
            })
        })
        return res.redirect("/Shelf")
    }else{
        return res.redirect("/Login")
    }
})
// カゴ全削除
app.get("/delete_cart", (req, res)=>{
    DB.run(`delete from cart`)
    DB.run(`delete from cart_item`)
    return res.redirect("Shelf")
})
// カゴページ
app.get("/Cart", (req, res) => {
    if(req.session.login){
        DB.all(`select * from product
            join cart_item on product.product_id = cart_item.product_id
            join cart on cart_item.cart_id = cart.cart_id
            where cart.user_number = $userNumber`,{
                $userNumber: req.session.login.userNumber
            },(err, row)=>{
                const data = row
                const col = row.length
                return res.render("cart", {data: data, data_col:col})
            })
    }else{
        return res.redirect("/Login")
    }
})
app.post("/Cart/Update", (req, res)=>{
    let updateData = 0
    if(req.body.update == "m"){
        updateData = -1

    }else if(req.body.update == "p"){
        updateData = 1
    }
    if(Number(req.body.quantity) + updateData <= 0 || req.body.update == "d"){
        console.log(`削除: ${req.body.id}`)
        DB.run(`delete from cart_item where cart_item_id = $id`,{
            $id: req.body.id
        },(err) => {
            if(err){
                console.log(err)
            }
        }) 
    }else{
        DB.run(`update cart_item
            set quantity = quantity + $update
            where cart_item_id = $id`,{
                $update: updateData,
                $id: req.body.id
            },(err)=>{
                if(err){
                    console.log(err)
                }
            })
    }

    return res.redirect("/Cart")
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
        DB.get(`select user_number, user_id, password
            from user
            where user_id = $userInput or email = $userInput`, {
            $userInput : userInput
        },(err, row)=>{
            if(row){
                bcrypt.compare(req.body.password, row.password)
                .then((result)=>{
                    if(result){
                        req.session.login = {
                            userNumber : row.user_number,
                            userID : row.user_id
                        }
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