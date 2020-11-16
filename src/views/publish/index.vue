<template>
  <div class="publish-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- from表单 -->
      <el-form
        ref="publish-form"
        :rules="formRules"
        :model="article"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="100%"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 子组件 -->
          <!-- 需要吧子组件里面的image传到父组件article.cover.images中 -->
          <!-- 当父组件不仅提供给子组件数据而且呀修改子组件数据时，
            可以使用v-model 简化数据绑定
            v-model="article.cover.images[index]" 给子组件传递了一个名字叫value的数据
            :value="article.cover.images[index]"

            默认绑定input事件 当事件发生  他会让绑定数据 = 事件参数
            @input="article.cover.images[index]"
            -->
          <template v-if="article.cover.type > 0">
            <!-- <upload-cover
              @update-cover="onUpdateCover(index, $event)"
              :key="cover"
              :cover-image="article.cover.images[index]"
              v-for="(cover, index) in article.cover.type"
            /> -->
            <upload-cover
              :key="cover"
              v-for="(cover, index) in article.cover.type"
              v-model="article.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">保顿到草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import uploadCover from "./components/upload-cover";
import {
  getArticlesChannals,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article";
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Image,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
} from "element-tiptap";
import { uploadImage } from "@/api/image";
import UploadCover from "./components/upload-cover.vue";

export default {
  name: "PublishIndex",
  components: {
    "el-tiptap": ElementTiptap,
    uploadCover,
  },
  props: {},
  data() {
    return {
      channels: [],
      article: {
        title: "",
        content: "",
        cover: {
          type: 1, //封面类型
          images: [], //图片
        },
        channel_id: null,
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          // 默认会把图片生生base64编码
          // 用图床的方式上传图像
          uploadRequest(file) {
            const fd = new FormData();
            fd.append("image", file);
            return uploadImage(fd).then((res) => {
              return res.data.data.url;
            });
          },
        }),
      ],
      formRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 5, max: 25, message: "长度5-25个字符之间", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "<p></p>") {
                callback(new Error("请输入文章内容"));
              } else {
                callback();
              }
            },
          },
        ],
        channel_id: [{ required: true, message: "请选择频道" }],
      },
    };
  },
  computed: {},
  wacth: {},
  created() {
    this.loadChannels();
    // 如果请求路径中存在文章id，则说明室修改文章，即展示文章标题和内容
    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  mouted() {},
  methods: {
    onPublish(draft) {
      // 提交之前先验证表单
      this.$refs["publish-form"].validate((valid) => {
        if (!valid) {
          // 失败
          return;
        }

        //通过

        // 共用模板，首先得判断当前操作是修改还是发布
        if (this.$route.query.id) {
          updateArticle(this.$route.query.id, this.article, draft)
            .then((res) => {
              this.$message({
                type: "success",
                message: `${draft ? "存入草稿" : "修改"}成功`,
              });
              this.$router.push("/article");
            })
            .catch((err) => {
              this.$message.error("修改失败");
            });
        } else {
          addArticle(this.article, draft)
            .then((res) => {
              this.$message({
                type: "success",
                message: `${draft ? "存入草稿" : "发布"}成功`,
              });
              this.$router.push("/article");
            })
            .catch((err) => {
              this.$message.error("发布失败");
            });
        }
      });
    },
    loadChannels() {
      getArticlesChannals().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    // 加载 当前文章内容
    loadArticle() {
      getArticle(this.$route.query.id).then((res) => {
        console.log(res);
        this.article = res.data.data;
      });
    },
    onUpdateCover(index, url) {
      console.log(index, url);
      this.article.cover.images[index] = url;
    },
  },
};
</script>

<style lang='less' scoped>
</style>