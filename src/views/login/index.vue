<template>
  <div class="login-container">
    <div class="login-head"></div>
    <!-- 
      配置表单验证 
      1·必须给 el-feom 组件绑定 model 为表单数据对象
      2.给需要验证的表单项 el-from-item 绑定prop属性（prop需要指定表单对象中的数据名称）
      3.通过 el-from 中的 rules 属性配置验证规则


      需要在提交登录的时候手动触发一次表单验证，以免不必要的请求登录
      1.给 el- from 设置 ref
      2.通过r ref 获取 el -from 组件，调用组件的 validate 方法进行验证
      -->

    <el-form
      class="login-form"
      ref="login-form"
      :model="user"
      :rules="formRules"
    >
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          ><p>我已阅读并同意用户协议和隐私条款</p></el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="loginLoading"
          @click="onLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login} from '@/api/user' // { 表示的按需加载，可以添加其他的函数  比如user.js里面封装的其他函数  getUserInfo();  等等 }
export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: "",
        agree: false
      },
      //checked: false, // 协议选中状态
      loginLoading: false,
      formRules: {
        // 表单验证规则属性
        mobile: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            pattern: /^1[3|4|5|6|7|8|9|]\d{9}$/,
            message: "请输入正确手机号",
            trigger: "change",
          },
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "change" },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确验证码",
            trigger: "change",
          },
        ],
        agree: [
          //自定义校验规则
          { validator: (rule, value, callback) =>{
            if(value){
              callback()
            }else{
              callback( new Error('请同意用户协议'))
            }
          },
          message: "请勾选同意用户协议",
          trigger: "change" }
        ]
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onLogin() {
      // 获取表单数据（根据接口）绑定数据
      //const user = this.user;
      // 表单验证
      this.$refs["login-form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 验证通过 提交登录
        this.login();
      });
    },
    login() { 
      this.loginLoading = true;
      login(this.user)//此处的login是在user.js中封装的，在此调用，传入参数
        .then((res) => {
          console.log(res);
          this.$message({
            message: "登录成功",
            type: "success",
          });
          //关闭loading
          this.loginLoading = false;
          // 讲获取的数据存到本地
          // 本地存储只能存字符串，
          window.localStorage.setItem('user', JSON.stringify(res.data.data))


          // 跳转到首页
          this.$router.push({
            name: 'home'
          })
        })
        .catch((err) => {
          console.log("登录失败", err);
          this.$message.error("登录失败");
          //关闭loading
          this.loginLoading = false;
        });
      // 处理后端响应结果  成功或失败
    },
  },
};
</script>
<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./bj01.jpg") no-repeat;
  background-size: cover;
}

.login-form {
  background-color: #fff;
  opacity: 0.8;
  border-radius: 10px;
  padding: 50px;
  min-width: 300px;
  .login-btn {
    width: 100%;
  }
}
</style>
