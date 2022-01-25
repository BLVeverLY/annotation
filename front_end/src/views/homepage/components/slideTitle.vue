<template>
  <div class="slideTitle">
    <div class="head">
      <p>{{ type.title }}</p>
      <p>{{ type.describe }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "slideTitle",
  props: ["type"],
};
</script>

<style scoped lang="less">
.slideTitle {
  padding: 20px;
  /*padding: 20px 20px 15px;
	box-sizing: border-box;*/
  .head {
    height: 100px;
    padding: 5px 20px;
    background: white;
    border-left: 10px solid #353d47;
    p:first-child {
      margin-top: 8px;
      font-size: 30px;
      font-weight: bold;
    }
    p:last-child {
      margin-top: 15px;
      font-size: 16px;
    }
  }
}
</style>