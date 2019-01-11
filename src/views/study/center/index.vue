<template>
  <div class="main-study">
    <div class="header">
      <el-tabs v-model="tabKey">
        <template v-for="(item, i) in tabList">
          <el-tab-pane :label="item.name" :name="item.key" :key="i" v-if="item.key === enumKey.video">
            <video-list></video-list>
          </el-tab-pane>
          <el-tab-pane :label="item.name" :name="item.key" :key="i" v-else-if="item.key === enumKey.doc">
            <doc-list></doc-list>
          </el-tab-pane>
          <el-tab-pane :label="item.name" :name="item.key" :key="i" v-else-if="item.key === enumKey.banner">
            <banner-list></banner-list>
          </el-tab-pane>
          <el-tab-pane :label="item.name" :name="item.key" :key="i" v-else>
            <materiel-list></materiel-list>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>
<script>
/*
  学习中心
*/
import _ from 'lodash'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

const enumKey = {
  video: '1', // 视频
  doc: '2', // 文档
  banner: '4', // 轮播图
  materiel: '3' // 物料
}
const tabList = [
  {
    key: enumKey.video,
    name: '视频管理'
  },
  {
    key: enumKey.doc,
    name: '文档管理'
  },
  {
    key: enumKey.banner,
    name: '轮播管理'
  },
  {
    key: enumKey.materiel,
    name: '代理商物料管理'
  }
]

export default {
  name: 'studyCenter',
  data () {
    return {
      enumKey: enumKey,
      tabList: tabList,
      tabKey: _.first(tabList).key,
    }
  },
  components: {
    videoList: () => import('./types/video-list'),
    docList: () => import('./types/doc-list'),
    bannerList: () => import('./types/banner-list'),
    materielList: () => import('./types/materiel-list')
  },
  created () {
    this.tabKey = this.$route.query.type ? this.$route.query.type : '1';
  },
  computed: {
  },
  methods: {
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
      padding-bottom:6px;
      .item{
        &:first-child{
          display:flex;
          justify-content: space-between;
        }
      }
      .el-form-item{
        margin-right: 24px;
      }
    }
    .hd-banner{
      padding-bottom:24px;
    }
    .item-banner,
    .item-thumb{
      width:96px;
      height:96px;
      cursor:pointer;
      border:1px solid #D8D7D6;
    }
    .item-banner{
      width:250px;
      height:100px;
    }
    .item-action{
      display: flex;
      .ac-up{
        color:$errorColor;
      }
      &>div{
        display:flex;
        text-align: left;
        color: $mainColor;
        margin-left:40px;
        flex-direction: column;
        &>span{
          margin-top: 4px;
          margin-bottom: 4px;
          display: block;
          height:16px;
          line-height:16px;
        }
      }
      .cursor{
        cursor: pointer;
      }
      .btn-up,
      .btn-down{
        width:16px;
        cursor: pointer;
        background: url(../../../assets/images/icon/ic_up.png) no-repeat 50% 50%;
        background-size: 100% 100%;
        &.disabled{
          cursor: no-drop;
          background-image: url(../../../assets/images/icon/ic_up_dis.png)
        }
      }
      .btn-up{
        transform: rotate(180deg);
      }

    }
    .icon-lick,
    .icon-dislick{
      display:inline-block;
      vertical-align:middle;
      height:14px;
      width:14px;
      margin-top:-2px;
      margin-right:2px;
      background:url(../../../assets/images/icon/ic_like.png) no-repeat 50% 50%;
      background-size:contain
    }
    .icon-dislick{
      background-image: url(../../../assets/images/icon/ic_dislike.png)
    }
    &.pgBox{
      margin-top: -24px;
      padding-top: 0;
    }
  }
  .com-bd{
    img{
      display:block;
      max-width:100%;
    }
  }
</style>
