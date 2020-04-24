<template>
  <div>
    <div id = "top">
      <p>店铺名:<b>{{shop.shopName}}</b></p>
    </div>
    <div id = "bottom">
        <el-button><router-link to = "/shop/shopName">编辑店铺名</router-link></el-button>
        <el-button><router-link to = "/shop/descibe">建商品描述</router-link></el-button>
        <el-button><router-link to = "/food/createFood">创建菜品</router-link></el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data(){
    let shop = JSON.parse(localStorage.getItem('shop'))
    return {
      shop
    }
  }
  
}
</script>

<style>

</style>
