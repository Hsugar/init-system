<template>
  <div class="study-main">
    <el-form label-width="110px" size="small" ref="form" :model="formData" :rules="rules">
      <div class="row-hd">
        <i class="icon-choose"></i>针对客户选择
      </div>
      <div class="row-bd">
        <el-form-item label="系统选择：" prop="type">
          <el-radio-group v-model="formData.type" class="system">
            <el-radio v-for="(item, i) in customerList" :label="item.value" :value="item.value " :key="i">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="row-hd">
        <i class="icon-upload"></i>上传视频
      </div>
      <div class="row-bd">
        <el-form-item label="上传视频：" prop="video_oss_id">
          <div class="uploader">
            <input type="file" name="files" id="aliUpload" multiple @change="videoUpload($event)" style="display:none" >
            <label for="aliUpload" class="el-upload fl">
              <i class="el-icon-plus uploader-icon" v-if="!formData.video_oss_id"></i>
              <i class="upload-success" v-else></i>
            </label>
            <div class="videoUpload clearfix">
              <el-button class="preview" type="text" @click="playVideo" :disabled="!formData.video_oss_id">在线播放</el-button>
            </div>
          </div>
          <p class="tips">视频大小需小于600MB</p>
        </el-form-item>
        <el-form-item label="上传封面图：" class="pt15" prop="image_url">
          <el-upload class="uploader fl" name="file" :headers="getToken()"
            :action="'/Manual/manualUploadFile' | splicingBASEURL"
            :show-file-list="false"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            :before-upload="uploadBefore"
            list-type="picture"
            :auto-upload="true"
            :multiple="false"
            accept="image/png, image/jpeg, image/jpg">
            <img v-if="formData.image_url" :src="formData.image_url" class="avatar">
            <i  v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
            <div class="videoUpload clearfix">
            <span class="success fl" v-if="imgSuccess">上传成功<i class="icon-success el-icon-check"></i></span>
            <span class="fail fl" v-if="imgFail">上传失败</span>
            <span class="loading fl" v-if="imgLoad">正在上传...</span>
            <el-button class="preview" type="text" @click="handlePictureCardPreview" :disabled="!formData.image_url">图片预览</el-button>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="formData.image_url" alt="">
            </el-dialog>
          </div>
          <!-- <div class="videoUpload clearfix">
            <thumbnail class="preview" :max="formData.image_url" :disabled="!formData.image_url">
              <el-button type="text"  @click="handlePictureCardPreview" :disabled="!formData.image_url">图片预览</el-button>
            </thumbnail>
          </div> -->
        </el-form-item>
      </div>

      <div class="row-hd">
        <i class="icon-edit"></i>信息编辑
      </div>
      <div class="row-bd">
        <el-form-item label="视频分类：" prop="class_id">
          <el-select v-model="formData.class_id" placeholder="请选择活动区域">
            <el-option v-for="(item) in types" :label="item.name" :value="item.id | toNumber" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频标题：" prop="video_title">
          <el-input v-model="formData.video_title" class="w280" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="视频标签：" prop="dynamicTags">
          <el-tag
            v-for="(tag, i) in formData.dynamicTags"
            :key="i"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="tag-new-input"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput"></el-button>
        </el-form-item>
        <el-form-item label="视频评级：" prop="grade">
          <el-rate v-model="formData.grade" class="item-rate"></el-rate>
        </el-form-item>
        <el-form-item label="视频链接：" prop="jumpUrl">
          <el-input v-model="formData.jumpUrl" class="w320" placeholder="请输入网址（http://或https://）"></el-input>
        </el-form-item>

        <div class="btn-group search">
          <el-button size="small" plain type="primary" @click="save">保存</el-button>
          <el-button size="small" type="default" @click="back">取消</el-button>
        </div>
      </div>
    </el-form>

    <template v-if="mp4PlayUrl">
      <el-dialog :visible.sync="dialogVideo">
        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="false" :options="videoOption"></video-player>
      </el-dialog>
    </template>
  </div>
</template>
<script>
/*
  添加视频
*/
//import '@/assets/scripts/lib/es6-promise.min'
import _ from 'lodash'
import * as Upload from './upload'
import VideoPlayer from 'vue-video-player'
import { manualListDetail, videoAdd, typeList, videoPath } from '@/service/study'
import * as mixin from './mixin'
import * as rules from './video-rules'

