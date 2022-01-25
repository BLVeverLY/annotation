<template>
  <div>
    <br />
    <div class="bottom">
      <el-upload
        action="http://127.0.0.1:3000/api/annotation/uploadPicture"
        multiple
        list-type="picture"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button type="primary">上传图片</el-button>
        <div slot="tip" class="el-upload__tip">
          请上传图片格式文件，且不超过2M
        </div>
      </el-upload>
      <br /><br /><br />

      <el-upload
        action="http://127.0.0.1:3000/api/annotation/uploadVideo"
        accept=".mp4"
        :on-success="handleVideoSuccess"
        :before-upload="beforeUploadVideo"
        :on-progress="uploadVideoProcess"
      >
        <!-- <video
          v-if="videoPath != '' && !videoFlag"
          :src="videoPath"
          class="avatar video-avatar"
          controls="controls"
        >
          您的浏览器不支持视频播放
        </video>
        <i v-else-if="videoPath == '' && !videoFlag"></i> -->
        <el-progress
          v-if="videoFlag == true"
          type="circle"
          :percentage="videoUploadPercent"
          style="margin-top: 30px"
        ></el-progress>
        <el-button slot="trigger" v-if="isShowUploadVideo" type="primary"
          >上传视频</el-button
        >
        <div v-if="isShowUploadVideo" slot="tip" class="el-upload__tip">
          请保证视频格式正确，且不超过250M
        </div>
        <div v-if="isShowUploadVideo" slot="tip" class="el-upload__tip">
          会每间隔若干帧自动提取图片作并展示在任务中
        </div>
      </el-upload>

      <br /><br /><br />
      <h1>
        <router-link :to="{ name: 'task' }">返回</router-link>
      </h1>
    </div>
  </div>
</template>
 
<script>
export default {
  components: {},
  data() {
    return {
      // 图片有关参数
      imageUrl: "",
      taskUrl: "",
      // 视频有关参数
      uploadUrl: "", //你要上传视频到你后台的地址
      videoFlag: false, //是否显示进度条
      videoUploadPercent: "", //进度条的进度，
      isShowUploadVideo: true, //显示上传按钮
      videoPath: "", //视频地址
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //上传前回调
    beforeUploadVideo(file) {
      //上传文件的大小
      const isLt250M = file.size / 1024 / 1024 < 250;
      //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb','video/mp4' 可支持上传的视频类型
      if (["video/mp4"].indexOf(file.type) == -1) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt250M) {
        this.$message.error("上传视频大小不能超过250MB哦!");
        return false;
      }
      this.isShowUploadVideo = false;
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    //上传成功回调
    handleVideoSuccess(res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      // if (res.errorCode == "00") {
      //   //res.sprbody.urlAddress 后台返回的上传视频的地址，具体情况视自己代码定
      //   this.videoPath = res.sprbody.urlAddress;
      //   // this.videoForm.showVideoPath = res.data.uploadUrl;
      // } else {
      //   this.$message.error("视频上传失败，请重新上传！");
      // }
    },
  },
};
</script>
 
<style lang="less"  scoped>
.bottom {
  height: 30px;
  line-height: 30px;
  padding: 5px 20px;
  border-radius: 3px;
  display: inline-block;
  // background: #5cb85c;
  position: absolute;
  left: 20px;
  a {
    color: white;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>