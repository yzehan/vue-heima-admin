<template>
  <div class="image-container">
    <el-card class="box-card">
      <!-- 头 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 图片列表 -->
      <image-list />
    </el-card>  
  </div>
</template>
<script>
import ImageList from "./component/image-list";
export default {
  name: "ImageIndex",
  components: { ImageList },
  props: {},
  data() {
    return {
      
    };
  },
  computed: {},
  wacth: {},
  created() {},
  mouted() {},
  methods: {},
};
</script>

<style lang='less' scoped>

</style>