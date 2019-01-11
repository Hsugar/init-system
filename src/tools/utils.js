/**
 * created by yjn on 2018/12/18
 */
import CryptoJS from 'crypto-js';

/**
 * 封闭全局加密方法
 * @param {密钥} key 
 * @param {参数名} value 
 */

function encryption(val, key) {
	console.log('明文：', key, val);
	var jsonstr = objKeySort(val);
	console.log("排序后：", jsonstr);
	jsonstr = parseParam(jsonstr).substring(1);
	console.log('对象分解后：', jsonstr);
	var sha1Pw = CryptoJS.HmacSHA1(jsonstr, key).toString().toUpperCase(); //sha1加密
	console.log('sha1加密:', sha1Pw);
	return sha1Pw;
}
//排序的函数
function objKeySort(obj) {
	var newkey = Object.keys(obj).sort();
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
	for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
		newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
	}
	return newObj; //返回排好序的新对象
}

/**
 * 分解拼接参数
 * @param {*} param 
 * @param {*} key 
 */
function parseParam(param, key) {
	if (param == null) return '';
	var paramStr = '';
	var t = typeof (param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&' + key + '=' + (encodeURIComponent(param));
	} else {
		for (var i in param) {
			// var k = key ? i : key + (param instanceof Array ? '[' + i + ']' : (param instanceof Object ? '.' : '') + i); 
			// var k = key ? i : key + i;
			// paramStr += parseParam(param[i], k);
			paramStr += parseParam(param[i], i);
		}
	}
	return paramStr;
};

export {
	parseParam,
	encryption
}