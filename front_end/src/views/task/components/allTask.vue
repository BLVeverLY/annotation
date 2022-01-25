<template>
  <div class="allTask">
    <div class="head">
      <p>{{ type.title }}</p>
      <p>{{ type.describe }}</p>
    </div>
    <br />

    <el-button
      type="primary"
      style="background: #5cb85c; padding: 12px 25px"
      @click="createtask()"
      >创建任务</el-button
    >
    <br />
    <div slot="tip" class="el-upload__tip">任务命默认为 task+"task_id"</div>
    <!-- <router-link @click.native="check_login" to="/upload"
        >创建任务</router-link -->

    <br /><br />
    <!-- <router-link to="/download">下载</router-link> -->

    <div class="task" v-for="task in tasks" :key="task.task_id">
      <div class="title">
        <h1>
          <router-link
            :to="{ name: 'onetask', params: { taskId: task.task_id } }"
            >任务名：{{ task.name }}</router-link
          >
        </h1>
        <div class="account">
          <p>任务创建者：{{ task.account }}</p>
        </div>
      </div>
      <div class="content">
        <p>TASK ID: {{ task.task_id }}</p>
        <span
          ><router-link
            :to="{ name: 'onetask', params: { taskId: task.task_id } }"
            >进行标注>></router-link
          ></span
        >
        <hr />
        <div class="bottom">
          <div class="bottomTag">
            <span class="iconfont icon-tag1"></span>
            <span>是否已标注：{{ task.tagged ? "是" : "否" }}</span>
          </div>
          <div class="more">
            <!-- <el-button type="primary" @click="createtask()">创建任务</el-button>
            <el-button type="primary" @click="createtask()">创建任务</el-button> -->
            <router-link to="">下载JSON文件</router-link>
            <router-link to="">下载COCO文件</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "allTask",
  props: ["tasks", "type"],
  data() {
    return {};
  },
  created() {},
  methods: {
    createtask() {
      if (localStorage.getItem("account")) {
        this.$axios({
          method: "post",
          url: "/api/annotation/createTask",
          data: {
            account: localStorage.getItem("account"),
          },
        })
          .then((res) => {
            this.taskUrl = res.data;
            alert("创建任务" + this.taskUrl + "成功");
          })
          .catch((err) => {
            alert(err);
          });
        this.$router.push("/upload");
      } else {
        alert("请先登录！");
      }
    },
  },
};
</script>

<style scoped lang="less">
.allTask {
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
  //新建任务样式
  .new {
    height: 30px;
    line-height: 30px;
    padding: 5px 20px;
    border-radius: 3px;
    display: inline-block;
    background: #5cb85c;
    position: absolute;
    left: 20px;
    a {
      color: white;
    }
  }
  /*文章样式*/
  .task {
    margin: 20px 0;
    padding: 20px 20px 15px;
    box-sizing: border-box;
    background: white;
    .title {
      display: flex;
      border-bottom: 1px solid;
      min-height: 50px;
      line-height: 50px;
      h1 {
        flex: 4;
        font-size: 1.3rem;
        a {
          text-decoration: none;
          color: black;
          transition: all 0.5s;
        }
      }
      .account {
        flex: 1;
        text-align: right;
        vertical-align: middle;
        span {
          vertical-align: middle;
        }
      }
    }
    .title:hover a {
      margin-left: 15px;
      color: orange;
    }
    .content {
      margin: 20px 0 0;
      p {
        margin-bottom: 30px;
      }
      a {
        color: orange;
        text-decoration: none;
      }
      hr {
        margin: 15px 0;
      }
      /deep/ img {
        max-width: 100%;
      }
      .bottom {
        min-height: 30px;
        line-height: 30px;
        position: relative;
        .iconfont {
          font-size: 18px;
          margin-right: 5px;
          vertical-align: middle;
        }
        .bottomTag {
          display: inline-block;
          margin-right: 10px;
          .tag {
            min-width: 30px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background: #5bc0de;
            display: inline-block;
            margin: 0 10px;
            position: relative;
            border-radius: 0 2px 2px 0;
            color: white;
            padding: 0 5px;
            font-size: 13px;
            cursor: pointer;
          }
          .tag::after {
            width: 0;
            height: 0;
            content: "";
            position: absolute;
            left: -20px;
            border-right: 10px solid #5bc0de;
            border-left: 10px solid transparent;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
          }
        }
        .bottomType {
          display: inline-block;
        }
        .more {
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          border-radius: 3px;
          display: inline-block;
          background: #5cb85c;
          position: absolute;
          right: 10px;
          a {
            color: white;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .allArticle {
    padding: 20px 0;
    .article .title {
      display: block;
      .account {
        text-align: left;
      }
    }
    .article .content .bottom {
      display: flex;
      .bottomTag {
        flex: 5;
        .tag {
          margin: 0 8px;
        }
      }

      .bottomType {
        flex: 2;
      }
      .more {
        display: none;
      }
    }
  }
}
</style>