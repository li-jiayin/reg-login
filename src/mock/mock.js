let Mock = require("mockjs")

let data = Mock.mock({
    "data|10":[{
        "id|+1":1,
        "name":"@cname",
        "addr":"@city(true)"
    }]
})

module.exports = data