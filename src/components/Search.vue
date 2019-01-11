<template>
    <div class="search-form">
        <input
          type="text"
          class="input"
          v-model="searchVal"
          @keyup="delaySearch"
          :placeholder="placeholder">
        <span class="zoom" @click="onSearch"></span>
    </div>
</template>

<script>
export default {
  name: 'Search',
  props:{
  	value:{
  		type:String,
  		default:''
  	},
    delay:{
      type:Number,
      default:150
    },
    placeholder:{
      type:String,
      default: '请输入搜索信息'
    }
  },
  watch:{
    value(value){
       this.searchVal = value
    },
    searchVal(value){
      this.$emit('input',value)
    }
  },
  methods:{
    delaySearch(){
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(this.onSearch.bind(this), this.delay)
    },
    onSearch(){
      this.$emit('onSearch', this.searchVal);
    }
  },
  data(){
    return {
      searchVal:this.value
    }
  }
}
</script>

<style lang="scss">
.search-form{
	position: relative;
	width: 270px;
	display:inline-block;
	vertical-align: middle;
}
.input{
	height: 30px;
	width:100%;
	display:block;
	border: 1px solid #dcdfe6;
	border-radius:3px;
	text-indent: 12px;
	color: #82858a;
	font-size: 14px;
	box-sizing:border-box;
	background:transparent;
}

.zoom{
	width: 14px;
	height: 15px;
	background:url(../assets/images/zoom.png) no-repeat 0% 50%;
	position: absolute;
	right: 12px;
	cursor:pointer;
    top: 0;
    bottom: 0;
    margin: auto;
	}
.full{
	display:block;
}
</style>
