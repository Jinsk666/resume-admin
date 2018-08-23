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
    return new Promise((resolve, reject)=> {
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
            reject('')
        })
    })
}

// oss 直传
export const uploadFile = file => {
    let client = new OSS({
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucket: '',
    })
    client.multipartUpload(file.name, file).then( res => {
        console.log(res)
    }).catch( err => {
        console.log(err)
    })
}