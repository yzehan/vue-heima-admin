<!--  -->
<template>
  <div class="setting-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- from表单 -->
      <el-row>
        <el-col :span="15">
          <el-form
            :rules="formRules"
            ref="user"
            :model="user"
            label-width="80px"
          >
            <el-form-item label="编号">{{ user.id }}</el-form-item>
            <el-form-item label="手机">{{ user.mobile }}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>

            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="lodingUserProfile"
                type="primary"
                @click="onUpDataUser"
                >保存</el-button
              >
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 头像显示区域 -->
        <el-col :span="4" :offset="2">
          <!-- <p @click="$refs.file.click()">点击修改</p> -->
          <label for="file">
            <el-avatar shape="square" :size="150" fit="cover" :src="user.photo">
            </el-avatar>
            <p>点击修改</p>
          </label>
          <input
            type="file"
            name=""
            id="file"
            ref="file"
            @change="onFileChange"
            hidden
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 弹出层 -->
    <el-dialog
      @opened="onDialogOpened"
      @closed="onDialogClosed"
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <div class="preview-image-wrap">
        <img class="preview-image" :src="preViewImage" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="loadingPtoto" type="primary" @click="onUpdataPhoto"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile,
} from "@/api/user/";
import globalBus from "@/utils/global-bus";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

export default {
  name: "SettingIndex",
  props: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      user: {
        email: "",
        id: null,
        intro: "",
        mobile: "",
        name: "",
        photo: "",
      },
      dialogVisible: false,
      preViewImage: "",
      cropper: null, //初始化裁切器实例  默认状态
      loadingPtoto: false,
      lodingUserProfile: false,
      formRules: {
        name: [
          { required: true, message: "请输入媒体名称", trigger: "blur" },
          { min: 1, max: 7, message: "长度1-7个字符之间", trigger: "change" },
        ],
        intro: [
          { required: true, message: "请输入媒体介绍", trigger: "blur" },
          { min: 0, max: 25, message: "长度0-60个字符之间", trigger: "change" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: "请输入正确邮箱格式",
            trigger: "change",
          },
        ],
      },
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    onUpDataUser() {
      //验证表单

      //提交表单
      this.lodingUserProfile = true;
      const { name, intro, email } = this.user;
      updateUserProfile({
        name,
        intro,
        email,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "更新资料成功",
        });
        this.lodingUserProfile = false;

        // 发布通知
        globalBus.$emit("updata-user", this.user);
      });
    },
    loadUser() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onFileChange() {
      // 处理图片预览
      const file = this.$refs.file;

      const blobData = window.URL.createObjectURL(file.files[0]);

      this.preViewImage = blobData;
      //  解决只有input里面的内容发生改变时才会触发
      this.$refs.file.value = ''
      // 展示弹出层
      this.dialogVisible = true;
    },
    onDialogOpened() {
      const image = this.$refs["preview-image"];
      // 初始化裁切器
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        // crop(event) {
        //   console.log(event.detail.x);
        //   console.log(event.detail.y);
        //   console.log(event.detail.width);
        //   console.log(event.detail.height);
        //   console.log(event.detail.rotate);
        //   console.log(event.detail.scaleX);
        //   console.log(event.detail.scaleY);
        // },
      });
    },
    onDialogClosed() {
      // 关闭弹出层时动画结束那一刻调用此函数
      this.cropper.destroy();
    },
    //  提交上传裁切后的图片
    onUpdataPhoto() {
      this.loadingPtoto = true;
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const fd = new FormData();
        fd.append("photo", blob);
        //  请求根性用户头像提交fd
        updateUserPhoto(fd).then((res) => {
          //提交成功关闭弹出层
          this.dialogVisible = false;
          // 更新头像显示
          this.user.photo = window.URL.createObjectURL(blob);
          // this.user.photo = res.data.data.photo
          this.loadingPtoto = false;
          this.$message({
            type: "success",
            message: "修改头像成功",
          });
          // 发布通知
          globalBus.$emit("updata-user", this.user);
        });
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.loadUser();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
  }
}
</style>