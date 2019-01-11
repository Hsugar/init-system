<template>
	<div class="form-input-box">
		<input
			v-on:blur="checkValid"
			:type="type"
			v-model="inputVal"
			:placeholder="placeholder"
			:name="name"
			:readonly="isReadOnly"
			@blur="blurEvent"
		>
		<span v-if="showError" class="error">{{errorMsg}}</span>
	</div>
</template>

<script type="text/ecmascript-6">
import inputType from "@/tools/type.js";

export default {
	name: "FormInput",
	props: {
		/*表单类型*/
		type: {
			type: String,
			default: "text"
		},
		/*表单默认值*/
		value: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: ""
		},
		name: {
			type: String,
			default: ""
		},
		/*验证类型*/
		checkType: {
			type: String,
			default: ""
		},
		/*是否检验*/
		isChecking: {
			type: Boolean,
			default: false
		},
		/*校验不通过时的错误信息*/
		errorMsg: {
			type: String,
			default: ""
    },
    /*是否只读*/
		isReadOnly: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		value(value) {
			this.inputVal = (value || "").trim();
		},
		inputVal(value) {
			this.$emit("input", value);
		},
		isChecking(current) {
			if (current) {
				this.checkValid();
			}
		}
	},
	methods: {
		checkValid() {
			var checkType = this.checkType;
			if (checkType && inputType[checkType]) {
				let isValid = inputType[checkType](this.inputVal);
				this.showError = !isValid;
				this.$emit("checked", isValid);
			}
		},
		blurEvent: function() {
			this.$emit("blurValue", this.inputVal);
		}
	},
	data() {
		return {
			showError: false,
			inputVal: this.value
		};
	},
	created() {
		if (this.checkType) {
		}
	}
};
</script>

<style scoped>
.form-input-box {
	/* margin-left: 98px; */
	position: relative;
}
.form-input-box input {
	display: block;
	width: 100%;
	height: 30px;
	line-height: 30px;
	border: 1px solid #D0D2D9;
	border-radius: 5px;
	box-sizing: border-box;
	text-indent: 15px;
}
.form-input-box input:focus {
	border-color: #acb5b9;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}
input[type="number"] {
	-moz-appearance: textfield;
}

.form-input-box .error {
	color: #eb6161;
	position: absolute;
	right: 15px;
	line-height: 32px;
	top: 0;
}

input::-webkit-input-placeholder {
	color: #D0D2D9;
}
input::-moz-placeholder {
	/* Mozilla Firefox 19+ */
	color: #D0D2D9;
}
input:-moz-placeholder {
	/* Mozilla Firefox 4 to 18 */
	color: #D0D2D9;
}
input:-ms-input-placeholder {
	/* Internet Explorer 10-11 */
	color: #D0D2D9;
}
</style>
