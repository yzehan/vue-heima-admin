// 素材管理模块
// 上传图片素材
import request from '@/utils/request'


export const uploadImage = (data) =>{
  return request ({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
  })
}


// 获取图片素材



export const getImages = (params) =>{
  return request ({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}
// 收藏接口
export const collectImage = (imageId, collect) =>{
  return request ({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}


// 删除接口
export const deleteImage = (imageId) =>{
  return request ({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`,
    
  })
}