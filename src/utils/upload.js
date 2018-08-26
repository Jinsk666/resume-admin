import OSS from 'ali-oss'
import axios from 'axios'
import { Message } from 'element-ui'
import { isImg } from './index'

//上传图片函数 这里用的 1.0 的上传图片方案
export const uploadImg = file => {
    if( !isImg(file.name) ) {
        Message({
            message: '只能上传图片',
            type:'error'
        })
        return;
    }
    var formData = new FormData();
    formData.append('file', file);
    formData.append('userId', '0');
    formData.append('flag', '');
    formData.append('fileType', '0');
    return new Promise((resolve, reject) => {
        axios.post("http://admin.ytbuyer.com/ytfarmapi/file/uploadImage", formData).then( res => {
            if(res.data.code == 0 && res.data.data.fileUrl){
                Message({
                    message:"上传成功",
                    type:'success'
                })
                resolve( res.data )
            }else{
                Message({
                    message:res.data.msg,
                    type:'error'
                })
                reject('')
            }
        }).catch( err => {
            Message({
                message: err,
                type:'error'
            })
            reject(err)
        })
    })
}

// oss 直传
export const uploadFileDemo = file => {
    var client = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAIChOnMI18Wf3p',
        accessKeySecret: 'wXXbrIkoXHmKh1WN2Ixp60HGl3wVay',
        bucket: 'acsm-erp'
    })
    return new Promise( (resolve, reject) => {
        client.multipartUpload(file.name, file).then( res => {
            Message({
                message:"上传成功",
                type:'success'
            })
            resolve(res)
        }).catch( err => {
            Message({
                message: err,
                type:'error'
            })
            reject(err)
        })
    })
}

export const isAcceptFile = file => {
    let unit = file.name.split('.');
    let last = unit[unit.length - 1];
    let arr = ['txt','doc','docx','xls','xlsx','pdf'];
    if( arr.indexOf(last) == -1 ){
        return false
    }
    return true
}

export const setOssUrl = (file,arr) => {
    arr.push({'name':file.name, 'url': 'http://img9.farmeasy.cn/' + file.name})
}