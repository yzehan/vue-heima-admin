// 封装axios
import axios from 'axios'
import JSONbig from 'json-bigint'

// axios()
// axios.get()
// axios.oost()

// 创建一个axios实例
// 通过实例去发送请求，把需要的配置   配置给这个实例

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  //  定制后端返回原始数据的处理
  transformResponse: [function (data) {

   // 默认返回 data return data;
    // 处理异常
    try {
      return JSONbig.parse(data)
    } catch (err){
      return data
    }

    
  }]
})


//请求拦截器

request.interceptors.request.use(
  
  //config是当前请求配置的相关信息
  function (config) {
    // 获取本地存储的用户登录数据
    const user = JSON.parse(window.localStorage.getItem('user'))



    //再请求出去之前设置出去的条件
    if(user){
      config.headers.Authorization = `Bearer ${user.token}`
    }


    // 请求成功
    return config

  },
  function (error) {
    //请求失败
    return Promise.reject(error)

  }
)
  





// 到处请求方法

export default request

// 谁要使用税就加载
// import request from 'request.js'
