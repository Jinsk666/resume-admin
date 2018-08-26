import { getModuleData } from '@/api/v2'

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

 export const name2Type = name => {
    if( name == '原料' ) return '1';
    if( name == '种植' || name == 'zz' ) return '2';
    if( name == '采收' || name == 'cs' ) return '3';
    if( name == '加工' || name == 'jg' ) return '4';
    if( name == '包装' || name == 'bz' ) return '5';
    if( name == '仓储' || name == 'cc' ) return '6';
    if( name == '检测' || name == 'jc' ) return '7';
    if( name == '采购' || name == 'cg' ) return '';
}

 export const dataPool = (list, globalPool) => {
    for(var i = 0; i < list.length; i++){
        var type = name2Type(list[i].moduleName);
        var code = list[i].moduleDataCode;
        (function(type, code){
            if( !code || globalPool[code] ) return;
            getModuleData(code, type).then( data => {
                globalPool[code] = data.data;
            })
        }(type, code))
    }
 }
 // 获取原料 数据
 export const materialData = code => {
    return new Promise( (resolve, reject) => {
        getModuleData(code, 1).then( data => {
            resolve(data.data);
        }).catch( err => {
            reject(err);
        })
    })
 }
// 企业 id 获取
 export const factoryId2FactoryName = arr => {
     if( !arr ) return '';
     for( let i = 0; arr.generalInfoList && i < arr.generalInfoList.length; i++){
        let val = arr.generalInfoList[i];
        if( val.dataType == 7  && val.label.indexOf('企业') != -1 ) {
            return val.value;
        }
     }
     return '';
 }

 // 验证 generalInfoList 的必填项

 export const generalValidate = arr => {
    for( let i = 0; arr.generalInfoList && i < arr.generalInfoList.length; i++){
        let val = arr.generalInfoList[i];
        if( val.required  && (val.value == '' || val.value == null || val.value == undefined) ) {
            return val.label;
        }
    }
    return '';
 }

 // 判断 种植基本信息里 繁殖材料来源 是 自繁 还是外采
    // 自繁 返回 true
 export const isInnerOrOuter = arr => {
    for( let i = 0; arr.generalInfoList && i < arr.generalInfoList.length; i++){
        let val = arr.generalInfoList[i];
        if( val.label == '繁殖材料来源' && val.value == '自繁') {
            return false
        }
    }
    return true
 }

 // 判断编码
 const moduleInfosIsCode = arr => {
     for( let i = 0; i < arr.moduleInfos.length; i++ ) {
         if( arr.moduleInfos[i].moduleDataCode == '' || arr.moduleInfos[i].moduleDataCode == null ) {
             return false
         }
     }
     return true;
 }

 export const isHaveCode = arr => {
    if( moduleInfosIsCode(arr) ){
        if( arr.resumeTemplateTwoOnes && arr.resumeTemplateTwoOnes.length > 0 ) {
            for( let i = 0; i < arr.resumeTemplateTwoOnes.length; i++ ) {
                let row = arr.resumeTemplateTwoOnes[i];
                if( !row.uniqueCode ) return false;
                if( !moduleInfosIsCode(row) ) return false;
            }
        }
    }else {
        return false;
    }
    return true;
 }


