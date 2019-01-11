<template>
  <div class="message-main">
    <el-form label-width="100px" size="small">
      <div class="row-hd">
        <i class="icon-pic"></i>上传物料
      </div>
      <div class="row-bd">
        <el-form-item label="上传文档：">
          <div class="page">
            <div id="filePicker">选择文件</div>
            <span class="success fl" v-if="fileUpload">上传成功<i class="icon-success el-icon-check"></i></span>
            <div class="file-panel">
              <div class="file-list">
                <ul class="file-item" :class="`file-${file.id}`" v-for="file in fileList" :key="file.id">
                    <li class="file-type" :icon="fileCategory(file.ext)"></li>
                    <li class="file-name">{{file.name}}</li>
                    <li class="file-size">{{fileSize(file.size)}}</li>
                    <li class="file-status">点击开始上传</li>
                    <li class="file-operate">
                        <a title="开始" @click="resume(file)"><i class="iconfont icon-bofang"></i></a>
                        <a title="暂停" @click="stop(file)"><i class="iconfont icon-zanting"></i></a>
                        <a title="移除" @click="remove(file)"><i class="iconfont icon-clear2"></i></a>
                    </li>
                    <li class="progress"></li>
                </ul>
              </div>
            </div>

            <vue-upload
              :url="uploadUrl"
              :token="token"
              :file_md5="file_md5"
              :block_info="block_info"
              ref="uploader"
              uploadButton="#filePicker"
              multiple
              @fileChange="fileChange"
              @progress="onProgress"
              @success="onSuccess"
            ></vue-upload>
        </div>
        </el-form-item>

        <el-form-item label="上传预览图：" class="pt15">
          <el-upload
            class="uploader fl"
            :show-file-list="false"
            :action="uploadImgUrl | splicingBASEURL"
            :on-success="onUploadSuccess"
            :headers="headers"
            :on-error="onUploadError"
            list-type="picture"
            :auto-upload="true"
            :before-upload="beforeUpload">
            <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
            <i  v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
          <div class="videoUpload clearfix">
            <span class="success fl" v-if="imgSuccess">上传成功<i class="icon-success el-icon-check"></i></span>
            <span class="fail fl" v-if="imgFail">上传失败</span>
            <span class="loading fl" v-if="imgLoad">正在上传...</span>
            <el-button class="preview" type="text" @click="handlePictureCardPreview" :disabled="!formData.imageUrl">图片预览</el-button>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="formData.imageUrl" alt="">
            </el-dialog>
          </div>
        </el-form-item>
      </div>
      <div class="row-hd">
        <i class="icon-content"></i>信息编辑
      </div>
      <div class="row-bd">
        <el-form-item label="物料分类:">
          <el-select v-model="listData.class_id" placeholder="请选择物料分类" class="w160">
            <el-option v-for="(item) in types" :label="item.name" :value="item.id | toNumber" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称：">
          <el-input v-model="listData.name" class="w240" placeholder="请输入物料名称"></el-input>
        </el-form-item>
        <div class="btn-group search">
          <el-button size="small" plain type="primary" @click="save">保存</el-button>
          <el-button size="small" type="default" @click="cancel">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
