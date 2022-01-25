<template>
  <div class="box">
    <div class="zhuce">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号名称" prop="account">
          <el-input v-model="ruleForm.account" clearable></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="ruleForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">注册</el-button>
          <el-button @click="returnForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const regUser = /^[a-zA-Z0-9_-]{6,128}$/;
    var checkUser = (rule, value, callback) => {
      if (regUser.test(value)) {
        return callback();
      }
      callback(new Error("用户名必须包含至少6个字母或数字"));
    };
    var checkEmail = (rule, value, callback) => {
      const regUser = /^([a-zA-Z0-9]+[-_]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
      if (regUser.test(value)) {
        return callback();
      }
      callback(new Error("邮箱格式不对"));
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!regUser.test(value)) {
        callback(new Error("密码必须包含至少6个字母或数字"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        account: "",
        email: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        account: [{ validator: checkUser, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    returnForm() {
      // 返回login界面
      this.$router.push("/login");
    },
    submitForm() {
      if (
        this.ruleForm.account != "" &&
        this.ruleForm.email != "" &&
        this.ruleForm.pass != ""
      ) {
        this.$axios({
          method: "post",
          url: "/api/user/add",
          data: {
            account: this.ruleForm.account,
            email: this.ruleForm.email,
            password: this.ruleForm.pass,
          },
        })
          .then((res) => {
            switch (res.data) {
              case 0:
                alert("注册成功！");
                this.$router.push("/login");
                break;
              case -1:
                alert("账号已存在！");
                break;
            }
          })
          .catch((err) => {
            alert(err);
          });
      } else {
        alert("填写不能为空！");
      }
    },
  },
};
</script>

<style >
.box {
  height: 100%;
  background-color: #2e4e6e;
}
.zhuce {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 400px;
  background-color: #fff;
  border-radius: 3px;
}
.el-form-item {
  margin-top: 30px;
  width: 400px;
}
</style>