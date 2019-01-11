<template>
	<div>
		<Position>
			<!-- <span>学生档案</span> -->
		</Position>
		<div class="options p26">
			<div class="item">
				<!-- 大区 -->
				<div class="select-campus">
					<span class="select-name">大区：</span>
					<el-select v-model="areaVal" filterable placeholder="请选择" @change="onChange(1,areaVal)">
						<el-option
							v-for="item in areaName"
							:key="item.bigAreaId"
							:label="item.bigAreaName"
							:value="item.bigAreaId"
						></el-option>
					</el-select>
				</div>
				<!-- 省份 -->
				<div class="select-point">
					<span class="select-name">省份：</span>
					<el-select v-model="proviceVal" filterable placeholder="请选择" @change="onChange(2,proviceVal)">
						<el-option
							v-for="item in proviceName"
							:key="item.provinceId"
							:label="item.provinceName"
							:value="item.provinceId"
						></el-option>
					</el-select>
				</div>
				<!-- 城市 -->
				<div class="select-class">
					<span class="select-name">城市：</span>
					<el-select v-model="cityVal" filterable placeholder="请选择" @change="onChange(3,cityVal)">
						<el-option
							v-for="item in cityName"
							:key="item.cityId"
							:label="item.cityName"
							:value="item.cityId"
						></el-option>
					</el-select>
				</div>
				<!-- 区 -->
				<div class="select-point">
					<span class="select-name">区：</span>
					<el-select v-model="districtVal" filterable placeholder="请选择">
						<el-option
							v-for="item in districtName"
							:key="item.areaId"
							:label="item.areaName"
							:value="item.areaId"
						></el-option>
					</el-select>
				</div>
				<!-- 学校 -->
				<div class="select-point">
					<span class="select-name">学校：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
			</div>
			<div class="item rule">
				<!-- 学校名称 -->
				<div class="select-order">
					<span class="select-name">学校名称：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- 状态 -->
				<div class="select-order">
					<span class="select-name">状态：</span>
					<el-select v-model="campusVal" filterable placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<!-- 季节 -->
			</div>
			<div class="item">
				<el-button type="primary">导出</el-button>
				<div class="operate-right">
					<el-button type="primary">查询</el-button>
					<el-button type="primary" class="reset">重置</el-button>
					<el-button type="primary" @click="add">添加</el-button>
					<!--:disabled="!creativeIds.length"-->
					<!-- <el-button type="primary" plain size="small" @click="batch(1)">批量通过</el-button> -->
					<el-button type="danger" plain size="small" @click="onDel(2)">批量删除</el-button>
				</div>
			</div>
		</div>
		<div class="bg-empty"></div>
		<div class="table">
			<el-table :data="list" @selection-change="handleSelectionChange" style="width: 100%">
				<el-table-column type="selection" disabled width="55"></el-table-column>
				<el-table-column prop="bigAreaName" label="校区名称" sortable></el-table-column>
				<el-table-column prop="campusName" label="所属学校"></el-table-column>
				<el-table-column prop="classroomNum" label="教室数量">{{2}}</el-table-column>
				<el-table-column prop="createTime" sortable label="创建时间"></el-table-column>
				<el-table-column prop="campusStatus" label="状态"></el-table-column>
				<el-table-column prop="address" label="停用时间"></el-table-column>
				<el-table-column prop="createUser" label="停用人"></el-table-column>
				<el-table-column label="操作" width="260">
					<template slot-scope="scope">
						<el-button size="mini" @click="onEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" @click="onEdit(scope.$index, scope.row)">启用</el-button>
						<el-button size="mini" @click="onEdit(scope.$index, scope.row)">上移</el-button>
						<el-button size="mini" @click="onDel(scope.$index, scope.row)">下移</el-button>
						<el-button size="mini" type="danger" @click.native.prevent="deleVisible = true; deleteId = scope.row.id">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

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
		<!-- 删除校区dialog -->
		<el-dialog title="删除校区" :visible.sync="deleVisible" :show-close="false" center width="30%">
			<span>删除后无法恢复，是否删除？</span>
			<div slot="footer" class="dialog-footer">
				<el-button type="danger" @click="onDel(deleteId)" size="small" plain class="footer-btn">删 除</el-button>
				<el-button @click="deleVisible = false" size="small" plain class="footer-btn">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Position from "@/components/Position.vue";
import { list, campus, onDel } from "../../service/record/campus";

export default {
	name: "Campus",
	data() {
		return {
			areaVal: "", //大区选中值
			proviceVal: "", //省份选中值
			cityVal: "", //城市选中值
			districtVal: "", //区选中值
			campusVal: "", //校区选中值
			classVal: "", //班级名称项值

			areaName: [], //大区下拉框
			proviceName: [], //校区下拉框选项值
			cityName: [], //城市下拉框
			districtName: [], //区下拉框
			options: [
				{
					value: "选项1",
					label: "黄金糕"
				},
				{
					value: "选项2",
					label: "黄金"
				}
			],
			//列表数据
			list: [
				{
					date: "2018-05-02",
					name: "王小虎",
					address: "上海市普陀区金沙江路 1518 弄"
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
			addDialog: false,
			deleVisible: false, //删除弹框
			deleteId: "" // 需要删除的数据id
		};
	},
	components: {
		Position
	},
	computed: {},
	created() {
		this.getList();
		this.onChange();
	},
	mounted() {},
	methods: {
		//获取列表数据
		getList: async function() {
			let param = {
				pageNum: 1,
				pageSize: 10
				// bigAreaId: 136
			};
			try {
				let data = await list(param);
				this.list = data.value.list;
			} catch (e) {
				console.log(e);
				let { msg } = e;
				console.log(e);
				// this.$message.warning(msg);
			}
		},
		/**
		 * 下拉事件
		 * @param {上级id} selectId
		 * @param {选项id指} id
		 */
		onChange: async function(selectId, id) {
			let param = {
				selectId: selectId || 0,
				id: id || 2
			};
			console.log(param);
			try {
				let data = await campus(param);
				this.areaName = data.value;
				console.log("campus==", data);
				if (selectId === 1) {
					this.proviceName = data.value;
					console.log("proviceName==", this.proviceName);
				}
				if (selectId === 2) {
					this.cityName = data.value;
					console.log("cityName==", this.cityName);
				}
				if (selectId === 3) {
					this.districtName = data.value;
					console.log("districtName==", this.districtName);
				}
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		onDel: async function(id) {
			console.log('deleteid===',id);
			try {
				let result = await onDel({ id: id });
			} catch (error) {
				this.$message(error)
			}
			this.deleVisible = false;
		},
		//编辑
		onEdit(index) {
			this.$router.push("editCampus");
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

		//跳转新增校区页面
		add() {
			this.$router.push("addCampus");
		}
	}
};
</script>

<style lang="scss" scoped>
.options {
	border-bottom: 1px solid #e7e9ef;
	padding-bottom: 15px;
}
.item {
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&.last {
		justify-content: flex-start;
		div {
			margin-right: 40px;
		}
	}
	&.rule {
		justify-content: flex-start;
		div {
			width: 20%;
			margin-right: 27px;
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
	.operate-right .el-button {
		margin-left: 34px;
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

