import request from '@/utils/request'

/*******  模板模块   ************/

// 模块空白数据
export function getModelList() {
    return request({
      url: '/resume/V2.1/moduleStructure/getList',
      method: 'post',
      data: {
      }
    })
}


// 模板列表
export function getModuleList(likeParams, page) {
  return request({
    url: '/resume/V2.1/resumeTemplateTwoOne/getList',
    method: 'post',
    data: {
        likeParams,
        page
    }
  })
}
// 获取单个模版
export function getModuleDetails(code) {
  return request({
    url: '/resume/V2.1/resumeTemplateTwoOne/getDetail/' + code,
    method: 'get',
    data: {
    }
  })
}

// 新增模板
export function addModule(data) {
  return request({
    url: '/resume/V2.1/resumeTemplateTwoOne/add',
    method: 'post',
    data: data
  })
}

// 编辑模板
export function editModule(data) {
  return request({
    url: '/resume/V2.1/resumeTemplateTwoOne/edit',
    method: 'put',
    data: data
  })
}
// 删除模板
export function deleteModule(code) {
  return request({
    url: '/resume/V2.1/resumeTemplateTwoOne/delete/' + code,
    method: 'delete',
    data: {}
  })
}


/*******  溯源数据模块   ************/

// 获取步骤列表
export const getModuleDataList = (likeParams, page, type) => {
  return request({
    url: '/resume/V2.1/moduleData/getList',
    method: 'post',
    data: {
      likeParams: likeParams,
      page: page,
      type: Number(type)
    }
  })
}

// 添加步骤
export const addModuleData = data => {
  return request({
    url: '/resume/V2.1/moduleData/add',
    method: 'post',
    data: data
  })
}
// 修改步骤
export const editModuleData = data => {
  return request({
    url: '/resume/V2.1/moduleData/edit',
    method: 'put',
    data: data
  })
}
// 发布步骤
export const publishModuleData = (uniqueCode, type, selectEnterpriseCode, selectEnterpriseName) => {
  return request({
    url: '/resume/V2.1/moduleData/release',
    method: 'put',
    data: {
      selectEnterpriseCode,
      selectEnterpriseName,
      uniqueCode,
      type
    }
  })
}
// 删除步骤
export const deleteModuleData = ( uniqueCode, type ) => {
  return request({
    url: '/resume/V2.1/moduleData/delete',
    method: 'delete',
    data: {
      uniqueCode,
      type
    }
  })
}
// 获取步骤信息
export const getModuleData = ( uniqueCode, type ) => {
  return request({
    url: '/resume/V2.1/moduleData/getDetail',
    method: 'post',
    data: {
      uniqueCode,
      type
    }
  })
}


// 企业相关

  // 获取企业列表
  export const getFactoryList = (likeParams, page, type) => {
    return request({
      url: '/resume/V2.1/enterpriseInfoTwoOne/getList',
      method: 'post',
      data: {
        likeParams,
        page,
        type
      }
    })
  }
  // 添加企业
  export const addFactory = data => {
    return request({
      url: '/resume/V2.1/enterpriseInfoTwoOne/add',
      method: 'post',
      data: data
    })
  }
  // 修改企业
  export const editFactory = data => {
    return request({
      url: '/resume/V2.1/enterpriseInfoTwoOne/edit',
      method: 'put',
      data: data
    })
  }
  // 删除企业
  export const deleteFactory = code => {
    return request({
      url: '/resume/V2.1/enterpriseInfoTwoOne/delete/' + code,
      method: 'delete',
      data: {}
    })
  }
  // 获取企业信息
  export const getFactory = code => {
    return request({
      url: '/resume/V2.1/enterpriseInfoTwoOne/getDetail/' + code,
      method: 'get',
      data: {}
    })
  }
  //发布数据的企业
  export const getStaticFactoryList = (likeParams, page, type) => {
    return request({
      url: '/resume/V2.1/releaseEnterpriseTwoOne/getList',
      method: 'post',
      data: {
        likeParams,
        page,
        type
      }
    })
  }
  // 数据接入列表
  export const getStaticModuleList = (enterpriseInfoSelectCode, likeParams, page, type) => {
    return request({
      url: '/resume/V2.1/moduleData/getAccessList',
      method: 'post',
      data: {
        enterpriseInfoSelectCode,
        likeParams,
        page,
        type
      }
    })
  }



