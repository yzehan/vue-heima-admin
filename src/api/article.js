// 文章获取请求

import request from '@/utils/request'

export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',

    //Body参数用 data设置
    // Query参数用 params 设置
    // Headers参数用 headers 设置
    params: params //用来接收用户传进来的数据对象
  })
}
// 封装获取文章频道接口

export const getArticlesChannals = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels',

    //Body参数用 data设置
    // Query参数用 params 设置
    // Headers参数用 headers 设置
    //params: params //用来接收用户传进来的数据对象
  })
}



//删除文章

export const deleteArticle = (articleId) => {
  return request({
    method: 'DELETE',

    // target
    url: `/mp/v1_0/articles/${articleId}`,

  })
}


//新建文章

export const addArticle = (data, draft) => {
  return request({
    method: 'POST',

    // target
    url: '/mp/v1_0/articles',

    params: {
      draft //是否存为草稿
    },
    data

  })
}


//获取文章

export const getArticle = (articleId) => {
  return request({
    method: 'GET',

    // target
    url: `/mp/v1_0/articles/${articleId}`,


  })
}


//修改文章

export const updateArticle = (articleId, data, draft) => {
  return request({
    method: 'PUT',

    // target
    url: `/mp/v1_0/articles/${articleId}`,

    params: {
      draft //是否存为草稿
    },
    data

  })
}

//修改评论状态

export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',

    
    url: '/mp/v1_0/comments/status',

    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }

  })
}