/*
  广告素材审核
*/
import _ from 'lodash'
import { BASEURL } from '@/utils/constant'
import { appList, materialAdd, typeList2, customerList, docListDetail } from '@/service/message'
import { uploadSplitMerge, manualListDetail } from '@/service/study'
export default {
  name: 'studyCenterDoc',
  data () {
    return {
      customerList: customerList,
      formData: {
        type: 1,
        materielId: '',
        action: 2, // 1为修改,2为新增
        imageUrl: '',
      },
      listData: {
        class_id: '',
        fileUrl: '',
        size: '',
        name: ''
      },
      types: [],
      type: '3',
      fileUpload: false,
      fileSuccess: false,
      fileFail: false,
      fileLoad: false,
      imgSuccess: false,
      imgFail: false,
      imgLoad: false,
      uploadImgUrl: '/Manual/manualUploadFile',
      dialogVisible: false, // 预览图片是否可见
      // imageUrl: '',
      file_md5: '',
      block_info: [],
      fileList: [],
      uploadUrl: BASEURL + '/Manual/uploadSplitTmp'
    }
  },
  components: {
    vueUpload: () => import('@/components/upload/mutiUpload'),
  },
  created () {
    let { meta, query = {} } = this.$route
    let { type = 'create' } = meta
    let formData = {}
    let action
    switch (type) {
      // 编辑
      case 'edit':
        action = 1
        formData = {
          action: 1,
          materielId: query.id
        }
        break
      // 默认创建
      default:
        formData = {
          action: 2
        }
    }
    _.assign(this.$data, {
      formData: _.assign({}, this.$data.formData, formData)
    })
  },
  mounted () {
    this.getTypes()
    if (this.isEidt) {
      this.getDetail()
    }
    //this.getList()
  },
  computed:{
    headers () {
      return this.getToken()
    },
    // 判断是否是编辑
    isEidt () {
      let formData = this.$data.formData
      return formData.action === 1
    },
    uploader() {
        return this.$refs.uploader;
    },
    token () {
      return this.getToken().token
    }
  },
  methods: {
    getTypes: async function () {
      try {
        let result = await typeList2()
        this.types = result.list || []
      } catch (e) {
        this.$message.error(e.msg)
      }
    },
    getList: async function (query = {}) {
      try {
        let param = Object.assign(this.query, query)
        let result = await appList(param)
        Object.assign(this.$data, result)
      } catch (e) {
        this.$message({
          showClose: true,
          message: e.msg,
          type: 'warning'
        })
      }
    },
    getDetail: async function () {
      try {
        let query = {
          listType: '3',
          id: this.$data.formData.materielId
        }
        // 获取详情数据
        let result = await manualListDetail(query)
        // 解析数据
        let {
         imageUrl = '', type = _.first(customerList).key
        } = result || {}
        if(result.imageUrl){
          this.fileUpload = true
        }
        // 覆盖数据
        _.assign(this.$data, {
          formData: _.assign({}, this.$data.formData, {
            imageUrl: result.imageUrl,
            type: _.toInteger(type) // 类型转换
          }),
          listData: _.assign({},this.$data.listData,{
            fileUrl: result.fileUrl,
            name: result.name,
            class_id: _.toInteger(result.class_id),
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    save: async function (query = {}) {
      if(!this.listData.fileUrl){
        this.$message.warning('请上传文档')
        return
      }
      if(!this.formData.imageUrl){
        this.$message.warning('请上传预览图')
        return
      }
      if(!this.listData.class_id){
        this.$message.warning('请选择物料分类')
        return
      }
      if(!this.listData.name){
        this.$message.warning('物料名称不能为空')
        return
      }
      if(_.size(this.listData.name) > 16){
        this.$message.warning('物料名称不能大于16个字符')
        return
      }
      try {
        let param = Object.assign({
          imageUrl: this.formData.imageUrl,
          fileUrl: this.listData.fileUrl,
          class_id: this.listData.class_id,
          name: this.listData.name,
        },this.formData,this.listData, query)
        let result = await materialAdd(param)
        console.log('save==',result)
        if(result.code==200) this.$message.success('上传成功');
        this.$data.vedioSuccess = false;
        this.$data.imgSuccess = false;
        this.back();
      } catch (e) {
        let { msg } = e
        this.$message({
          showClose: true,
          message: msg,
          type: 'warning'
        })
      }
    },
    cancel(){
      this.back();
    },
    onUploadSuccess (res, file) {
    console.log('upload',res,file)
    this.formData.imageUrl = res.data;
    this.imgSuccess = true;
    console.log('success', this.formData.imageUrl)
    },
    // 图片预览
    handlePictureCardPreview(file) {
      if (this.formData.imageUrl) {
        this.dialogVisible = true;
      } else {
        this.$message.warning('请先上传封面!')
      }
    },
    onUploadError (res, file) {
      this.imgFail = true
      console.log('error', res, file)
    },
    beforeUpload (file) {
      if (/image\/(jpg|jpeg|png|gif)$/.test(file.type) === false) {
        this.$message.error('图片格式不对!')
        return false
      }
    },
    // 返回上一页
    back () {
      this.$router.replace({ name: 'studyCenter', query: {type: this.type}})
    },
    fileChange(file) {
      if (!file.size) return;
      this.fileList.push(file);
    },
    onProgress(file, percent) {
      $(`.file-${file.id} .progress`).css('width', percent * 100 + '%');
      $(`.file-${file.id} .file-status`).html((percent * 100).toFixed(2) + '%');
    },
    onSuccess (file, response) {
      console.log('上传成功', response);
      uploadSplitMerge({
          md5: file.wholeMd5,
          fileName: file.name
      }).then(res => {
        this.fileUpload = true
        this.listData.fileUrl = res.path
        this.listData.size = res.size
      });
    },
    resume(file) {
      this.uploader.upload(file);
    },
    stop(file) {
      this.uploader.stop(file);
    },
    remove(file) {
      // 取消并中断文件上传
      this.uploader.cancelFile(file);
      // 在队列中移除文件
      this.uploader.removeFile(file, true);
      // 在ui上移除
      let index = this.fileList.findIndex(ele => ele.id === file.id);
      this.fileList.splice(index, 1);
    },
    fileSize(size) {
      return WebUploader.Base.formatSize(size);
    },
    fileCategory(ext) {
      let type = '';
      const typeMap = {
          image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
          video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
          text: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
      };
      Object.keys(typeMap).forEach((_type) => {
          const extensions = typeMap[_type];
          if (extensions.indexOf(ext) > -1) {
              type = _type
          }
      });
      return type
    },
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/styles/base";
  .main{
    padding: 24px;
  }
  .message-main{
    .row-hd{
      @include paddingHorizon;
      background:#f6f7fa;
      line-height: 56px;
      height:56px;
      font-size:14px;
      i{
        margin-right:16px;
        display:inline-block;
        height:20px;
        width:20px;
        vertical-align: middle;
        background-size: contain;
        margin-top:-2px;
      }
      .icon-ver{
        background-image: url(../../../assets/images/icon/icon_version.png);
      }
      .icon-pic{
        background-image: url(../../../assets/images/icon/ic_upload.png);
      }
      .icon-content{
        background-image: url(../../../assets/images/icon/ic_edit.png);
      }
    }
    .row-bd{
      padding: 40px 200px;
      background: #fff;
    }
    .form-item{
      display:flex;
      .ml16{
        margin-left:16px;
      }
      .w120{
        width:120px;
      }
      .w160{
        width:160px;
      }
      .w240{
        width:240px;
      }
    }
    .tips{
      opacity: .4;
      color:$fontMainColor;
      margin-left: 92px;
      margin-bottom: 20px;
    }
    .fl{
      float: left;
      &.uploader{
        margin-right:16px;
      }
    }
   .videoUpload{
      width: 100px;
      height: 120px;
      float: left;
      position: relative;
      .preview{
        position: absolute;
        left: 10px;
        bottom: 0;
      }
    }
    .btn-group{
      padding-top: 64px;
      button{
        width: 176px;
        height: 40px;
      }
    }
  }
  $h-row: 50px;
    .file-panel {
      display: none;
      width: 840px;
      margin-top: 10px;
      box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
      > h2 {
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          border-radius: 4px 4px 0 0;
          border-bottom: 1px solid #ccc;
          background-color: #fff;
      }
      .file-list {
          position: relative;
          height: auto;
          overflow-y: auto;
          background-color: rgb(250, 250, 250);
      }
      .file-item {
          position: relative;
          height: $h-row + 1;
          line-height: $h-row;
          padding: 0 10px;
          border-bottom: 1px solid #ccc;
          background-color: #fff;
          z-index: 1;
          > li {
              display: inline-block;
          }
      }
      .file-type {
          width: 24px;
          height: 24px;
          vertical-align: -5px;
      }
      .file-name {
          width: 40%;
          margin-left: 10px;
      }
      .file-size {
          width: 20%;
      }
      .file-status {
          width: 20%;
      }
      .file-operate {
          width: 10%;
          > a {
              padding: 10px 5px;
              cursor: pointer;
              color: #666;
              &:hover {
                  color: #ff4081;
              }
          }
      }
      .progress {
          position: absolute;
          top: 0;
          left: 0;
          height: $h-row - 1;
          width: 0;
          background-color: #E2EDFE;
          z-index: -1;
      }
      .no-file {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
      }
    }
</style>
