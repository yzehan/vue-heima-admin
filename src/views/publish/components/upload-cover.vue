<!--  -->
<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img
        class="cover-img"
        ref="cover-image"
        :src="value"
      />
    </div>
    <!-- 弹出层 -->
  <el-dialog
    title="选择封面"
    :visible.sync="dialogVisible"
    append-to-body
  >
    <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="素材库" name="first">
      <!-- 子组件 -->
      <!-- ref两个作用
      1.作用到html标签中可以获取DOM
      2.作用到组件标签上可以获取实例 -->
      <image-list ref="image-list" :is-show-selected="true" :is-show-add="false" :is-show-action="false"/>
    </el-tab-pane>
    <el-tab-pane label="上传图片" name="second">
      <input ref="file" type="file" @change="onFileChange">
      <img ref="preview-img" width="100">
    </el-tab-pane>
  </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
    </span>
  </el-dialog>
  </div>

  
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { uploadImage } from '@/api/image/'
import ImageList from '@/views/image/component/image-list'
export default {
  //import引入的组件需要注入到对象中才能使用
  name: "UploadCover",
  // props: ['cover-image'],
  props: ['value'],
  components: { ImageList },
  data() {

    ImageList    //这里存放数据
    return {
      dialogVisible: false,
      activeName: 'first'
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    showCoverSelect() {
      this.dialogVisible = true
    },
    handleClick() {

    },
    onFileChange() {
      const file = this.$refs.file.files[0]  // $refs.file 拿到当前操作的dom .files[0]  拿到当前选择的图片
      
      const blob = window.URL.createObjectURL(file)

      //将拿到的图片对象赋值给当前平台的src
      this.$refs['preview-img'].src = blob 
      // 解决选择同一张图片不触发此函数的问题
      // this.$refs.file.value = ''
    },
    onCoverConfirm() {
      
      // 如果tab 在上传文件  并且上传克文件才执行上传
      if(this.activeName === 'second') {  // 判断是否室当前上传的tab
        const file = this.$refs.file.files[0]
        if(!file) { // 判断是否选择了图片
          this.$message('请选择图片')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          console.log(res);
          // 关闭弹出层
          this.dialogVisible = false
          //显示图片
          this.$refs['cover-image'].src = res.data.data.url  // 上传成功后得到的图片地址
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        console.log(imageList.selected)
        const selected = imageList.selected
        if(selected === null) {
          this.$message('请选择图片')
          return
        }
        //否则就是选择了图片则关闭对话框  执行上传  修改并传递给父组件该数据

        this.dialogVisible = false
        this.$emit('input', imageList.images[selected].url)


      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.cover-wrap {
  width: 200px;
  height: 120px;
  border: 1px solid #000;
  .cover-img {
    height: 120px;
    min-width: 100%;
  }
}
</style>