<template>
  <el-button type="primary" @click="handleBatchDownload()">
    {{ this.name }}</el-button
  >
</template>
 
<script>
// import axios from "axios";
import JSZip from "jszip";
import FileSaver from "file-saver";

export default {
  name: "download",
  props: ["taskId", "name", "filetype"],
  created() {},
  methods: {
    getFile(url) {
      return new Promise((resolve, reject) => {
        this.$axios({
          method: "get",
          url,
          //responseType: "blob",
          responseType: "arraybuffer", //必须加这个！这种方式可以下载txt、png、mp4、tif、docx、pptx、xlsx、pdf等格式数据
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error.toString());
          });
      });
    },

    handleBatchDownload() {
      var dataPathArr = [
        // "http://localhost:3000/static/file/task3/2.json",
      ]; // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
      var cnt = 0;
      this.$axios({
        method: "post",
        url: "/api/file/getAllFile",
        data: { task_id: this.taskId },
      })
        .then((res) => {
          var fileName = res.data;
          var fileNameArray = fileName.split(";");
          for (var i = 0; i < fileNameArray.length; i++) {
            var spl = fileNameArray[i].split(".");
            if (spl[1] == this.filetype) {
              dataPathArr[cnt++] =
                "http://localhost:3000/static/file/task" +
                this.taskId +
                "/" +
                fileNameArray[i];
            }
          }
          const zip = new JSZip();
          const cache = {};
          const promises = [];
          dataPathArr.forEach((item) => {
            const promise = this.getFile(item).then((data) => {
              // 下载文件, 并存成ArrayBuffer对象
              const arr_name = item.split("/");
              const file_name = arr_name[arr_name.length - 1]; // 获取文件名
              zip.file(file_name, data, { binary: true }); // 逐个添加文件
              cache[file_name] = data;
            });
            promises.push(promise);
          });
          // Promise.all可以将多个Promise实例包装成一个新的Promise实例。
          // 同时，成功和失败的返回值是不同的，成功的时候返回的是一个结果数组，
          // 而失败的时候则返回最先被reject失败状态的值。
          Promise.all(promises).then(() => {
            zip.generateAsync({ type: "blob" }).then((content) => {
              // 生成二进制流
              FileSaver.saveAs(content, "打包下载.zip"); // 利用file-saver保存文件
            });
          });
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
 
<style>
</style>