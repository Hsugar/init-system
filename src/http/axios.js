/**
 * created by yjn on 2018/12/15
 */
import axios from './index.js'
import qs from 'qs'
import {
	encryption,
	parseParam
} from '../tools/utils'
import {
	CODE,
	KEY
} from '../constant'


// 处理请求
async function _http(url = '', data = {}, type = 'GET') {
	type = type.toUpperCase()
	const defaultParams = {}
	let params = Object.assign({}, defaultParams, data)
	try {
		let response
		if (type === 'POST') {
			response = await axios({
				method: type,
				url: url,
				transformRequest: [function (data, headers) {
					data = qs.stringify(data)
					return data
				}],
				data: params
			})
		} else if (type === 'FILEPOST') {
			let formData = new FormData()
			for (let key in params) {
				formData.append(key, params[key])
			}
			response = await axios({
				method: 'POST',
				url: url,
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				data: formData
			})
		} else { // 默认按照get方式处理
			let signature = encryption(params, KEY)
			// console.log(signature)
			console.log('params2==', params, encryption(params, KEY))
			response = await axios({
				method: type,
				url: url,
				headers: {
					'Content-Type': 'multipart/form-data',
					'signature': signature,
				},
				params: params
			})
		}
		return new Promise((resolve, reject) => {
			if (response.data.code === CODE.SUCCESS) {
				resolve(response.data.data)
			} else {
				reject(response.data)
			}
		})
	} catch (error) {
		if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
			// router.push({
			//     name: 'error',
			//     query: {
			//         type: 'timeout'
			//     }
			// })
		}
		throw new Error(error)
	}
}

export default async (url, data, type) => {
	try {
		let result = await _http(url, data, type)
		return result
	} catch (e) {
		let {
			code = 600, msg = '网络异常，请检查网络重试'
		} = e
		let error = {
			code: code,
			msg: msg,
			message: msg
		}
		// eslint-disable-next-line
		return Promise.reject(error)
	}
}