<template>
  <div class="main">
    <div class="header">
      <div class="item search">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="视频分类">
            <el-select v-model="query.classId" @change="onChange">
              <el-option v-for="(item, i) in types" :label="item.name" :value="item.id" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视频状态">
            <el-select v-model="query.is_delete" @change="onChange">
              <el-option v-for="(item, i) in videoStatus" :label="item.name" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="针对客户">
            <el-select v-model="query.type" @change="onChange">
              <el-option v-for="(item, i) in customerList" :label="item.name" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <router-link :to="{'name': 'studyCenterVideoCreate'}">
          <el-button type="primary" plain size="small">添加视频</el-button>
        </router-link>
      </div>
    </div>

    <el-table :data="list" style="width: 100%">
      <template v-for="(item, index) in header">
        <template v-if="item.key=='comment'">
          <el-table-column :prop="item.key" :label="item.name" :key="index">
            <template slot-scope="scope">
              <p><span class="icon-lick"></span>{{ scope.row.goodNum }}</p>
              <p><span class="icon-dislick"></span>{{ scope.row.badNum }}</p>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.key=='action'">
          <el-table-column :prop="item.key" align="left" width="280" :label="item.name" :key="index">
            <template slot-scope="scope">
              <div class="item-action">
                <router-link :to="{'name': 'studyCenterVideoEdit', 'query': { 'id': scope.row.id }}">
                  <el-button type="text" size="mini">修改</el-button>
                </router-link>
                <template v-if="scope.row.is_delete == '1'">
                  <el-button type="text" class="ac-up ml15" size="mini" @click.native.prevent="onSwitchItem(scope.row, scope.$index, '2')">下架</el-button>
                </template>
                <template v-else>
                  <el-button type="text" class="ac-up ml15" size="mini" @click.native.prevent="onSwitchItem(scope.row, scope.$index, '1')">上架</el-button>
                </template>

                <div class="ml15">
                  <span class="cursor" @click="onCopy(scope.row.zhiKeCopyUrl)">复制直客链接</span>
                  <span class="cursor" @click="onCopy(scope.row.dlCopyUrl)">复制代理商链接</span>
                </div>
                <div class="ml15">
                  <span class="btn-up" :class="{'disabled': (page == 1 && scope.$index<1)}" @click="onMoveItem(scope.row, scope.$index, 'up')"></span>
                  <span class="btn-down" :class="{'disabled':(page == totalPage && scope.$index == list.length-1)}" @click="onMoveItem(scope.row, scope.$index, 'next')"></span>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.key == 'image_url'">
          <el-table-column :prop="item.key" :label="item.name" :key="index" width="120px">
            <template slot-scope="scope">
              <thumbnail title="视频封面" :max="scope.row[item.key]">
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
  </div>
</template>

<script>

//视频管理
import * as mixin from '../mixin'

const videoStatus = [
  {name: '全部', value: ''},
  {name: '已上架', value: 1},
  {name: '已下架', value: 2}
]

export default {
  mixins: [].concat(mixin),
  data () {
    return {
      key: 1, // 类型
      types: [
        {
          id: '',
          name: '全部'
        }
      ], // 分类列表
      videoStatus: videoStatus,
      query: {
        classId: '',
        is_delete: videoStatus[1].value,
        type: ''
      },
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
