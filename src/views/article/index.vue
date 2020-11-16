<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- from表单 -->
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :key="index"
              v-for="(channel, index) in channels"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button :disabled="loading" type="primary" @click="loadArticles(1)">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件查询到{{ totalCount }}条数据
      </div>
      <!-- 数据列表 -->
      <!-- table表格的数据渲染
      1.将需要渲染的数据绑定给table的data属性
      2.改一下表格列
      3.prop 用来设定要渲染的数据字段
      
      
       -->
      <el-table
        v-loading="loading"
        :data="articles"
        size="medium"
        style="width: 100%"
      >
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline">暂无图片</i>
              </div>
            </el-image>
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="articles-cover"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img v-else class="articles-cover" src="./no-cover.jpg" alt="" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="articlesStatus[scope.row.status].type">{{
              articlesStatus[scope.row.status].text
            }}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 3" type="info">审核失败</el-tag>
            <el-tag v-if="scope.row.status === 4" type="warning">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              circle
              @click="onDeleleArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next"
        :disabled="loading"
        background
        :total="totalCount"
        @current-change="onCurrentChange"
        :page-size="pageSize"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticles, getArticlesChannals, deleteArticle } from "@/api/article";
export default {
  name: "ArticleIndex",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      articles: [], //文章数据列表
      articlesStatus: [
        { status: 0, text: "草稿", type: "info" },
        { status: 1, text: "待审核", type: " " },
        { status: 2, text: "审核通过", type: "success" },
        { status: 3, text: "审核失败", type: "warning" },
        { status: 4, text: "已删除", type: "danger" },
      ],
      totalCount: 0, //总数据条数
      pageSize: 20, //页面显示条数
      status: null, // 文章的状态
      channels: [],
      channelId: null,
      rangeDate: null, //帅选范围的日期
      loading: true,
      page: 1 //当前页码
    };
  },
  computed: {},
  wacth: {},
  created() {
    this.loadArticles();
    this.loadChannels();
  },
  mouted() {},
  methods: {
    loadArticles(page) {
      (this.loading = true),
        getArticles({
          page,
          per_page: this.pageSize,
          status: this.status,
          channel_id: this.channelId,
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, //开始日期
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null, //结束日期
        }).then((res) => {
          this.articles = res.data.data.results; // 将获取到的数据赋值给articles这个空数组里
          this.totalCount = res.data.data.total_count;
          this.loading = false;
        });
    },
    onCurrentChange(page) {
      this.loadArticles(page);
    },
    loadChannels() {
      getArticlesChannals().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    onDeleleArticle(articleId) {
      console.log(articleId.toString())
      this.$confirm('删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					deleteArticle(articleId.toString()).then(res => {
            console.log(res)
            //删除成功，更新当前列表
            this.loadArticles(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      // 找到数据借口
      // 封装请求方法
      // 调用请求
      // 处理响应结果
    }
  },
};
</script>

<style lang='less' scoped>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-top: 20px;
}
.articles-cover {
  width: 100px;
  background-size: cover;
}
</style>