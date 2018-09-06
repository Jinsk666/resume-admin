import request from '@/utils/request'

// 履历批次列表
export function getCodeList(likeParams, page) {
  return request({
    url: '/resume/V2.1/resumeBatchTwoOne/getList',
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
    url: '/resume/V2.1/resumeBatchTwoOne/getDetailList',
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
// 履历列表
export function getResumeList(likeParams, page, beginTime, endTime) {
    return request({
      url: '/resume/V2.1/resumeDataTwoOne/getList',
      method: 'post',
      data: {
          likeParams,
          page,
          beginTime,
          endTime
      }
    })
}
// 履历模板 2.1 没用到
export function getTemplateModule() {
    return request({
        url: '/resume/V2.0/template/getDetail/RT-20180801-000001',
        method: 'GET',
        data: {
       }
    })
}
// 添加批次信息
export function addCode(batchCode, numbers, insertUser, enterpriseInfoId) {
    return request({
        url: '/resume/V2.1/resumeBatchTwoOne/add',
        method: 'POST',
        data: {
		 	batchCode, numbers, insertUser, enterpriseInfoId
       }
    })
}
// 添加对用履历
export function setMapCode(resumeCode, inputCode, batchCode, startePoint, endPoint, insertUser, enterpriseInfoId) {
    return request({
		url: '/resume/V2.1/resumeBatchTwoOne/correspondeAdd',
		method: 'POST',
		data: {
			resumeCode,
			inputCode,
			batchCode,
			startePoint,
            endPoint,
            insertUser,
            enterpriseInfoId
		}
    })
}


// 添加批次信息
export function getMapResumeList(likeParams, page, uniqueCode, enterpriseInfoId) {
    return request({
      url: '/resume/V2.1/resumeBatchTwoOne/getBatchCorrespondList',
      method: 'POST',
      data: {
		likeParams, page, uniqueCode, enterpriseInfoId
      }
    })
}

// 删除 履历
export const deleteResume = code => {
    return request({
        url: '/resume/V2.1/resumeDataTwoOne/delete/' + code,
        method: 'DELETE',
        data: {
        }
    })
}
// 添加 履历
export const addResume = code => {
    return request({
        url: '/resume/V2.1/resumeDataTwoOne/add',
        method: 'POST',
        data: code
    })
}
// 修改 履历
export const editResume = code => {
    return request({
        url: '/resume/V2.1/resumeDataTwoOne/edit',
        method: 'PUT',
        data: code
    })
}
// 查找单个 履历数据
export const getResumeDetails = code => {
    return request({
        url: '/resume/V2.1/resumeDataTwoOne/getDetail/' + code,
        method: 'GET',
        data: {}
    })
}

