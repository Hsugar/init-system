<template>
  <div class="message-main">
    <el-form label-width="120px" size="small">
      <div class="row-hd">
        <i class="icon-ver"></i>针对客户选择
      </div>
      <div class="row-bd">
        <el-form-item label="系统选择：">
          <el-radio-group v-model="formData.type">
            <el-radio v-for="(item, i) in customerList" :label="item.value" :value="item.value " :key="i">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="row-hd">
        <i class="icon-pic"></i>上传文档
      </div>
      <div class="row-bd">
        <el-form-item label="上传文档：">
          <el-upload
            class="uploader fl"
            :show-file-list="false"
            :action="uploadImgUrl | splicingBASEURL"
            :on-success="fileUploadSuccess"
            :headers="headers"
            :on-error="fileUploadError"
            list-type="text"
            :auto-upload="true"
            :before-upload="fileBeforeUpload">
            <!-- <i v-if="listData.fileUrl"  class="avatar success_file"></i> -->
            <Icon v-if="listData.fileUrl" class="avatar" name="el-icon-document"></Icon>
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
          <div class="videoUpload clearfix">
            <span class="success fl" v-if="fileSuccess">上传成功<i class="icon-success el-icon-check"></i></span>
            <span class="fail fl" v-if="fileFail">上传失败</span>
            <span class="loading fl" v-if="fileLoad">正在上传...</span>
            <!-- <el-button class="preview" type="text" @click="handlePictureCardPreview('file')">在线阅读</el-button> -->
            <el-button class="preview" type="text">
              <a href="listData.fileUrl" target="_blank">在线阅读</a>
            </el-button>
          </div>
          <!-- <p class="tips">文档大小需小于10MB</p> -->
        </el-form-item>
        <el-form-item label="上传封面图：" >
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
            <!-- <el-button class="preview" type="text" @click="handlePictureCardPreview" :disabled="!formData.imageUrl">图片预览</el-button>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="formData.imageUrl" alt="">
            </el-dialog> -->
            <thumbnail :max="formData.imageUrl" :disabled="!formData.imageUrl" class="preview">
              <el-button :disabled="!formData.imageUrl" type="text">图片预览</el-button>
            </thumbnail>
          </div>
        </el-form-item>
      </div>
      <div class="row-hd">
        <i class="icon-content"></i>信息编辑
      </div>
      <div class="row-bd">
        <el-form-item label="文档分类:">
          <el-select v-model="listData.class_id" placeholder="请选择文档分类" class="w160">
            <el-option v-for="(item) in types" :label="item.name" :value="item.id | toNumber" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文档标题：">
          <el-input v-model="listData.title" class="w240" placeholder=""></el-input>
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
import { appList,fileAdd,typeList,customerList,docListDetail } from '@/service/message'
import { manualListDetail } from '@/service/study'
export default {
  name: 'studyCenterDoc',
  data () {
    return {
      customerList: customerList,
      formData: {
        type: 1,
        documentId: '',
        action: 2, // 1为修改,2为新增
        imageUrl: '',
      },
      listData: {
        class_id: '',
        title: '',
        fileUrl: '',
      },
      types: [],
      type: '2',
      fileSuccess: false,
      fileFail: false,
      fileLoad: false,
      imgSuccess: false,
      imgFail: false,
      imgLoad: false,
      uploadImgUrl: '/Manual/manualUploadFile',
      dialogVisible: false, // 预览图片是否可见
    }
  },
  components: {
     thumbnail: () => import('@/components/thumbnail/index'),
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
          documentId: query.id
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
    }
  },
  methods: {
    getTypes: async function () {
      try {
        let result = await typeList()
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
          listType: '2',
          id: this.$data.formData.documentId
        }
        // 获取详情数据
        let result = await manualListDetail(query)
        // 解析数据
        let {
         imageUrl = '', type = _.first(customerList).key
        } = result || {}
        // 覆盖数据
        _.assign(this.$data, {
          formData: _.assign({}, this.$data.formData, {
            imageUrl: result.cover_url,
            type: _.toInteger(type) // 类型转换
          }),
          listData: _.assign({},this.$data.listData,{
            fileUrl: result.document_url,
            title: result.title,
            class_id: _.toInteger(result.class_id),
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    save: async function (query = {}) {
      try {
        let param = Object.assign({
          cover_url: this.formData.imageUrl,
          document_url: this.listData.fileUrl,
        },this.formData,this.listData, query)
        let result = await fileAdd(param)
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
    // 上传文档
    fileUploadSuccess(res,file){
      this.listData.fileUrl = res.data
      this.fileSuccess = true;
    },
    fileUploadError (res, file) {
      console.log('error', res, file)
    },
    fileBeforeUpload (file) {
      console.log(file)
      // if (/(?:txt|docx|xsl|jpeg)$/.test(file.name) === false) {
      //   this.$message.error('文档格式不对!')
      //   return false
      // }
    },
     onUploadSuccess (res, file) {
      this.formData.imageUrl = res.data;
      this.imgSuccess = true;
    },
    // 图片预览
    handlePictureCardPreview(file,type) {
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
    }

  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/styles/base";
  .message-main{
    .avatar {
      font-size: 44px;
      color: #ccc;
    }
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
  .el-form-item__label{
    width: 100px;
  }
  .success_file{
    display: inline-block;
    width: 56px;
    height: 56px;
    background: url(../../../assets/images/icon/icon_file.png) no-repeat;
  }
</style>
