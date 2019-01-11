<template>
	<div class="nav scrollbar" :class="{'w200':!isCollapse,'w60':isCollapse}">
		<ul v-if="!isCollapse" class="menu-list">
			<li
				v-for="item in listNav"
				:key="item.index"
				:class="{open:item.open, 'nav-item-Active': item.children, isClick:item.active}"
				class="nav-item-parent"
				@click="toggle(item, listNav)"
			>
				<template v-if="item.children">
					<router-link :to="item.url" @click.native="goto(item.url, item.paraent)">
						<i class="iconfont" :class="item.icon"></i>
						<span>{{item.text}}</span>
						<i class="fa-arrow" :class="{'fa-caret-up':item.open,'fa-caret-down':!item.open}"></i>
					</router-link>
					<ul class="sub">
						<li
							v-for="subItem in item.children"
							:key="subItem.index"
							class="nav-item-child"
							:class="{'unionRole': subItem.role === 'union'}"
						>
							<router-link
								:to="subItem.url"
								@click.native="goto(subItem.url, subItem.paraent)"
							>{{subItem.text}}</router-link>
						</li>
					</ul>
				</template>
				<template v-else>
					<router-link
						v-if="item.link !== 'http' "
						:to="item.url"
						@click.native="goto(item,listNav, true)"
					>
						<i class="iconfont" :class="item.icon"></i>
						<span>{{item.text}}</span>
					</router-link>
					<a v-else :to="item.url" @click="goShop(item.url)">
						<i class="iconfont" :class="item.icon"></i>
						<span>{{item.text}}</span>
					</a>
				</template>
			</li>
		</ul>
		<ul v-if="isCollapse" class="aside">
			<li v-for="item in listNav" :key="item.index">
				<i class="iconfont" :class="item.icon"></i>
			</li>
		</ul>
		<div class="menu-operate">
			<span :class="!isCollapse?'up':'open'" title="收起" @click="isCollapse=!isCollapse"></span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import list from "../config/nav.config.js";
import storage from "../tools/storage.js";
list.map(item => {
	item.open = !!item.open;
});

function _dirname(url) {
	if (!url) return url;
	let arr = url.split("/").reverse();
	if (!arr[1]) return url;
	arr.shift();
	return arr.reverse().join("/");
}

export default {
	name: "Nav",
	data() {
		return {
			list: JSON.parse(window.localStorage.getItem("navs")) || list, //菜单列表
			isCollapse: false //是否收起
		};
	},
	watch: {
		$route: "updateState"
	},
	computed: {
		userInfo: function() {
			return this.$store.state.dashboard.CurrUserInfo;
		},
		listNav: function() {
			return this.list;
		}
	},
	mounted() {},
	methods: {
		//跳转路径
		goto(item, list, tag) {
			if (tag) {
				list.map(it => {
					if (item === it) {
						it.active = true;
					} else {
						it.active = false;
					}
					return it;
				});
				window.localStorage.setItem("navs", JSON.stringify(list));
				this.list = list;
			}
		},
		goShop: function(url) {
			console.log(url);
		},
		toggle(item, list) {
			item.open = !item.open;
			list.map(items => {
				if (items === item) {
					items.open = true;
					items.active = true;
				} else {
					items.open = false;
					items.active = false;
				}
				return items;
			});
			window.localStorage.setItem("navs", JSON.stringify(list));
			this.list = list;
		},
		updateState() {
			// 将匹配路径统一转换成 小写进行匹配
			let curl = _dirname(this.$route.fullPath).toLowerCase();
			// console.log(curl, 'curl', this.list);
			if (curl) {
				this.list.map(item => {
					if (item.url.toLowerCase() === curl) {
						// console.log(curl, item.url);
						item.open = true;
						item.active = true;
					} else {
						item.open = false;
						item.active = false;
					}
				});
				window.localStorage.setItem("navs", JSON.stringify(list));
			}
		},
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		}
	}
};
</script>
<style lang="scss" scoped>
.w200 {
	width: 180px;
}
.w60 {
	width: 60px;
}
.nav {
	font-size: 14px;
	overflow-x: hidden;
	background: #fff;
	border-right: 1px solid #e7e9ef;
  position: relative;
  padding: 18px 0 0;
	ul {
		li {
      cursor: pointer;
      padding: 3px 0 0;
      font-weight: bold;
			.iconfont {
				margin: 12px 12px 0 0;
				display: inline-block;
				width: 18px;
				height: 18px;
			}
			.icon-system {
				background: url("../assets/images/system.png") no-repeat;
				background-size: cover;
			}
			.icon-record {
				background: url("../assets/images/record.png") no-repeat;
				background-size: cover;
			}
			.icon-order {
				background: url("../assets/images/order.png") no-repeat;
				background-size: cover;
      }
      	.icon-vip {
				background: url("../assets/images/vip.png") no-repeat;
				background-size: cover;
      }
      	.icon-people {
				background: url("../assets/images/people.png") no-repeat;
				background-size: cover;
      }
      	.icon-out {
				background: url("../assets/images/out.png") no-repeat;
				background-size: cover;
			}
			a:hover {
				color: #333;
			}
			a {
				display: flex;
				padding-left: 24px;
				line-height: 42px;
				-webkit-transition: all 0.3s ease;
				transition: all 0.3s ease;
				justify-content: flex-start;
				color: #393d4a;
			}
		}
	}
	.aside {
		text-align: center;
		cursor: pointer;
	}
	.open .sub {
		display: block;
	}
	.sub {
    display: none;
    li{
      padding: 0;
      font-weight: normal;
    }
		a {
			padding-left: 56px;
			font-size: 12px;
			color: #8d97a0;
			line-height: 32px;
		}
	}
	.router-link-exact-active,
	.router-link-exact-active a,
	.isClick,
	.isClick span {
		color: #4098F7 !important;
  }
  .isClick{
    	.icon-system {
				background: url("../assets/images/system-on.png") no-repeat;
				background-size: cover;
			}
			.icon-record {
				background: url("../assets/images/record-on.png") no-repeat;
				background-size: cover;
			}
			.icon-order {
				background: url("../assets/images/order-on.png") no-repeat;
				background-size: cover;
      }
      	.icon-vip {
				background: url("../assets/images/vip-on.png") no-repeat;
				background-size: cover;
      }
      	.icon-people {
				background: url("../assets/images/people-on.png") no-repeat;
				background-size: cover;
      }
      	.icon-out {
				background: url("../assets/images/out-on.png") no-repeat;
				background-size: cover;
			}
  }
	/*二级菜单三角形*/
	.nav-item-Active {
		position: relative;
		transition: transform 0.4s ease-in-out;
		&:after {
			content: "";
			display: block;
			position: absolute;
			top: 17px;
			width: 14px;
			right: 18px;
      height: 14px;
      background: url('../assets/images/up.png');
		}
	}
	.open {
		&:after {
			transform: rotate(180deg);
		}
	}
}
/*底部收起按钮*/
.menu-operate {
	height: 35px;
	line-height: 35px;
	text-align: center;
	border-top: 1px solid #e7e9f0;

	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	span {
		display: inline-block;
		width: 16px;
		height: 16px;
		cursor: pointer;
		&.open {
			background: url("../assets/images/menu-open.png") no-repeat;
			background-size: cover;
		}
		&.up {
			background: url("../assets/images/menu-up.png") no-repeat;
			background-size: cover;
		}
	}
}
.nav .fa-caret-down,
.nav .fa-caret-up {
	margin-left: 12px;
}
</style>
