<template>
  <div class="main">
    <div class="header">
      <div class="item search">
        <div></div>
        <router-link :to="{'name': 'studyCenterBannerCreate'}">
          <el-button type="primary" plain size="small">添加轮播图</el-button>
        </router-link>
      </div>
    </div>

    <el-table :data="list" style="width: 100%">
      <template v-for="(item, index) in header">
        <template v-if="item.key=='action'">
          <el-table-column :prop="item.key" align="left" :label="item.name" :key="index">
            <template slot-scope="scope">
              <div class="item-action">
                <router-link :to="{'name': 'studyCenterBannerEdit', 'query': { 'id': scope.row.id }}">
                  <el-button type="text" size="mini">修改</el-button>
                </router-link>
                <el-button type="text" class="ml15 ac-up" size="mini" @click.native.prevent="onDel(scope.row.id)">删除</el-button>
                <div class="ml15">
                  <span class="btn-up" :class="{'disabled': (page == 1 && scope.$index<1)}" @click="onMoveItem(scope.row, scope.$index, 'up')"></span>
                  <span class="btn-down" :class="{'disabled':(page == totalPage && scope.$index == list.length-1)}" @click="onMoveItem(scope.row, scope.$index, 'next')"></span>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.key=='imageUrl'">
          <el-table-column :prop="item.key" :label="item.name" :key="index" width="275px">
            <template slot-scope="scope">
              <thumbnail title="轮播图" :max="scope.row[item.key]">
                <div class="item-thumb" style="width: 250px; height: 88px;">
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
// 轮播管理
import * as mixin from '../mixin'

export default {
  mixins: [].concat(mixin),
  data () {
    return {
      key: 4, // 类型
      query: {},
      totalPage: 1,
      page: 1,
      header: [],
      list: []
    }
  },
  components: {
  },
  created () {
  },
  mounted () {
    this.getList()
  },
  computed: {
  },
  methods: {
    getList: async function (query) {
      try {
        let res = await this._getList(query)
        _.assign(this.$data, res)
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>

<style lang="scss" scoped src="./style.scss"></style>
