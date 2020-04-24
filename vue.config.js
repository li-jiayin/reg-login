//引入模拟的数据
let data = require("./src/mock/mock")
let bodyParser = require("body-parser")

//引入dblike文件夹中的index.js
let DBLike = require("./dblike/index.js")
//引入dblike.config.js文件
let DBlikeconfig = require("./dblike.config.js")

//new实例一个
let dblike = new DBLike(DBlikeconfig)

//用于写接口

module.exports = {
    devServer:{
        before(app){
            //可获取post
            app.use(bodyParser.json())

            //const list = [];用于存储用户名+密码 用此种方法再重启的时候之前注册的就不在了

            //1.注册
            app.post("/reg",(req,res) =>{
                //用dblike 存储用户名+密码+店铺名+店铺描述
                let user = {...req.body,shopName:'',describe:''}
                //创一个文件 Information
                //dblike.文件名。create(要添加的内容)
                dblike.Information.create(user)
                res.send({
                     user:user
                })
            })

            //2.登录
            app.post("/login",(req,res) =>{
                const info = req.body

                dblike.Information.query({limit:10000}).then(userdata =>{
                   
                   /* 
                     userdata = {
                        username: '李佳音',
                        password: '123456',
                        shopName: '',
                        describe: '',
                        describe: '',
                        id: 0
                       }
                    */
                    //find查找到了可返回那一项
                    const user  = userdata.find(item =>{
                        if(item.username === info.username && item.password === info.password){
                            return true
                        }

                        return false
                    })

                    //判断一下user 用户名是否存在
                    if(user){
                        res.send({
                            user : user 
                        })
                        //返回之后就结束
                        return ;
                    }

                    res.send({
                        message:"username is not defined"
                    })

                })

            })


            //3.更新shopName信息
            app.post('/updateInformation',(req,res) =>{
                let user = req.body
                console.log("user"+user)

                dblike.Information.update(user.id,user).then(user =>{
                    console.log(user)
                    res.send({
                        user:user
                    })
                })
            })

            //4.创建店铺
            app.post("/createShop",(req,res) =>{
                let shop = req.body
                console.log("shop"+shop)

                dblike.Shop.create(shop).then(shop =>{
                    res.send({
                        shop:shop
                    })
                })
            })

             

        }
    }
}
 