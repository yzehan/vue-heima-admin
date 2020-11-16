<template>
  <div class="image-container">
    <div class="action-head">
      <el-radio-group v-model="collect" size="mini" @change="loadImages(1)">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button v-if="isShowAdd" type="success" size="mini" @click="uploadImg = true"
        >上传素材</el-button
      >
    </div>

    <!-- 图片内容 -->
    <el-row :gutter="10" margin="20px">
      <el-col
        :xs="12"
        :sm="6"
        :md="6"
        :lg="4"
        v-for="(img, index) in images"
        :key="index"
        class="image-item"
        @click.native="selected = index"
      >
        <el-image
          style="height: 100px"
          :src="img.url"
          :fit="fit"
          :preview-src-list="srcList"
        ></el-image>
        <!-- 选择图片 -->
        <div class="selected" v-if="isShowSelected && selected === index">

        </div>
        <div class="image-action" v-if="isShowAction">
          <el-button
            :loading="img.loading"
            type="warning"
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            size="small"
            circle
            @click="onCollect(img)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            circle
            @click="onDelete(img)"
            :loading="img.loading"
          ></el-button>
          <!-- <i @click="onCollect(img)" :class="{'el-icon-star-off': img.is_collected, 'el-icon-star-on': !img.is_collected}"></i> -->
          <!-- <i class="el-icon-delete"></i> -->
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      @current-change="onpageChange"
      :current-page.sync="page"
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
    >
    </el-pagination>

    <!-- 弹出层 -->
    <el-dialog
      title="上传图片"
      :visible.sync="uploadImg"
      :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        multiple
        :headers="uploadHeaders"
        name="image"
        :on-success="onuploadsuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import { getImages, collectImage, deleteImage } from "@/api/image";
export default {
  name: "ImageIndex",
  components: {},
  props: {
    isShowAdd: {
      type: Boolean,
      default: true
    },
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      collect: "false",
      url: "",
      srcList: [],
      fit: "cover",
      images: [],
      uploadImg: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      totalCount: 0,
      pageSize: 20,
      page: 1,
      selected: null  // 选中的索引
    };
  },
  computed: {},
  wacth: {},
  created() {
    // 页面初始化
    this.loadImages(1);
  },
  mouted() {},
  methods: {
    loadImages(page) {
      this.page = page;
      getImages({ collect: this.collect, page, per_page: this.pageSize }).then(
        (res) => {
          const results = res.data.data.results;
          // 手动添加loading
          results.forEach((img) => {
            img.loading = false;
          });
          this.images = results;
          this.totalCount = res.data.data.total_count;
        }
      );
    },
    oncollectChange(value) {
      this.loadImages(1);
    },
    onuploadsuccess() {
      // 关闭上传弹窗
      this.uploadImg = false;
      // 刷新列表
      this.loadImages(this.page);
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    onpageChange(page) {
      this.loadImages(page, false);
    },
    onCollect(img) {
      // 展示loading
      img.loading = true;
      // 已收藏，取消收藏、添加收藏
      collectImage(img.id, !img.is_collected).then((res) => {
        img.is_collected = !img.is_collected;
        // 关闭loading
        img.loading = false;
      }); //取反调用
    },
    onDelete(img) {
      img.loading = true;
      deleteImage(img.id).then((res) => {
        // 重新加载页面
        this.loadImages(this.page);
        img.loading = false;
      });
    },
  },
};
</script>

<style lang='less' scoped>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-item {
  position: relative;
}
.image-action {
  font-style: 35px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: red;
  background: rgba(255, 255, 255, 0.5);
  height: 40px;
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}

.selected {
  background: url(./yes.png) no-repeat;
  background-size: cover;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;left: 0;
  display: flex;
  justify-items: center;
  align-items: center;
}
</style>