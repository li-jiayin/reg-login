<template>
  <div id = "reg">
    <h5>注册页面</h5>

    <div>
      <el-input v-model = "form.username" placeholder="用户名"></el-input>
    </div>

    <div>
      <el-input v-model = "form.password" placeholder="密码" type = "password"></el-input>
    </div>


    <!-- <div id = "code">
      <el-input v-model = "code" placeholder="验证码"></el-input>
      <a id = "a" @click = "getCode" href = "javaScript:;"> | 获取验证码</a>
    </div>   -->

    <div>
      <el-button type = "primary" id = "item" @click = "reg" >立即注册</el-button>
      <router-link to = "/login" id = "router">已有账号，去登录</router-link>
    </div>
 
  </div>
</template>

<script>
import axios from "axios"

export default {
  data(){
    return {
      form:{
        username:'',//用户名
        password:'',//密码
      },
    
    }
  },
  methods:{
    reg(){
       
      //注册
      axios({
        url:"/reg",
        method:"POST",
        data:this.form
        //post => 用data  传一个对象过去
      }).then(res =>{
        //注册成功跳转页面
        this.$router.push("/login")
        console.log(res)
      }).catch(error =>{
        console.log(error)
      })

    },
    
  }
}
</script>

<style>

</style>