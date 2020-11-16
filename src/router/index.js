import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image/'
import Comment from '@/views/comment/'
import Setting from '@/views/setting/'
import Fans from '@/views/fans/'
// @是src目录的缩写
Vue.use(VueRouter)
// 路由配置
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login

  },
  {
    path: "/",
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/setting',
        name: 'setting',
        component: Setting
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes

})

// 路由守卫,所有的页面导航都会经过这里（路由拦截器）
// to 去往哪里，feom来自哪里。next放行
router.beforeEach((to, from, next) =>{
  // 获取本地存储的token
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 如果没有登录
  if(to.path !== '/login') {
    //校验登录状态
    if(user){ //如果user存在，说明已登录，即放行
      next()
    }else{// 如果user不存在，即跳转至登录页面
      next('/login')
    }
  }else{
    next()
  }


})


export default router
