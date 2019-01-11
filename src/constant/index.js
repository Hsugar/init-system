var IS_DEV = location.hostname == 'localhost'; //是否为开发环境

/*----测试环境----*/
// var API_URL = 'http://api.abc.com'; //api接口
var API_URL = '/api/'; //api接口


var origin = location.origin;
var protocol = location.protocol;

/*是否为生产环境*/
var IS_PRO = !(origin.indexOf('localhost') > -1);

/*----生产环境----*/
if (IS_PRO) {
	API_URL = protocol + '//' + '';
	console.log(IS_PRO, 'IS_PRO');
}

export const CODE = { // 请求接口返回码
	SUCCESS: 200,
	TOKEN_INVALID: 14, // 登录失效
	SERVER_ERROR: 500 // 服务器错误
}

const KEY = '' // 密钥
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVpZCI6IjEwMDI0In0sImV4cCI6MTUzNDY0NTAwMX0.UvZCEz5o855z1Oo_kXWbU0eeLHn8VEuNXfrT7QHi9SU';
var WEB_DOMAIN = (function () {
	if (IS_DEV) return null;
	let _hostname = location.host.split('.');
	let n = _hostname.length;

	for (let i = n; i > 2; i--) {
		_hostname.shift();
	}
	return _hostname.join('.');
}());

export {
	IS_DEV,
	API_URL,
	KEY,
	TEST_TOKEN
};