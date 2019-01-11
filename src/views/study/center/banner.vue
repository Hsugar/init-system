<template>
  <div class="message-main">
    <el-form label-width="90px" size="small" ref="form" :model="formData" :rules="rules">

      <ContentDetail title="针对客户选择" icon="system_info">
        <el-form-item label="系统选择：">
          <el-radio-group v-model="formData.type">
            <el-radio v-for="(item, i) in customerList" :label="item.key | toNumber" :key="i">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </ContentDetail>

      <ContentDetail title="上传轮播图" icon="ic_upload">
        <el-form-item label="上传图片: " prop="imageUrl">
          <div class="uploader">
            <el-upload name="file" :headers="getToken()"
              :action="'/Manual/manualUploadFile' | splicingBASEURL"
              :show-file-list="false"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              list-type="picture"
              :auto-upload="true"
              :multiple="false"
              accept="image/png, image/jpeg, image/jpg">
              <div v-if="formData.imageUrl" class="preview" >
                <img :src="formData.imageUrl">
              </div>
              <i v-else class="el-icon-plus uploader-icon"></i>
            </el-upload>
            <thumbnail :max="formData.imageUrl" :disabled="!formData.imageUrl" class="preview">
              <el-button :disabled="!formData.imageUrl" type="text">图片预览</el-button>
            </thumbnail>
          </div>
        </el-form-item>
      </ContentDetail>

      <ContentDetail title="信息编辑" icon="ic_edit">
        <div>
          <el-form-item label="直客链接: " prop="href">
            <el-input v-model="formData.href" placeholder="请输入网址（http://或https://）"></el-input>
          </el-form-item>
          <el-form-item label="代理商链接: " prop="href_agent">
            <el-input v-model="formData.href_agent" placeholder="请输入网址（http://或https://）"></el-input>
          </el-form-item>
          <div class="btn-group search">
            <el-button size="small" plain type="primary" @click="save">保存</el-button>
            <el-button size="small" type="default" @click="back">取消</el-button>
          </div>
        </div>
      </ContentDetail>
    </el-form>
  </div>
</template>
<script>
/*
  添加轮播图
*/
import _ from 'lodash'
import { manualModifyOrCreateCarousel, manualListDetail } from '@/service/study'
import { customerList } from './customerList'
import * as rules from './banner-rules'

export default {
  name: 'studyCenterBanner',
  data () {
    return {
      formData: {
        action: 2, // 1修改 2 创建 默认创建
        // 选择类型
        type: _.toInteger(_.first(customerList).key),
        href: '',
        imageUrl: '',
        href_agent: ''
      },
      rules: rules,
      customerList: customerList,
      $loading: null
    }
  },
  components: {
    thumbnail: () => import('@/components/thumbnail/index'),
    ContentDetail: () => import('@/components/content/detail')
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
          carouselId: query.id
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
  computed: {
    // 判断是否是编辑
    isEidt () {
      let formData = this.$data.formData
      return formData.action === 1
    }
  },
  mounted () {
    if (this.isEidt) {
      this.getDetail()
    }
  },
  methods: {
    getDetail: async function () {
      try {
        let query = {
          listType: '4',
          id: this.$data.formData.carouselId
        }
        // 获取详情数据
        let result = await manualListDetail(query)
        // 解析数据
        let {
          href = '', href_agent = '', imageUrl = '', type = _.first(customerList).key
        } = result || {}
        // 覆盖数据
        _.assign(this.$data, {
          formData: _.assign({}, this.$data.formData, {
            href, href_agent, imageUrl,
            type: _.toInteger(type) // 类型转换
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 数据校验
    authData () {
      return new Promise(resolve => {
        const $ref = this.$refs['form']
        $ref.validate(valid => {
          if (valid) {
            let data = Object.assign({}, this.$data.formData)
            resolve(data)
          }
        })
      })
    },
    save: async function () {
      let data = await this.authData()
      try {
        await manualModifyOrCreateCarousel(data)
        this.$message.success('轮播图已保存')
        this.back()
      } catch(e) {
        let { msg = '' } = e
        this.$message.error(msg || '系统异常，请稍后再试')
      }
    },
    uploadBefore () {
      this.$data.$loading = this.$loading({
        lock: true,
        text: '上传中'
      })
    },
    onUploadSuccess (res, file) {
      let { data = '' } = res
      let formData = _.assign({}, this.$data.formData, {
        imageUrl: data
      })
      _.assign(this.$data, { formData })
      if (this.$data.$loading) {
        this.$data.$loading.close()
      }
    },
    onUploadError (res) {
      let { msg = '图片上传失败，请稍后再试' } = res || {}
      this.$message.error(msg)
      if (this.$data.$loading) {
        this.$data.$loading.close()
      }
    },
    // 返回上一页
    back () {
      this.$router.replace({ name: 'studyCenter', query: {type: '4'}})
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/styles/base";
  .main{
    padding: 24px;
  }
  .uploader {
    display: flex;
    align-items: flex-end;
    .thumbnail {
      line-height: 16px;
      margin-left: 16px;
    }
    .el-button{
      font-size: 14px;
      line-height: 16px;
      padding: 0;
    }
    .preview {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .el-form {
    .el-input {
      width: 320px;
    }
    .btn-group {
      margin-top: 80px;
      .el-button {
        width: 176px;
        height: 40px;
      }
    }
  }
</style>
