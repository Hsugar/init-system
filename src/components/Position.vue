<template>
  <div class="position ">
    <!-- <router-link to="/">{{home}}</router-link>/
    <slot></slot> -->
    <div class="level-bread">
      <el-breadcrumb separator=" / ">
        <el-breadcrumb-item v-for="item in realList" :key="item.id" :to="item.path">{{item.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: "Position",
  methods: {},
  data() {
    return {
      home: "首页",
      realList: []
    };
  },
  components: {},
  watch: {
    $route: function(newV, oldV) {
      this.realList = newV.meta.routeList;
      console.log(this.realList);
    }
  },
  created() {
    this.getRoutePath();
  },
  methods: {
    getRoutePath() {
      this.realList = this.$route.meta.routeList;
      // getBreadcrumb() {
      // 	var breadNumber= this.$route.query.breadNum || 1;//url变量breadNum记录层级，默认为1，如果大于1，要添加上变量；
      // 	var breadLength=this.$store.state.breadListState.length;//目前breadlist集合数组个数
      // 	var curName=this.$route.name;
      // 	var curPath=this.$route.fullPath;
      // 	var newBread={name:curName,path:curPath};
      // 	var ishome=curName=='首页';
      // 	console.log(ishome);
      // 	if(breadNumber===1){//点击一级菜单
      // 	this.$store.commit('breadListStateRemove',1);//初始化，只有首页面包屑按钮
      // 	if(!ishome)//如果不是首页
      // 		this.$store.commit('breadListStateAdd',newBread);//当前页面添加到breadlist集合
      // 	}
      // 	else if(breadLength<=breadNumber){//如果不是一级导航，并且breadlist集合个数等于或者小于目前层级
      // 	this.$store.commit('breadListStateAdd',newBread);//要把当前路由添加到breadlist集合
      // 	}else{
      // 	this.$store.commit('breadListStateRemove',parseInt(breadNumber)+1);//如果往回点面包屑导航，截取；
      // 	}
      // 	this.breadlist=this.$store.state.breadListState;
      // 	console.log(this.breadlist);
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
.position{
  padding: 18px 26px;
}
.el-breadcrumb__item{
	color: #999;
	cursor: pointer;
}
</style>

