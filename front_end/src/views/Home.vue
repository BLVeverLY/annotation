<template>
  <div class="content">
    <!-- 左边导航栏 -->
    <computer-nav :myInfo="myInfo"></computer-nav>
    <mobile-nav v-if="isRouterAlive" :myInfo="myInfo"></mobile-nav>

    <!-- 右边内容及过度动画 -->
    <div class="rightContent">
      <transition :name="transitionName" mode="out-in">
        <router-view v-if="isRouterAlive"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import computerNav from "./nav/computerNav";
import mobileNav from "./nav/mobileNav";

export default {
  name: "Home",
  components: {
    computerNav,
    mobileNav,
  },
  data() {
    return {
      windowWidth: "",
      isRouterAlive: true,
      myInfo: localStorage.getItem("account"),
      transitionName: "slide-up",
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.myInfo = localStorage.getItem("account");
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.myInfo = localStorage.getItem("account");
    next();
  },
  provide() {
    return {
      //提供一个reload方法，使得手机页面在导航跳转时得到刷新
      reload: this.reload,
    };
  },
  mounted() {},
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
  watch: {
    $route(to, from) {
      if (to.path == "/file") {
        this.transitionName = "slide-up";
      } else if (to.path == "/aboutMe") {
        this.transitionName = "fade-in";
      } else {
        this.transitionName = "slide-left";
      }
      console.log(this.transitionName);
    },
  },
};
</script>

<style scoped lang="less">
.content {
  height: 100%;
  position: relative;
  .rightContent {
    position: absolute;
    top: 0;
    left: 350px;
    right: 0px;
    background: #eaeaea;
    min-height: 100%;
    overflow: hidden;
    .slide-up-enter-active,
    .slide-up-leave-active {
      transition: all 0.5s;
    }
    .slide-up-enter,
    .slide-up-leave-to {
      transform: translateY(-100px);
      opacity: 0;
    }
    .slide-left-enter-active,
    .slide-left-leave-active {
      transition: all 0.5s;
    }

    .slide-left-enter,
    .slide-left-leave-to {
      transform: translateX(-100px);
      opacity: 0;
    }

    .fade-in-enter-active,
    .fade-in-leave-active {
      transition: all 0.5s;
    }
    .fade-in-enter,
    .fade-in-leave-to {
      opacity: 0;
    }
  }

  @media screen and (max-width: 900px) {
    .rightContent {
      position: relative;
      left: 0;
      width: 100%;
    }
  }
}
</style>