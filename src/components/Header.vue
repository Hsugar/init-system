<template>
	<div class="g-header clearfix">
		<div class="header-left">
			<a href="/" class="logo">
				<img src="../assets/images/logo.png" alt>
			</a>
			<p class="logo-font">
				<span class="center">|</span>
				<span>重庆牧童</span>
			</p>
		</div>
		<div class="header-right">
			<Dropdown :menu="dropmenu" :onSelected="onSelected">
				<i class="iconfont icon-user"></i>
				欢迎你，{{'wu kong'||userInfo.nickname}}
			</Dropdown>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import Position from "@/components/Position";
import Dropdown from "./Dropdown";
import menu from "@/config/menu.config.js";
import storage from "@/tools/storage.js";
export default {
	name: "Header",
	methods: {
		onSelected: function(e, item) {
			console.log(e, item);
		}
	},
	mounted() {},
	data() {
		return {
			menu: menu,
			dropmenu: [
				// {
				//   name: "用户中心",
				//   url: "/dashboard"
				// },
				{
					name: "退出登录",
					url: "/logout",
					direct: true
				}
			]
		};
	},
	created: function() {
		// 获取当前语言
		//console.log(this.language.key,'===>>', this.language.curr)
		// console.log(storage.getCookie('lang'));
		//this.getMallToken();
	},
	computed: {
		userInfo: function() {
			// return this.$store.state.dashboard.CurrUserInfo;
		}
	},
	components: {
		Dropdown,
		Position
	}
};
</script>
<style type="text/css" lang="scss">
/* g-header */
.g-header {
	width: 100%;
	height: 80px;
	position: relative;
	padding: 0 28px;
	background: #4098f7;
	font-size: 14px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.header-left {
		display: flex;
		align-items: center;
		.logo img {
			display: block;
			width: 160px;
		}
		.logo-font {
			color: #fff;
			font-size: 18px;
			text-align: center;
			text-transform: uppercase;
			.center {
				margin: 0 15px;
				font-weight: normal;
			}
			span {
				&:last-child {
					font-size: 18px;
					font-weight: normal;
					letter-spacing: 2px;
				}
			}
		}
	}

	.header-right {
		position: absolute;
		right: 86px;
		top: 16px;
		z-index: 10;
	}
	li {
		float: left;
		&:last-child a:after {
			display: none;
		}
		a {
			position: relative;
			padding: 0 15px;
			display: block;
			height: 38px;
			line-height: 38px;
			color: #999;
			&:after {
				content: "|";
				position: absolute;
				right: 0;
				top: -2px;
			}
		}
	}
}
/* header end */
</style>
