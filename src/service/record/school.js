import axios from '../../http/axios'

// test
export const list = query => axios('basic/time/resetTime', query || {'levelId': 1}, 'GET');
// export const list = query => axios('basic/level/getLevelById?levelId=1', query || {'levelId': 1}, 'GET');