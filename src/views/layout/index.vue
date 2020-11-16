<template>
	<el-container class="layout-container">
  <el-aside class="aside" width="auto">
		<app-aside :is-collapse="isCollapse"/>
	</el-aside>
  <el-container>
    <el-header class="header">
			<div>
				<i @click="isCollapse=!isCollapse" :class="{
					'el-icon-s-unfold': isCollapse,
					'el-icon-s-fold': !isCollapse
				}"></i>
				<span>人生有限责任公司</span>
			</div>
    	<el-dropdown trigger="click">
				<span class="el-dropdown-link">
					<img class="avatar" :src="user.photo" alt="">
					<span>{{ user.name }}</span>
					<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item icon="el-icon-s-tools">设置</el-dropdown-item>
					<el-dropdown-item icon="el-icon-circle-close" @click.native="onLogout">退出</el-dropdown-item>
				</el-dropdown-menu>
    	</el-dropdown>
		</el-header>
    <el-main class="main">
			<router-view/>
		</el-main>
  </el-container>
</el-container>
</template>
<script>
import AppAside from "./component/aside"
import {getUserProfile} from '@/api/user'
import globalBus from '@/utils/global-bus'
export default {
	name: 'LayoutIndex',
	components: {
		AppAside
	},
	props: {},
	data() {
		return {
			 user: {},   //当前用户登录信息
			 isCollapse: false

		}
	},
	computed: {},
	wacth: {},
	created() {
		// 组件初始化好，获取用户资料
		this.loadUserProfile()
		globalBus.$on('updata-user', data =>{
			console.log(data);
			this.user.name = data.name
			this.user.photo = data.photo
		})
	},
	mounted() {},
	methods: {
		//除了登录接口，其他接口都需要获取身份令牌
		loadUserProfile () {
			getUserProfile().then(res => {
				this.user = res.data.data
			})
		},
		onLogout () {
			// 添加一个退出提示按钮
			this.$confirm('退出登录状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
							// 清除用户登录状态
					window.localStorage.removeItem('user')

					// 跳转到登录页面
					this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出登录'
          });          
        });


			
		}
	}
		


}
</script>

<style lang='less' scoped>
.layout-container{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
.aside{
	background-color: #002033
}
.header{
	
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #ccc;
}
.el-dropdown-link{
	display: flex;
	justify-items: center;
	align-items: center;
	.avatar{
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 5px;
	
}
}

	

</style>