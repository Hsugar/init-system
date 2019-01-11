
const storage = {
	setStorage(name, value){
		if(window.localStorage){
			window.localStorage.setItem(name, value);
		}else{
			this.setCookie(name, value)
		}
	},
	getStorage(name){
		if(window.localStorage){
			return window.localStorage.getItem(name);
		}else{
			return this.getCookie(name)
		}
	},
	removeStorage(name){
		if(window.localStorage){
			window.localStorage.removeItem(name)
		}else{
			this.removeCookie(name)
		}
	},
	/*expires为秒*/
	setCookie(name, value, expires){
		var oDate = new Date();

		if(oDate){
			oDate.setTime( oDate.getTime() + expires*1000 )
		}

		document.cookie = [
			name + "=" + decodeURIComponent(value),
			expires ? 'expires' + '=' + oDate.toGMTString() : '',
			'path=/',
		].join('; ')
	},
	getCookie(name, value){
		var cookies = document.cookie;
		var res = null;
		if(cookies.indexOf(name) < 0)return null;
		(cookies.split('; ') || []).map((item)=>{
			let ret = item.split('=');
			if(ret[0] == name){
				res = ret[1];
			}
		});
		return res;
	},
	removeCookie(name){
		this.setCookie(name, null, -1);
	}
}


export default storage;
