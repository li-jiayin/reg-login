<template>
  <div>
      <h5>创建店铺菜品</h5>
      <el-input placeholder="店铺菜名" v-model = "form.name"></el-input>
      <el-button type = "primary" id = "new" @click = "login">新建</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form:{
        name:""
      }
    }
  },
  methods:{
    login(){
    
    }
  }
  
}
</script>

<style>

</style>