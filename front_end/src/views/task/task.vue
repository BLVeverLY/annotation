<template>
  <all-task :tasks="tasks" :type="type"></all-task>
</template>

<script>
import allTask from "./components/allTask";

export default {
  name: "task",
  components: {
    allTask,
  },
  data() {
    return {
      tasks: [
        // {
        //   name: "任务1",
        //   account: "654321",
        //   task_id: `<br>task ID: 1`,
        // },
      ],
      type: {
        title: "任务页面",
        describe: "这里用于查看现有任务和创建新的任务",
      },
    };
  },
  created() {
    this.$axios({
      method: "post",
      url: "/api/annotation/getAllTask",
      data: {},
    })
      .then((res) => {
        this.tasks = res.data;
      })
      .catch((err) => {
        alert(err);
      });
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
</style>