<template>
  <div class="aboutMe">
    <div class="introduce">
      <br/>
      <img class="headImg" src="@/assets/myImg.jpg" />
      <br /><br /><br />
      <p>{{ "还关于个啥呢" }}</p>
      <br /><br />
      <p>{{ "烦不烦" }}</p>
      <br /><br />
      <p>{{ "qwq" }}</p>
      <br /><br />
      <p>{{ "烦不烦" }}</p>
      <br />
    </div>
  </div>
</template>

<script>
</script>

<style scoped lang="less">
.aboutMe {
  text-align: center;
  padding: 30px;
  .introduce {
    padding: 30px;
    box-sizing: border-box;
    min-height: 100%;
    background: white;
    .headImg {
      border-radius: 50%;
      width: 190px;
    }
    p {
      font-size: 16px;
      max-width: 500px;
      margin: 20px auto;
    }
  }
}

@media screen and (max-width: 900px) {
  .aboutMe {
    padding: 30px 0;
    .introduce {
      padding: 30px 10px;
    }
  }
}
</style>