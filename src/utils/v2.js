export const name2id = name => {
    if( name == '产品' ) return 'MK-20180901-000001';
    if( name == '原料' ) return 'MK-20180901-000002';
    if( name == '种植' || name == 'zz' ) return 'MK-20180901-000003';
    if( name == '采收' || name == 'cs' ) return 'MK-20180901-000004';
    if( name == '加工' || name == 'jg' ) return 'MK-20180901-000005';
    if( name == '包装' || name == 'bz' ) return 'MK-20180901-000006';
    if( name == '仓储' || name == 'cc' ) return 'MK-20180901-000007';
    if( name == '检测' || name == 'jc' ) return 'MK-20180901-000008';
    if( name == '采购' || name == 'cg' ) return '';
}


// 模板数据处理 处理 id

export const setModule = data => {
    let moduleInfos = {};
    data.data.forEach( val => {
        if( val.moduleName == '产品' ) {
            moduleInfos[val.moduleName] = val;
        } else {
            moduleInfos[val.moduleName] = {
                'moduleStructureCode': val.uniqueCode,
                'moduleName':val.moduleName,
                'moduleDataCode': ''
            };
        }
    });
    return moduleInfos;
}


/**
 * 数组转为对象  [a] => [{name:'a', url:'a'}]
 * */

 export const arr2Obj = arr => {
     return arr.map( val => {
        return {name: val, url: val}
     })
 }
 export const obj2Arr = obj => {
     return obj.map( val => {
        return val.url
     })
 }

 /** 根据 url 删除 数组 */

 export const deleteUrl = (url, arr) => {
    return arr.filter(val => {
        return url != val.url;
    })
 }

