import request from '@/utils/request'

// 履历批次列表
export function getCodeList(likeParams, page) {
  return request({
    url: '/resume/V2.0/resumeBatchTwo/getList',
    method: 'post',
    data: {
        likeParams,
        page
    }
  })
}
// 对应批次详情
export function getCodeDetailsList(batchCode, beginTime, endTime, likeParams, page) {
  return request({
    url: '/resume/V2.0/resumeBatchTwo/getDetailList',
    method: 'post',
    data: {
        batchCode,
        beginTime,
        endTime,
        likeParams,
        page
    }
  })
}
// 履历批次列表
export function getResumeList(likeParams, page) {
    return request({
      url: '/resume/V2.0/product/getList',
      method: 'post',
      data: {
          likeParams,
          page
      }
    })
}
// 履历模板
export function getTemplateModule() {
    return request({
        url: '/resume/V2.0/template/getDetail/RT-20180801-000001',
        method: 'GET',
        data: {
       }
    })
}
// 添加批次信息
export function addCode(batchCode, numbers) {
    return request({
        url: '/resume/V2.0/resumeBatchTwo/add',
        method: 'POST',
        data: {
		 	batchCode, numbers
       }
    })
}
// 添加对用履历
export function setMapCode(resumeCode, inputCode, batchCode, startePoint, endPoint) {
    return request({
		url: '/resume/V2.0/resumeBatchTwo/correspondeAdd',
		method: 'POST',
		data: {
			resumeCode,
			inputCode,
			batchCode,
			startePoint,
			endPoint
		}
    })
}


// 添加批次信息
export function getMapResumeList(likeParams, page, uniqueCode) {
    return request({
      url: '/resume/V2.0/resumeBatchTwo/getBatchCorrespondList',
      method: 'POST',
      data: {
		likeParams, page, uniqueCode
      }
    })
}

// 删除 履历
export const deleteResume = code => {
    return request({
        url: '/resume/V2.0/product/delete/' + code,
        method: 'DELETE',
        data: {
        }
    })
}
// 添加 履历
export const addResume = code => {
    return request({
        url: '/resume/V2.0/product/add',
        method: 'POST',
        data: code
    })
}
// 修改 履历
export const editResume = code => {
    return request({
        url: '/resume/V2.0/product/edit',
        method: 'PUT',
        data: code
    })
}
// 查找单个 履历数据
export const getResumeDetails = code => {
    return request({
        url: '/resume/V2.0/product/getDetail/' + code,
        method: 'GET',
        data: {}
    })
}

