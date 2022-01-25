<template>
  <!--电脑屏幕导航条-->
  <div class="sideBar">
    <div class="wrap">
      <div class="myImg">
        <img src="@/assets/myImg.jpg" alt="" />
        <h1>用户：{{ myInfo }}</h1>
      </div>
      <ul>
        <router-link v-for="(one, index) in nav" :key="index" :to="one.url">
          <li
            @click="changeSelect(index)"
            :class="{ active: index == selectItem }"
          >
            <img :src="one.icon" style="width: 7%" />
            {{ one.name }}
          </li>
        </router-link>
        <span>
          <img :src="out" style="width: 7%" />
          <a-button
            style="margin: 10px 0; color: white; font-size: 20px"
            v-on:click="logout"
            >登出</a-button
          >
        </span>
      </ul>
      <nav-search></nav-search>
    </div>
  </div>
</template>

<script>
import navSearch from "./components/navSearch";
import p1 from "@/../static/image/首页.png";
import p2 from "@/../static/image/登录.png";
import p3 from "@/../static/image/注册.png";
import p4 from "@/../static/image/任务.png";
import p5 from "@/../static/image/关于.png";
import p6 from "@/../static/image/登出.png";

export default {
  name: "computerNav",
  props: ["myInfo"],
  components: {
    navSearch,
  },
  data() {
    return {
      isActive: false,
      selectItem: 0,
      nav: [
        { name: "首页", url: "/homepage", icon: p1 },
        { name: "登录", url: "/login", icon: p2 },
        { name: "注册", url: "/register", icon: p3 },
        { name: "任务", url: "/task", icon: p4 },
        { name: "关于", url: "/about", icon: p5 },
      ],
      out: p6,
    };
  },
  methods: {
    //更改导航栏状态
    changeSelect(index) {
      this.selectItem = index;
      this.$store.commit("saveSelect", this.selectItem);
    },
    logout() {
      if (localStorage.getItem("account")) {
        {
        }
        alert("登出成功!");
        localStorage.removeItem("account");
        this.$router.push("/login");
        this.$router.push("/homepage");
      } else {
        alert("尚未登录！");
      }
    },
  },
};
</script>

<style scoped lang="less">
.sideBar {
  display: flex;
  flex-direction: column;
  width: 350px;
  min-height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  text-align: center;
  background: #353d47;
  margin: auto 0px;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: auto;
  .wrap {
    margin: auto 0;
    .myImg {
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
      h1 {
        margin-top: 10px;
        font-size: 30px;
        color: white;
      }
      p {
        margin: 10px 0;
        color: white;
        font-size: 18px;
      }
    }
    .search {
      width: 200px;
      height: 25px;
      margin: 20px auto;
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
    ul {
      margin-top: 15px;
      .category {
        font-size: 20px;
      }
      a {
        margin-top: 20px;
        text-decoration: none;
        outline: none;
        color: white;
      }
      li {
        font-size: 20px;
        color: white;
        line-height: 45px;
        span {
          font-size: 35px;
          margin: 10px;
        }
      }
      li:after {
        content: "";
        width: 0px;
        height: 45px;
        background: white;
        position: absolute;
        z-index: -1;
        left: 0;
        transition: all 0.3s linear;
      }
      a:hover li::after {
        width: 100%;
        background: #409eff;
      }
      .active {
        background: #409eff;
      }
      .contact {
        margin-top: 30px;
      }
      .contact span {
        background: transparent;
      }
    }
  }
}

@keyframes flash {
  0% {
    /*background-position 左上角是 0 0，右边为正，下边为正*/
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@media screen and (max-width: 900px) {
  .sideBar {
    display: none;
  }
}
</style>