<template>
  <el-menu
		class="nav-menu"
    :default-active="$route.path"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
		router
    :collapse="isCollapse"
  >
    <el-menu-item index="/">
      
        <i class="iconfont icon-shouye"></i>
        <span>首页</span>
      
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="iconfont icon-neirong"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icon-sucai"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont icon-16"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
		<el-menu-item index="/comment">
      <i class="iconfont icon-pinglun1"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
		<el-menu-item index="/fans">
      <i class="iconfont icon-fensi"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
		<el-menu-item index="/setting">
      <i class="iconfont icon-geren1"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
	name: 'AppAside',
	components:{},
	props: ['is-Collapse'],
	data() {
		return {
      // isCollapse: true
		}
	},
	computed: {},
	wacth: {},
	created() {},
	mounted() {},
	methods: {
	}

}
</script>
<style lang="less" scoped>
.nav-menu{
	.iconfont{
		margin-right: 5px;
	}
}
</style>