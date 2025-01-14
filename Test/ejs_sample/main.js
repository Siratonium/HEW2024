const express = require("express")

const sqlite3 = require("sqlite3")

const db = new sqlite3.Database("test.db")

const app = express()

let menber = ["sora", "asuka", "aru", "yuya", "taito", "yuki", "akito"]

// データ操作
db.serialize(function() {
    db.exec(`drop table if exists user;`)
    db.exec(`create table user (
        id integer primary key autoincrement,
        name varchar(10)
        );`)
    for(let i = 0; i < 7; i++){
        db.run(`insert into user (name) values ($menber);`, {
            $menber: menber[i]
        })
    }
    db.serialize(function() {
        // 一行取得
        db.get("select * from user", function(err, res) {
            // console.log(res);
        })
        // 全行取得
        db.all("select * from user", function(err, res) {
            // console.log(res)
        })
    })

    app.set("view engine", "ejs")
    app.use(express.static("public"))

    // トップページ
    app.get("/", (req, res) => {
        res.render("index")
    })

    // データベース閲覧ページ
    app.get("/view", (req, res) => {
        db.all("select * from user", function(err, result) {
                return res.render("view", {
                    data_list: result,
                    list_cont: result.length
                })
        })
    })

    // データベース検索ページ
    app.get("/search", (req, res) => {
        let search_data = req.query
        let record = Object.keys(search_data).length
        if(record == 0){
            return res.render("search", ({
                id: null,
                name: null,
                data: null
            }))
        }else{
            db.all("select * from user", function(err, result) {
                const s_data = search_data.data
                let res_int = s_data.match(/\d/)
                let res_str = s_data.match(/[a-z]{1,10}/)
                let v_data = res_int == null ? res_str == null ? [null, "name"] : [s_data, "name"] : [s_data, "id"]
                for(let i=0; i<result.length; i++){
                    if(result[i][`${v_data[1]}`] == v_data[0]){
                        return res.render("search", {
                            id: `ID: ${result[i]["id"]}`,
                            name : `NAME: ${result[i]["name"]}`,
                            data : s_data
                        })
                    }else if(v_data[0] == null){
                        return res.render("search", {
                            id: "0~9の半角数字またはa~zの英字を入力してください。",
                            name : null,
                            data : s_data
                        })
                    }else if(i == result.length - 1){
                        return res.render("search", {
                            id: "検索結果が見つかりませんでした。",
                            name : null,
                            data : s_data
                        })
                    }
                }
            })

        }
    })

    // データベース追加ページ
    app.get("/add", (req, res) => {
        const add_data = req.query
        const record = Object.keys(add_data).length
        console.log(record)
        if(record == 0){
            return res.render("add", {
                mes: null,
                check: null
            })
        }else{
            db.run(`insert into user (name) values ("${add_data["name"]}");`)
            db.all("select * from user", function(err, res) {
                console.log(res)
            })
            return res.render("add", {
                mes: "追加完了しました。",
                check: `<a href="/view">確認</a>`
            })
        }
    })

    // データベース更新ページ
    app.get("/update", (req, res) => {
        let req_data = req.query
        let record = Object.keys(req_data).length
        let send_data = {
            mes: null,
            check: null
        }
        if(record == 0) {
            return res.render("update", send_data)
        }else{
            let update_id = req.query.id
            let update_name = req.query.name.match(/[a-z]{1,10}/) == null ? null : req.query.name
            if(update_name == null){
                send_data.mes = "変更データは[a-z]の英字で入力してください。"
                return res.render("update", send_data)
            }else{
                db.all("select * from user", function(err, result) {
                    let keys = Object.keys(result)
                    if(update_id in keys){
                        keys.forEach(key => {
                            if(Number(key) == update_id){
                                db.exec(`
                                    update user
                                    set name = "${update_name}"
                                    where id = "${Number(key)}"
                                    ;`)
                                send_data.mes = "変更が完了しました。"
                                send_data.check = "確認"
                                return res.render("update", send_data)

                            }
                        })
                    }else{
                        send_data.mes = "IDが見つかりません。"
                        return res.render("update", send_data)
                    }
                })
            }
        }
    })

    // POSTテスト
    app.get("/post", (req, res) => {
        res.render("post")
    })
    app.post("/post", (req, res) => {
        res.render("post")
    })
})

app.listen(80, ()=>{
    console.log("port 80")
})