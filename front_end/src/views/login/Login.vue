<template>
  <div class="login_container">
    <div class="login_box">
      <br />
      <br />
      <dev align="center">
        <h1 style="color: #2e4e6e; font-size: 20px; font-family: STKaiti">
          欢迎登录
        </h1>
      </dev>
      <!--表单提交区域-->
      <el-form
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
      >
        <!--用户名-->
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            prefix-icon="iconfont icon-user"
            placeholder="请输入账号"
            clearable
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            placeholder="请输入密码"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item class="btns">
          <el-checkbox class="remember" v-model="keepPassword"
            >记住密码</el-checkbox
          >
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "loginCookie",
  data() {
    return {
      keepPassword: true, // 记住密码
      loginForm: {
        // 登录的表单数据的绑定对象
        account: "",
        password: "",
      },
      loginFormRules: {
        // 验证用户名是否合法
        account: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度至少为6个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度至少为6个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    var data = localStorage.getItem("cookie");
    if (data) this.keepPassword = data;
    // 读取cookie
    if (this.keepPassword) {
      this.getCookie();
    }
    localStorage.removeItem("cookie");
  },
  mounted() {},
  beforeRouteLeave(to, form, next) {
    if (this.keepPassword) {
      this.setCookie(this.loginForm.account, this.loginForm.password, 30);
    } else {
      this.clearCookie();
    }
    // 保存keepPassword
    localStorage.setItem("cookie", this.keepPassword);
    next();
  },
  methods: {
    // 记住密码保存数据
    setCookie(name, pwd, exdays) {
      var exdate = new Date(); // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "userPwd" + "=" + pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    // 读取cookie
    getCookie() {
      var arr = document.cookie.split("; "); // 这里显示的格式需要切割一下自己可输出看下
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split("="); // 再次切割
        if (arr2[0] === "userName") {
          this.loginForm.account = arr2[1]; // 保存到保存数据的地方
        } else if (arr2[0] === "userPwd") {
          this.loginForm.password = arr2[1];
        }
      }
    },
    // 清除cookie
    clearCookie: function () {
      this.setCookie("", "", -1); // 修改2值都为空，天数为负1天就好了
    },
    // 多层嵌套无法输入解决方法
    change(e) {
      this.$forceUpdate();
    },
    resetLoginForm() {
      // 点击重置按钮,重置登录表单
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 点击登录按钮，跳转到HomePage.vue
      this.$refs.loginFormRef.validate(async (valid) => {
        // 验证登录数据
        if (!valid) {
          // 根据登录结果判断是否发起登录请求
          return (this.loginLoading = false);
        }
        this.$axios({
          method: "post",
          url: "/api/user/login",
          data: {
            account: this.loginForm.account,
            password: this.loginForm.password,
          },
        })
          .then((res) => {
            switch (res.data) {
              case 0:
                alert("登陆成功！");
                //localStorage.setItem("token", response.data.result);
                localStorage.setItem("account", this.loginForm.account);
                this.$router.push("/homepage"); // 跳转到HomePage.vue
                break;
              case -1:
                alert("账号不存在！");
                break;
              case 1:
                alert("密码错误！");
                break;
            }
          })
          .catch((err) => {
            alert(err);
          });
        this.loginLoading = false;
      });
    },
    register() {
      // 跳转到注册界面
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2e4e6e;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  .login_form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

