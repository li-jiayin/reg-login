<template>
  <div>
     <p id = "login"><b>账户密码登录</b> <span>手机号登录</span></p>

    <div id = "reg">
        <div>
            <el-input v-model = "form.username" placeholder="用户名"></el-input>
        </div>

        <div>
            <el-input v-model = "form.password" placeholder="密码" type = "password"></el-input>
        </div>
    </div>
  
    <div id = "reg2">
      <el-button type = "primary" @click = "login" id = "item">登录</el-button>
    </div>

  </div>
</template>

<script>
import {Message} from "element-ui"
import axios from "axios"

//axios做响应拦截
axios.interceptors.response.use(response =>{
  if(response.data.message === 'username is not defined'){
    //可弹出弹框
    //Message.warning('该用户不存在')
    Message.warning('该用户不存在');
    return Promise.reject('该用户不存在')
  }
  return response
})


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
    login(){
      
      axios({
        url:"/login",
        method:"POST",
        data:this.form
      }).then(res =>{
         this.$router.push("/list")
      }).catch(error =>{
        console.log(error)
      })

     
    }
  }
 
}
</script>

<style>

</style>