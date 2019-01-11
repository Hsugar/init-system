<template>
  <div class="main">
    <div class="header">
      <div class="item search">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="文档分类">
            <el-select v-model="query.classId" @change="onChange">
              <el-option v-for="(item, i) in types" :label="item.name" :value="item.id" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="针对客户">
            <el-select v-model="query.type" @change="onChange">
              <el-option v-for="(item, i) in customerList" :label="item.name" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <router-link :to="{'name': 'studyCenterDocCreate'}">
          <el-button type="primary" plain size="small">添加文档</el-button>
        </router-link>
      </div>
    </div>

    <el-table :data="list" style="width: 100%">
      <template v-for="(item, index) in header">
        <template v-if="item.key=='action'">
          <el-table-column :prop="item.key" align="left" width="260" :label="item.name" :key="index">
            <template slot-scope="scope">
              <div class="item-action">
                <router-link :to="{'name': 'studyCenterDocEdit', 'query': { 'id': scope.row.id }}">
                  <el-button type="text" size="mini">修改</el-button>
                </router-link>
                <el-button type="text" class="ml15 ac-up" size="mini" @click.native.prevent="deleVisible = true; deleteId = scope.row.id">删除</el-button>
                <el-button class="ml15" type="text" size="mini" @click="onCopy(scope.row.documentCopyUrl)">复制直客链接</el-button>
                <div>
                  <span class="btn-up" :class="{'disabled': (page == 1 && scope.$index<1)}" @click="onMoveItem(scope.row, scope.$index, 'up')"></span>
                  <span class="btn-down" :class="{'disabled':(page == totalPage && scope.$index == list.length - 1)}" @click="onMoveItem(scope.row, scope.$index, 'next')"></span>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.key == 'cover_url'">
          <el-table-column :prop="item.key" :label="item.name" :key="index" width="120px">
            <template slot-scope="scope">
              <thumbnail title="文档封面" :max="scope.row[item.key]">
                <div class="item-thumb">
                  <span class="img" :style="scope.row[item.key] | thumb"></span>
                  <Icon name="enlarge"></Icon>
                </div>
              </thumbnail>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column :prop="item.key" :label="item.name" :key="index">
          </el-table-column>
        </template>
      </template>
    </el-table>

    <pagination :current-page="page" :total-page="totalPage" @change="currentChange"></pagination>
    <!-- 删除数据dialog -->
    <el-dialog title="删除白名单" :visible.sync="deleVisible" custom-class="dialog-form dialog-text search w480" :show-close="false" center>
      <span>删除后无法恢复，是否删除？</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="onDel(deleteId)" size="small" plain class="footer-btn">删 除</el-button>
        <el-button @click="deleVisible = false" size="small" plain class="footer-btn">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 文档管理
import * as mixin from '../mixin'
export default {
  mixins: [].concat(mixin),
  data () {
    return {
      key: 2, // 类型
      types: [
        {
          id: '',
          name: '全部'
        }
      ], // 分类列表
      query: {
        classId: '',
        type: ''
      },
      deleVisible: false, // 删除框
      deleteId: '', // 需要删除的数据id
      totalPage: 1,
      page: 1,
      header: [],
      list: []
    }
  },
  components: {

  },
  created () {
    this.getTypes()
  },
  mounted () {
    let type = _.first(this.customerList).value
    _.assign(this.$data, {
      query: _.assign({}, this.$data.query, { type })
    })
    this.getList({
      type: type
    })
  },
  computed: {
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
    getList: async function (query) {
      try {
        let res = await this._getList(query)
        _.assign(this.$data, res)
      } catch (e) {
        console.log(e)
      }
    },
    onChange () {
      this.currentChange(1)
    }
  }
}
</script>

<style lang="scss" scoped src="./style.scss"></style>