export default {
  name: 'messageAppAdd',
  mixins: [{
    computed: mixin.computed,
    methods: _.pick(mixin.methods, ['_getTypes'])
  }],
  data () {
    return {
      types: [],
      rules: rules,
      formData: {
        type: 1,
        action: 2, // 1为修改,2为新增
        class_id: '',
        video_title: '',
        grade: 0,
        jumpUrl: '',
        image_url: '',
        video_oss_id: '', // 阿里云视频上传id
        dynamicTags: [],
      },
      imgSuccess: false,
      dialogVisible: false, // 预览图片是否可见
      imgFail: false,
      imgLoad: false,
      inputVisible: false,
      inputValue: '',

      mp4PlayUrl: '',
      dialogVideo: false,   // 播放视频

      $loading: null // loading
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
          videoId: query.id
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

    // 视频上传完成
    Upload.$on('onUploadEnd', (fileInfo, config = {}) => {
      _.assign(this.$data, {
        formData: _.assign({}, this.$data.formData, {
          video_oss_id: config.VideoId
        })
      })
      this.$data.$loading.close()
    })

    // 文件上传失败
    Upload.$on('onUploadFailed', () => {
      this.$data.$loading.close()
    })
    // 开始上传
    Upload.$on('onUploadstarted', () => {
      this.$data.$loading = this.$loading({
        lock: true,
        text: '上传中'
      })
    })
  },
  computed:{
    // 判断是否是编辑
    isEidt () {
      let formData = this.$data.formData
      return formData.action === 1
    },
    videoOption () {
      return {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4',
          src: this.$data.mp4PlayUrl //url地址
        }],
        // poster: "../../static/images/test.jpg", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }
    }
  },
  methods: {
    // 获取文档列表
    getTypes: async function() {
      try {
        let list = await this._getTypes()
         _.assign(this.$data, {
           types: [].concat(this.$data.types, list)
         })
      } catch (e) {
      }
    },
    getDetail: async function () {
      try {
        let formData = this.$data.formData
        let result = await manualListDetail({
          listType: 1,
          id: formData.videoId
        })

        let option = {
          type: _.toInteger(result.type),
          class_id: _.toInteger(result.class_id),
          video_title: result.video_title,
          grade: _.toInteger(result.grade),
          jumpUrl: result.jumpUrl,
          image_url: result.image_url,
          video_oss_id: result.video_oss_id, // 阿里云视频上传id
          dynamicTags: _.compact((result.tags || '').split(','))
        }

        _.assign(this.$data, {
          formData: _.assign({}, formData, option)
        })
      } catch (e) {
        this.$message.error(e.msg)
      }
    },
    // 获取视频地址
    getVideoPath: async function(){
      try {
        let param = {
          videoId: this.formData.video_oss_id
        }
        let result = await videoPath(param)
        let { mp4PlayUrl } = result
        this.$data.mp4PlayUrl = mp4PlayUrl

      } catch (e) {
        this.$message.warning(e.msg)
      }
    },
    videoUpload: async function ($event) {
      try {
        await Upload.onAliVideoUpload($event)
      } catch (e) {
        let { msg = '视频上传失败，请稍后再试' } = e
        this.$message.warning(msg)
      }
    },

    playVideo (){
      this.$data.dialogVideo = true
      this.getVideoPath();
    },
    // 数据校验
    authData () {
      return new Promise(resolve => {
        const $ref = this.$refs['form']
        $ref.validate(valid => {
          if (valid) {
            let tags = ([].concat(this.formData.dynamicTags || [])).join(',')
            let param = Object.assign({
              tags: tags || '',
            }, _.omit(this.formData, ['dynamicTags']))
            resolve(param)
          }
        })
      })
    },
    save: async function (query = {}) {
      try {
        let param = await this.authData()
        await videoAdd(_.assign({}, param, param))
        this.$message.success('视频已保存');
        this.back()
      } catch (e) {
        let { msg = '系统异常，请稍后再试'} = e
        this.$message.warning(msg)
      }
    },
    uploadBefore () {
      this.$data.$loading = this.$loading({
        lock: true,
        text: '上传中'
      })
    },
     // 图片预览
    handlePictureCardPreview(file) {
      if (this.formData.image_url) {
        this.dialogVisible = true;
      } else {
        this.$message.warning('请先上传封面!')
      }
    },
    onUploadSuccess (res, file) {
      let { data = '' } = res
      console.log(data)
      _.assign(this.formData, {
        image_url: data,
        imgSuccess: true
      })
      if (this.$data.$loading) {
        this.$data.$loading.close()
      }
    },
    onUploadError (res) {
      let { msg = '封面上传失败，请稍后再试' } = res
      this.$message.error(msg)
      if (this.$data.$loading) {
        this.$data.$loading.close()
      }
    },
    handleClose(tag) {
      let dynamicTags = [].concat(this.$data.formData.dynamicTags || [])
      let index = dynamicTags.indexOf(tag)
      if (index >= 0) {
        dynamicTags.splice(index, 1);
      }
      _.assign(this.$data, {
        formData: _.assign({}, this.$data.formData, {
          dynamicTags: dynamicTags
        })
      })
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if(inputValue.length==0) {
        this.$message.warning('视频标签不得为空') 
        return
      };
      if (inputValue.length<=8) {
        this.formData.dynamicTags.push(inputValue);
      }else{
         this.$message.success('视频标签不得超过8个字');
         return false
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 返回上一页
    back () {
      this.$router.replace({ name: 'studyCenter', query: {type: '1'}})
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/styles/base";
  .main{
    padding: 24px;
  }
  .study-main{
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
      .icon-choose{
        background-image: url(../../../assets/images/icon/ic_choose.png);
      }
      .icon-upload{
        background-image: url(../../../assets/images/icon/ic_upload.png);
      }
      .icon-edit{
        background-image: url(../../../assets/images/icon/ic_edit.png);
      }
    }
    .row-bd{
      padding: 40px 200px 22px;
      background: #fff;
    }
    .form-item{
      display:flex;
    }
    .system{
      .el-radio+.el-radio{
        margin-left:16px;
      }
    }
    .tips{
      clear: both;
      opacity: .4;
      color:$fontMainColor;
    }
    .fl{
      float: left;
      &.el-upload,
      &.uploader{
        margin-right:16px;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
    .upload-loading{
      width: 40px;
      height: 40px;
      display: inline-block;
      background-image: url(../../../assets/images/icon/icon_loading.png);
      background-size: contain;
    }
    .upload-success{
      width: 40px;
      height: 40px;
      display: inline-block;
      background-image: url(../../../assets/images/icon/icon_success.png);
      background-size: contain;
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
    .success,.fail,.loading{
      color: #ccc;
    }
    .icon-success{
      color: #31CA80;
      margin-left: 5px;
      // background-image: url(../../../assets/images/icon/icon_cancel.png);
    }
    .icon-fail{
      color: #FF6242;
      background-image: url(../../../assets/images/icon/icon_cancel.png);
    }
    .icon-loading{
      background-image: url(../../../assets/images/icon/icon_cancel.png);
    }


    .btn-group{
      padding-top: 62px;
      button{
        width: 176px;
        height: 40px;
      }
    }
  }
  .pt15{
    margin-top:15px;
  }
  .item-rate{
    display: flex;
    align-items: center;
    height: 32px;
  }
  .tag-new-input{
    width:105px;
  }
  .button-new-tag{
    position:relative;
    height:32px;
    width:32px;
    top:2px;
    &:after,
    &:before{
      content:'';
      position:absolute;
      background:#D9D9D9;
      left:50%;
      top:50%;
    }
    &:after{
      transform:translateX(-50%) translateY(-50%);
      height:10px;
      width:2px;
    }
    &:before{
      transform:translateX(-50%) translateY(-50%);
      height:2px;
      width:10px;
    }
  }
  .el-select{
    width:160px;
  }
  .w280{
    width:280px;
  }
  .w320{
    width:320px;
  }
</style>
<style lang="scss">
@import "../../../assets/styles/base";
.study-main{
  .el-tag{
    margin-right:21px;
    position: relative;
    color:$mainColor;
    border-color: $mainColor;
    background: #EEF6FE;
    .el-icon-close{
      position:absolute;
      right:-7px;
      top:-7px;
      height:14px;
      width:14px;
      background:url(../../../assets/images/icon/ic_del.png) no-repeat 50% 50%;
      background-size:contain;
      &:before{
        content:'';
      }
    }
  }
}
</style>
