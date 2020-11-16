<template>
  <div class="comment-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- from表单 -->
      <el-table class="table-list" :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="comment_status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.statusDisabled"
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onstatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[100, 200, 300, 400]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticles, updateCommentStatus } from "@/api/article/";
export default {
  name: "commentIndex",
  components: {},
  props: {},
  data() {
    return {
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
      articles: [],
      totalCount: 0, // 总数据条数
      pageSize: 10,
      page: 1
    };
  },
  computed: {},
  wacth: {},
  created() {
    this.loadArticles();
  },
  mouted() {},
  methods: {
    handleCurrentChange(page) {
      //页码改变加载指定页码数据
      this.loadArticles(page)
    },
    handleSizeChange() {},
    loadArticles(page= 1) {
      getArticles({
        response_type: "comment",
        page,
        per_page: this.pageSize
      }).then((res) => {
        const go = res.data.data.results
        go.forEach(article => {
          article.statusDisabled = false
        });
        this.articles = go;
        this.totalCount = res.data.data.total_count
      });
    },
    onstatusChange(article) {
      //禁用开关
      article.statusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then( res=> {
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启成功' : '关闭成功'
        })
      })
      
    },
  },
};
</script>

<style lang='less' scoped>
.table-list {
  margin-bottom: 30px;
}
</style>