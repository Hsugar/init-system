<template>
	<div class="position">
		
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
	data() {
		return {
			home: "系统设置",
			realList: []
		};
	},
	components: {},
	created() {
		this.getRoutePath();
	},
	methods: {
		getRoutePath() {
			//拆分当前路由地址，截取并拼接父级路由地址。再在路由表中查询对应的项目，获取面包屑导航信息
			let paths = '';
			let pathArr = this.$route.path.split('/');
			console.log('patharr==',this.$route.path,pathArr)
			pathArr.shift();
			this.realList = pathArr.map(p => { 
				paths += `/${p}`;	//重新拼接路径中的每一级
				const node = this.$router.options.routes.filter((m) => m.path === paths)[0];	//从路由表中获取每一级对应的路由信息
				console.log('node==',node)
				return {title: node.meta.title, path: node.path};
			
			})
		}
	}
};
</script>
<style lang="scss" scoped>
.position {
	padding: 18px 26px;
  font-size: 15px;
  a{
    color: #393d4a;
    cursor: pointer;
    margin-left: 12px;
    font-weight: bold;
  }
	.level-bread {
		position: relative;
		&:after {
			content: "";
			display: inline-block;
			width: 3px;
			height: 14px;
			background: #4098f7;
			position: absolute;
			top: 0;
			left: 0;
		}
	}
}
.el-breadcrumb__item {
	color: #999;
  cursor: pointer;
  margin-left: 8px;
}
</style>

