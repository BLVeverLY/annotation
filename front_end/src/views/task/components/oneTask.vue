<template>
  <div class="oneTask">
    <div class="head">
      <p>任务命：task{{ taskId }}</p>
      <p></p>
      <p>欢迎进入图像标注任务界面</p>
    </div>
    <div v-for="(imgUrl, i) in this.IMG" :key="imgUrl">
      <br /><br />
      <p style="font-size: 14px; color: grey">图片名：{{ name[i] }}</p>
      <img :src="imgUrl" alt="" height="600" width="800" />
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="display: inline-block"
      >
        <el-form-item label="请进行标注" prop="tag">
          <el-input v-model="ruleForm.tag[i]" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-button
        style="display: inline-block"
        type="primary"
        @click="submitAnnotation(i)"
        >提交标注</el-button
      >
      <el-button
        style="display: inline-block"
        type="primary"
        @click="createJSON(i)"
        >生成JSON文件</el-button
      >
      <el-button
        style="display: inline-block"
        type="primary"
        @click="createXML(i)"
        >生成XML文件</el-button
      >
    </div>
    <br />
    <el-button type="primary" @click="allOK()"
      >全部图片标注完毕并已生成所需文件</el-button
    >
    <br /><br /><br />
    <div class="inline">
      <download :taskId="taskId" :name="b1" :filetype="f1"></download>
      <download :taskId="taskId" :name="b2" :filetype="f2"></download>
    </div>
    <br />
  </div>
</template>

<script>
import download from "./download";

export default {
  name: "oneTask",
  props: ["taskId"],
  //inject: ["reload"],
  components: {
    download,
  },
  data() {
    return {
      IMG: [],
      name: [],
      ruleForm: {
        tag: [],
      },
      b1: "下载全部COCO格式的JSON文件",
      b2: "下载全部PASCAL VOC格式的XML文件",
      f1: "json",
      f2: "xml",
    };
  },
  created() {
    //获取任务下所有图片
    //var str="../../public/images/task"+this.taskId;

    var requireModule = require.context(
      "@/../../back_end/public/images",
      true,
      /\.jpg$/
    );
    var imagesNameArr = [];
    for (var i = 0; i < requireModule.keys().length; i++) {
      imagesNameArr.push(
        requireModule.keys()[i].substr(2, requireModule.keys()[i].length)
      );
    }
    var cnt = 0;
    for (var i = 0; i < requireModule.keys().length; i++) {
      if (
        imagesNameArr[i][0] == "t" &&
        imagesNameArr[i][1] == "a" &&
        imagesNameArr[i][2] == "s" &&
        imagesNameArr[i][3] == "k" &&
        imagesNameArr[i][4] == this.taskId
      ) {
        this.IMG[cnt] = require("@/../../back_end/public/images/" +
          imagesNameArr[i]);
        this.name[cnt++] = imagesNameArr[i];
      }
    }

    // this.$axios({
    //   method: "post",
    //   url: "/api/annotation/getAllPicture",
    //   data: { task_id: this.taskId },
    // })
    //   .then((res) => {
    //     var imagesName = res.data;
    //     var imagesNameArr = imagesName.split(";");
    //     for (var i = 0; i < imagesNameArr.length - 1; i++) {
    //       this.IMG[i] =
    //         "http://localhost:3000/static/images/task" +
    //         this.taskId +
    //         "/" +
    //         imagesNameArr[i];
    //       this.name[i] = imagesNameArr[i];
    //     }
    //   })
    //   .catch((err) => {
    //     alert(err);
    //   });
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    submitAnnotation(i) {
      if (this.ruleForm.tag != "") {
        if (localStorage.getItem("account")) {
          this.$axios({
            method: "post",
            url: "/api/annotation/submitAnnotation",
            data: {
              picture_id: this.name[i],
              tag: this.ruleForm.tag[i],
            },
          })
            .then((res) => {
              switch (res.data) {
                case 0:
                  alert("标注提交成功！");
                  break;
                case -1:
                  alert("标注已存在！");
                  break;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          alert("请先登录！");
        }
      } else {
        alert("填写不能为空！");
      }
    },
    allOK() {
      if (localStorage.getItem("account")) {
        this.$axios({
          method: "post",
          url: "/api/annotation/allok",
          data: { task_id: this.taskId },
        })
          .then((res) => {
            switch (res.data) {
              case 0:
                alert("此任务全部标注完毕！");
                break;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("请先登录！");
      }
    },
    createJSON(i) {
      var pic_id = this.name[i].split(".");
      this.$axios({
        method: "post",
        url: "/api/file/createJSON",
        data: {
          task_id: this.taskId,
          demo: "demo.json",
          picture_id: pic_id[0],
        },
      })
        .then((res) => {
          switch (res.data) {
            case 0:
              alert("生成COCO格式的JSON文件 " + pic_id[0] + ".json！");
              break;
            case -1:
              alert("标注不存在！");
              break;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    createXML(i) {
      var pic_id = this.name[i].split(".");
      this.$axios({
        method: "post",
        url: "/api/file/createXML",
        data: {
          task_id: this.taskId,
          demo: "demo.xml",
          picture_id: pic_id[0],
        },
      })
        .then((res) => {
          switch (res.data) {
            case 0:
              alert("生成PASCAL VOC格式的XML文件 " + pic_id[0] + ".xml！");
              break;
            case -1:
              alert("标注不存在！");
              break;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
.oneTask {
  padding: 20px;
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
  .inline {
    display: inline-block;
  }
}
</style>