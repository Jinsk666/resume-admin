


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
	if( typeof(date) == 'number' || typeof(date) == 'string' ) {
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
		case '质检': return 'ZJ';
		case '原料': return 'YL';
	}
 }

/**
 * 是否是图片
 */
export const isImg = path => {
    if( /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(path) ) return true;
    else return false;
}