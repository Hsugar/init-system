<template>
	<div>
		<Position>
			<!-- <span>学生档案</span> -->
		</Position>
		<div class="options p26">
			<div class="item">
				<!-- 校区 -->
				<div class="select-campus">
					<span class="select-name">校区：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- 教学点 -->
				<div class="select-point">
					<span class="select-name">教学点：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- 班级名称 -->
				<div class="select-class">
					<span class="select-name">班级名称：</span>
					<el-input placeholder="请输入班级名称" v-model="classVal" clearable></el-input>
				</div>
				<!-- 订单号 -->
				<div class="select-order">
					<span class="select-name">订单号：</span>
					<el-input placeholder="请输入订单号" v-model="classVal" clearable></el-input>
				</div>
				<!-- 老师姓名 -->
				<div class="select-order">
					<span class="select-name">老师姓名：</span>
					<el-input placeholder="请输入老师姓名" v-model="classVal" clearable></el-input>
				</div>
			</div>
			<div class="item">
				<!-- 家长手机 -->
				<div class="select-order">
					<span class="select-name">家长手机：</span>
					<el-input placeholder="请输入手机号" v-model="classVal" clearable></el-input>
				</div>
				<!-- 来源 -->
				<div class="select-order">
					<span class="select-name">来源：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- 订单状态 -->
				<div class="select-order">
					<span class="select-name">订单状态：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- 季节 -->
				<div class="select-order">
					<span class="select-name">季节：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- 省份 -->
				<div class="select-order">
					<span class="select-name">省份：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
			</div>
			<div class="item last">
				<!-- 城市 -->
				<div class="select-order">
					<span class="select-name">城市：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="date-picker">
					<span class="select-name">时间：</span>
					<el-date-picker
						v-model="dateVal"
						type="datetimerange"
						:picker-options="pickerOptions"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						align="right"
					></el-date-picker>
				</div>
				<!-- <div class="search">
        <el-input placeholder="请输入关键字" v-model="searchVal" clearable></el-input>
				</div>-->
				<div>
					<span class="select-name">搜索：</span>
					<Search @onSearch="getList" v-model="searchVal"></Search>
				</div>
			</div>
			<div class="item search">
				<!--:disabled="!creativeIds.length"-->
				<!-- <el-button type="primary" plain size="small" @click="batch(1)">批量通过</el-button> -->
				<!-- <el-button type="danger" plain size="small" @click="onDel(2)">批量删除</el-button> -->
				<!-- <el-button class="add" @click="addDialog = true">添加</el-button> -->
				<el-button type="primary">导出</el-button>
				<div>
					<el-button type="primary">查询</el-button>
					<el-button type="primary">重置</el-button>
				</div>
			</div>
		</div>
    <div class="bg-empty"></div>
		<el-table :data="list" @selection-change="handleSelectionChange" style="width: 100%">
			<el-table-column type="selection" disabled width="55"></el-table-column>
			<el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
			<el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
			<el-table-column prop="address" label="地址"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="onEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" @click="onEdit(scope.$index, scope.row)">启用</el-button>
					<el-button size="mini" @click="onEdit(scope.$index, scope.row)">上移</el-button>
					<el-button size="mini" @click="onDel(scope.$index, scope.row)">下移</el-button>
					<el-button size="mini" type="danger" @click="onDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
			<!-- <template v-for="(item, index) in header">
        <template v-if="item.key=='action'">
          <el-table-column :prop="item.key" align="left" :label="item.name" :key="index">
            <template slot-scope="scope">
              <div class="item-action">
                <router-link :to="{'name': 'studyCenterBannerEdit', 'query': { 'id': scope.row.id }}">
                <el-button type="text" size="mini">修改</el-button>
                </router-link>
                <el-button
                  type="text"
                  class="ml15 ac-up"
                  size="mini"
                  @click.native.prevent="onDel(scope.row.id)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column :prop="item.key" :label="item.name" :key="index"></el-table-column>
        </template>
			</template>-->
		</el-table>

		<!-- 分页 -->
		<div class="pagination">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="page.current"
				:page-sizes="page.page_sizes"
				:page-size="page.page_size"
				:total="page.total*1"
				layout="total, sizes, prev, pager, next, jumper"
			></el-pagination>
		</div>
		<!-- 分页 end -->
		<!-- 新增弹框 -->
		<el-dialog title="新增校区" :visible.sync="addDialog" width="35%" center>
			<el-input placeholder="校区名称" v-model="searchVal" clearable></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialog = false">取 消</el-button>
				<el-button type="primary" @click="addDialog = false">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 新增弹框 end -->
	</div>
