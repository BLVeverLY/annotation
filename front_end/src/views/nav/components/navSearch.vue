<template>
  <div class="search">
    <input
      type="text"
      v-model="keywords"
      placeholder="站内搜索"
      @keyup.enter="search"
    />
    <span class="iconfont icon-chazhao1" @click="search"></span>
  </div>
</template>

<script>
//待补充
</script>

<style scoped lang="less">
.search {
  width: 200px;
  height: 25px;
  margin: 10px auto;
  background: white;
  text-align: left;
  border-radius: 10px;
  input {
    width: 150px;
    margin-left: 10px;
    border: none;
    outline: none;
  }
  .iconfont {
    margin-left: 13px;
    vertical-align: middle;
    font-size: 18px;
    cursor: pointer;
  }
  a {
    text-decoration: none;
  }
}
</style>