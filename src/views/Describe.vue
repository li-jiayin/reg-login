<template>
  <div>
      <h5>店铺描述</h5>
      <el-input placeholder="店铺描述" v-model = "form.describe"></el-input>
      <el-button type = "primary" id = "new">提交</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form:{
        describe:""
      }
    }
  }
}
</script>

<style>

</style>