</template>

<script>
import Position from "@/components/Position.vue";
import Search from "@/components/Search.vue";
import { list } from "../service/record/school";
export default {
	name: "Student",
	data() {
		return {
			campusVal: "", //校区下拉框选项值
			classVal: "", //班级名称项值
			searchVal: "", //搜索值
			dateVal: "", // 时间范围
			pickerOptions: {
				shortcuts: [
					{
						text: "最近一周",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近一个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近三个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit("pick", [start, end]);
						}
					}
				]
			},
			options: [
				{
					value: "选项1",
					label: "黄金糕"
				},
				{
					value: "选项2",
					label: "双皮奶"
				},
				{
					value: "选项3",
					label: "蚵仔煎"
				}
			],
			list: [
				{
					date: "2018-05-02",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
				},
				{
					date: "2018-05-04",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1517 弄"
				},
				{
					date: "2018-05-01",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1519 弄"
				},
				{
					date: "2018-05-03",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1516 弄"
				},
				{
					date: "2018-05-04",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1517 弄"
				},
				{
					date: "2018-05-01",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1519 弄"
				},
				{
					date: "2018-05-03",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1516 弄"
				},
				{
					date: "2018-05-04",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1517 弄"
				},
				{
					date: "2018-05-01",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1519 弄"
				},
				{
					date: "2018-05-03",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1516 弄"
				}
			],
			//分页信息
			page: {
				total: 400,
				current: 2,
				page_size: 100,
				size: 0,
				page_sizes: [100, 200, 300, 400]
			},
			addDialog: false
		};
	},
	methods: {
		onDel(id) {
			console.log(id);
		},
		onEdit(index) {
			console.log(index);
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		},
		handleSelectionChange(val) {
			// this.creativeIds = []
			// if (val.length > 0) {
			//     val.map((item) => {
			//         if (item.status === '0') {
			//             this.creativeIds.push(item.creativeId)
			//         }
			//     })
			// }
		},
		// 批量操作
		batch: async function(status) {
			console.log(status);
			// try {
			//     let param = {
			//         creativeId: this.creativeIds.join(','),
			//         status: status || this.type,
			//         reason: this.reason
			//     }
			//     await advertCheck(param)
			//     this.$message({
			//         showClose: true,
			//         message: '批量操作成功',
			//         type: 'success'
			//     })
			//     this.getList()
			// } catch (e) {
			//     this.$message({
			//         showClose: true,
			//         message: e.msg,
			//         type: 'warning'
			//     })
			// }
		},
		getList: async function() {
			try {
				let data = await list();
				console.log(111);
				console.log("data==", data);
			} catch (e) {
				let { msg } = e;
				console.log(e);
				// this.$message.warning(msg);
			}
		}
	},
	computed: {},
	created() {
		//console.log(this.$store.state)
	},
	mounted() {},
	components: {
		Position,
		Search
	}
};
</script>

<style lang="scss" scoped>
.options{
  border-bottom: 1px solid #E7E9EF;
  padding-bottom: 15px;
}
.item {
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	// margin-bottom: 12px;
	&.last {
		justify-content: flex-start;
		div {
			margin-right: 40px;
		}
	}
	.select-name {
		display: inline-block;
		width: 70px;
		text-align: right;
		color: #8a8c8f;
		font-size: 14px;
		margin-right: 3px;
	}
	.search {
		width: 300px;
	}
	.add {
		color: #409eff;
		border-radius: 4px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		border: 1px solid rgba(64, 158, 255, 0.2);
		background-color: rgba(64, 158, 255, 0.1);
	}
}
.pagination {
	display: flex;
	justify-content: flex-end;
}
</style>

