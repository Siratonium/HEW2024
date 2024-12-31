const express = require("express");
const mysql = require('mysql');

// 定数connectionを定義して接続情報の書かれたコードを代入してください
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  port : 3306,
  database: 'soratest'
});

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    const sql = "SELECT * FROM test";
    connection.query(sql, (err, result, fields)=>{
      console.log(result)
      res.render('index.ejs', {userTable: result});
    })
})

app.listen(3000);
// MySQLを使うためのコードを貼り付けてください