<template>
	<div class="dropdown" :class="{open: open}">
		<div class="dropdown-text" @click="dropToggle">
			<slot></slot>
		</div>
		<div class="dropmenu">
			<div v-for="item in menu" @click="dropSelected(item,$event)" :key="item.index">
				<router-link :to="item.url">{{item.name}}</router-link>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name: "Dropdown",
	props: {
		menu: {
			type: Array,
			default: []
		},
		onSelected: {
			type: Function,
			default: () => {}
		}
	},
	methods: {
		dropSelected: function(item, event) {
			this.onSelected(event.target, item);
		},
		dropToggle: function(event) {
			event.stopPropagation();
			this.open = !this.open;
		}
	},
	mounted() {
		if (window.addEventListener) {
			let self = this;
			document.body.addEventListener(
				"click",
				function(e) {
					self.open = false;
				},
				false
			);
		}
	},
	data() {
		return {
			open: false
		};
	}
};
</script>

<style scoped lang="scss">
.dropdown {
	font-size: 14px;
	color: #fff;
	position: relative;
	width: 140px;
}
.dropdown-text {
	cursor: pointer;
	line-height: 40px;
	position: relative;
	padding: 0 10px 0 27px;;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.dropdown-text:after {
	content: "";
	position: absolute;
	right: 4px;
	top: 17px;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
	border-top: 6px solid #fff;
	transition: 0.3s all ease;
	transform: rotate(0);
}
.dropdown .icon-user {
	position: absolute;
	left: 0; 
	top: 8px;;
	display: block;
	width: 22px;
	height: 22px;
	background: url('../assets/images/user.png') no-repeat;
	background-size: cover;


}
.dropmenu {
	width: 120px;
	position: absolute;
	top: 100%;
	left: 10px;
	right: 10px;
	background-color: #fff;
	border-radius: 0 0 3px 3px;
	display: none;
	padding: 5px 0;
	a {
		color: #606266;
		font-size: 12px;
		display: block;
		line-height: 2.5;
		text-align: center;
		cursor: pointer;
		&:hover {
			color: #4098f7;
		}
	}
}

.dropdown.open {
	border-radius: 3px 3px 0 0;
}
.dropdown.open .dropmenu {
	display: block;
}
.dropdown.open .dropdown-text:after {
	transform: rotate(180deg);
}

.skin-white .dropdown-text:after {
	border-top: 6px solid #bcbcbd;
}
</style>
