const fs = require("fs")
const csv = require("csv")
const sqlite = require("sqlite3")

const DB = new sqlite.Database("hew.db")

// ユーザテーブル(user_number, user_id, user_name, email, password, address, registration_at)
// カートテーブル(cart_id, user_number, created_at)
// カートアイテムテーブル(cart_item_id, cart_id, product_id, quantity)
// オーダテーブル(order_id, user_number, order_date, total_amount, status)
// オーダアイテムテーブル(order_item_id, order_id, product_id, quantity)
DB.serialize(function(){
    DB.exec(`drop table if exists user;`)
    DB.exec(`drop table if exists cart;`)
    DB.exec(`drop table if exists cart_item;`)
    DB.exec(`drop table if exists accounting;`)
    DB.exec(`drop table if exists detail;`)
    DB.exec(`create table user(
        user_number integer primary key autoincrement,
        user_id varchra(10) unique,
        user_name varchra(50),
        birthday date(10),
        email varchara(100) unique,
        password varchara(100),
        address text,
        registration_at date(10)
        );`)
    DB.exec(`create table cart(
        cart_id varchra(10) primary key,
        user_number varchra(10),
        created_at date(10),
        foreign key (user_number) references user (user_number)
        )`)
    DB.exec(`create table cart_item(
        cart_item_id varchra(10) primary key,
        cart_id varchra(10),
        product_id varchra(10),
        quantity integer,
        foreign key (cart_id) references cart (cart_id),
        foreign key (product_id) references product (product_id)
        )`)
    DB.exec(`create table accounting(
        accounting_id varchra(10) primary key,
        user_number varchra(10),
        total_amount integer,
        order_at date(10),
        status varchra(5),
        foreign key (user_number) references user (user_number)
        )`)
    DB.exec(`create table detail(
        detail_id varchra(10) primary key,
        accounting_id varchra(10),
        product_id varchra(10),
        quantity integer,
        foreign key (accounting_id) references accounting (accounting_id),
        foreign key (product_id) references product (product_id)
        )`)
})
        // csvデータの読み込み、オブジェクト変換
// 商品テーブル
fs.createReadStream("Product.csv").pipe(csv.parse({columns: true}, (err, result) => {
        // db操作
        DB.serialize(function(){
            DB.exec(`drop table if exists product;`)
            DB.exec(`create table product(
                product_id varchra(10) primary key,
                product_name varchra(30),
                fee integer,
                stock integer,
                explain text
                );`)
            let i = 1
            for(let data of result){
                DB.run(`insert into product
                    (product_id, product_name, fee, stock, explain)
                    values
                    ($i, $name, $fee, $stock, $explain);`,{
                        $i: `p_${i}`,
                        $name: data.product_name,
                        $fee: data.fee,
                        $stock: data.stock,
                        $explain: data.explain
                })
                i++
            }
        })
    }))
    // 商品詳細テーブル
    fs.createReadStream("Description.csv").pipe(csv.parse({columns: true}, (err, result) => {
        DB.serialize(function(){
            DB.exec(`drop table if exists description;`)
            DB.exec(`create table description(
                description_id varchra(10) primary key,
                product_id varchra(10),
                manufacturer varchra(30),
                weight integer,
                content text,
                allergens text,
                flavor varchar(10),
                foreign key (product_id) references product (product_id)
                );`)
            let i = 1
            for(let data of result){
                DB.run(`insert into description
                    (description_id, product_id, manufacturer, weight, content, allergens, flavor)
                    values
                    ($d_i, $p_1, $manufacturer, $weight, $content, $allergens, $flavor);`,{
                        $d_i: `d_${i}`,
                        $p_1: data.product_id,
                        $manufacturer: data.manufacturer,
                        $weight: data.weight,
                        $content: data.content.replace(/>/g, ","),
                        $allergens: data.allergens=="なし"||data.allergens==""?null:data.allergens.replace(/>/g, ","),
                        $flavor: data.flavor.replace(/>/g, ",")
                })
                i++
            }
        })
    }))

