


/**
 * 填充函数
 */

const padLeft = ( value, num, pad ) => {
	var result = value + '';
	while( result.length < num ) {
		result = (pad || '0') + result;
	}
	return result;
}

/**
 * 格式化时间
 */

export const formatTime = ( date, format ) => {
	if( !date ) return '';
	if( typeof(date) == 'string' ) {
		date = Number(date);
	}
	if( typeof(date) == 'number' ) {
		date = new Date(date);
	}
	return (format || 'Y-m-d H:i:s.M').replace(/Y/g, padLeft(date.getFullYear(), 4))
		.replace(/m/g, padLeft(date.getMonth() + 1, 2))
		.replace(/d/g, padLeft(date.getDate(), 2))
		.replace(/H/g, padLeft(date.getHours(), 2))
		.replace(/i/g, padLeft(date.getMinutes(), 2))
		.replace(/s/g, padLeft(date.getSeconds(), 2))
		.replace(/M/g, padLeft(date.getMilliseconds(), 3));
}

/**
 * 处理 element 时间
 */

export const getEleTime = (time, type = 0) => {
	if(time.length == 0) return;
		var beginDate, endDate;
		if( type == 0 ) {
		beginDate = typeof time[0] != 'object' ? time[0] : time[0].getTime();
		endDate = typeof time[1] != 'object' ? time[1] : time[1].getTime();
		}else {
		beginDate = formatDate(time[0], 'Y-m-d');
		endDate = formatDate(time[1], 'Y-m-d');
		}
	return [beginDate, endDate]
}

 /**
  * 深克隆
  */

export const deepClone = obj => {
	return JSON.parse( JSON.stringify(obj) )
}

/**
 * 根据步骤 映射 Class
 */

 export const step2Class = name => {
	switch (name) {
		case '采购': return 'CG';
		case '采收': return 'CS';
		case '包装': return 'BZ';
		case '田间': return 'TJ';
		case '种植': return 'ZZ';
		case '仓储': return 'CC';
		case '加工': return 'JG';
		case '运输': return 'YS';
		case '检测': return 'JC';
		case '原料': return 'YL';
	}
 }

/**
 * 是否是图片
 */
export const isImg = path => {
	path = path.toLowerCase();
    if( /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(path) ) return true;
    else return false;
}

/**
 * 获取 scrollTop
 */

export const getScrollTop = () => {
	return document.documentElement.scrollTop || document.body.scrollTop;
}

 /**
  * 设置scrollTop
  */
export const setScrollTop = (code) => {
	document.documentElement.scrollTop = code;
	document.body.scrollTop = code;
}

/**
 * throttle 节流
 */
export const throttle = (func, wait, mustRun) => {
	var timeout,
		startTime = new Date();

	return function() {
		var context = this,
			args = arguments,
			curTime = new Date();

		clearTimeout(timeout);
		// 如果达到了规定的触发时间间隔，触发 handler
		if(curTime - startTime >= mustRun){
			func.apply(context,args);
			startTime = curTime;
		// 没达到触发间隔，重新设定定时器
		}else{
			timeout = setTimeout(func, wait);
		}
	};
};
// 是否是数字
export const isNumber = val => {
    if( val === "" || val ==null ){
        return false;
    }
    if( !isNaN(val) ){
        return true;
    }else{
        return false;
    }
}
/**  下拉框加载更多判断
 * @param ref => .resume-top .el-select-dropdown__wrap
 * @param cb  =>  callback
 */
export const scrollMore = (ref, cb, index = 0) => {
	let dom = document.querySelectorAll(ref)[index];
	var scrollTop = dom.scrollTop; // 滑动高度
	var windowHeight = dom.clientHeight; //可视区的高度
	var scrollHeight = dom.scrollHeight; //滚动条的总高度
	if(scrollTop + windowHeight == scrollHeight) {
		//TODO:
		cb();
	}
}


export const getByteLen = val => {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		var length = val.charCodeAt(i);
		if(length>=0&&length<=128)
		{
			len += 1;
		}
		else
		{
			len += 2;
		}
	}
	return len;
}