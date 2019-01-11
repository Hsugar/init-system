<template>
  <div class="main">
    <div class="header">
      <div class="item search">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="物料分类">
            <el-select v-model="query.classId" @change="onChange">
              <el-option v-for="(item, i) in types" :label="item.name" :value="item.id" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <router-link :to="{'name': 'studyCenterMaterielCreate'}">
          <el-button type="primary" plain size="small">添加物料</el-button>
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
                <router-link :to="{'name': 'studyCenterMaterielEdit', 'query': { 'id': scope.row.id }}">
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
        <template v-else-if="item.key == 'imageUrl'">
          <el-table-column :prop="item.key" :label="item.name" :key="index" width="120px">
            <template slot-scope="scope">
              <thumbnail title="物料封面" :max="scope.row[item.key]">
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

//物料管理
import * as mixin from '../mixin'

export default {
  mixins: [].concat(mixin),
  data () {
    return {
      key: 3, // 类型
      types: [
        {
          id: '',
          name: '全部'
        }
      ],
      query: {
        classId: ''
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
    this.getList()
  },
  computed: {
  },
  methods: {
    // 获取文档列表
    getTypes: async function() {
      try {
        let list = await this._getTypes()
        let types = [].concat(this.$data.types, list)
        let query = {
          type: _.first(types).id
        }
        _.assign(this.$data, {
          types: types,
          query: _.assign({}, this.$data.query, query)
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
