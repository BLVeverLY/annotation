<template>
  <div>
    <!--父子组件传值传值把数据传过去的，文章会自动全部显示-->
    <slide-title :type="type1"></slide-title>
    <div class="myImg">
      <img
        src="@/assets/jinglingbiaozhu.jpg"
        alt="精灵标注助手"
        height="450"
        width="1050"
      />
    </div>
    <slide-title :type="type2"></slide-title>
  </div>
</template>

<script>
import slideTitle from "./components/slideTitle";

export default {
  name: "homePage",
  components: {
    slideTitle,
  },
  data() {
    return {
      type1: {
        title: "欢迎你，年轻人",
        describe: "这只是一个简简单单的欢迎界面",
      },
      type2: {
        title: "",
        describe: "图像标注网站————作者：李佳园",
      },
    };
  },
};
</script>

<style scoped lang="less">
.myImg {
  padding: 20px 20px 15px;
  box-sizing: border-box;
  width: 50px;
}
</style>