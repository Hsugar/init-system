<template>
  <div class="main-study">
    <el-tabs v-model="activeType" @tab-click="onTabs">
      <el-tab-pane label="视频分类" name="1"></el-tab-pane>
      <el-tab-pane label="文档分类" name="2"></el-tab-pane>
      <el-tab-pane label="物料分类" name="3"></el-tab-pane>
    </el-tabs>
    <div class="main">
      <div class="header">
        <div class="item search">
          <el-button type="primary" plain size="small" @click="dialogVisible=true;">添加分类</el-button>
        </div>
      </div>

      <el-table :data="list" style="width: 100%">
        <template v-for="(item, index) in header">
          <template v-if="item.key=='action'">
            <el-table-column :prop="item.key" :label="item.name" :key="index">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click.native.prevent="onDel(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column :prop="item.key" :label="item.name" :key="index">
            </el-table-column>
          </template>
        </template>
      </el-table>
      <pagination :current-page="currentPage" :total-page="totalPage" @change="currentChange"></pagination>

      <el-dialog title="添加分类" :visible.sync="dialogVisible" width="480px"center custom-class="dialog-form search">
        <el-form class="diaForm" label-position="right" label-width="120px" size="small" :rules="rules" :model="form" ref="form">
          <el-form-item label="添加分类:" prop="className">
            <el-input v-model.trim="form.className" placeholder="请输入分类名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="footer">
          <el-button type="primary" class="primary" plain size="medium" @click="onAdd('form')">保存</el-button>
          <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
/*
  学习中心-分类管理
*/
import { typeList, typeAdd, typeDel } from '@/service/study'
export default {
  name: 'studyType',
  data () {
    return {
      activeType: '1',
      list: [],
      header: [],
      totalPage: 1,
      currentPage: 1, 
      dialogVisible: false,
      form: {},
      rules: {
        className: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {max: 8, message: '输入字符在8个字以内', trigger: 'blur'},
          {
            validator (rule, value, callback) {
              const reg = /^[\s,\.A-Za-z0-9\u4e00-\u9fa5]+$/;
              if (!reg.test(value)) {
                callback(new Error('只能输入中英文数字'))
              }else{
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList: async function (query = {}) {
      try {
        let param = Object.assign({page: this.currentPage}, query)
        let result = await typeList(param, this.activeType)
        let { header = [], list = [], totalPage } = result
        Object.assign(this.$data, {
          list,
          header,
          totalPage,
          currentPage: param.page
        })
      } catch (e) {
        this.$message({
          showClose: true,
          message: e.msg,
          type: 'warning'
        })
      }
    },
    onDel: async function(classId) {
      try {
        let result = await typeDel({classId: classId, type: this.activeType})
        this.getList()
      } catch (e) {
        this.$message.error(e.msg)
      }
    },
    onAdd: async function (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let result = await typeAdd({...this.form, type: this.activeType})
            this.dialogVisible = false
            this.form.className = ''
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.$message.error(e.msg)
          }
        }
      })
    },
    onTabs () {
      this.currentPage = 1
      this.getList()
    },
    currentChange (page) {
      this.getList({
        page: page
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/styles/base";
  .main-study{
    background:#fff;
  }
  .main{
    @include padding;
    .el-input{
      width: 240px;
      height:32px;
    }
    .header{
      padding-bottom:24px;
      .item{
        &:first-child{
          display:flex;
          justify-content: flex-end;
        }
      }
    }
    .diaForm{
      padding-top: 24px;
      padding-bottom:16px;
    }
    .primary{
      background:none;
      &:active,
      &:hover{
        background:#409EFF;
      }
    }
    .footer{
      display: flex;
      justify-content: center;
    }
  }
</style>
