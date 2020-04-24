<template>
  <div>
      <h5>创建店铺</h5>
      <el-input placeholder="可创建店铺名" v-model = "form.shopName"></el-input>
      <el-button type = "primary" id = "new" @click = "submit">新建</el-button>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data(){
    return {
      form:{
        shopName:""
      }
    }
  },
  methods:{
    //提交
    submit(){
      let shopname = JSON.parse(localStorage.getItem('shop'))

      axios({
        url:'/updateInformation',
        method:"POST",
        data:{
          ...shopname,
          shopName:this.form.shopName
        }
      }).then(res =>{
        //本地存储 创建的店铺名
        localStorage.setItem("shop",JSON.stringify(res.data.user))
        this.$router.go(-1)
      }).catch(error =>{
        console.log(error)
      })
    }
  }
}
</script>

<style>

</style>