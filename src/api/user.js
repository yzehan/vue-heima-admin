/*
用户请求模块
*/

import request from "@/utils/request"
// 用户登录
export const login = (data) => {
return request({
		method: "POST",
		url: "/mp/v1_0/authorizations",
		data
	})

}
// 获取用户资料
// export const getUserProfile = () => {
// 	return request ({
// 		method: 'GET',
// 		url: 
// 	})
// }






//获取用户登录信息
export const getUserProfile = () => {
	// const user = JSON.parse(window.localStorage.getItem('user'))
	// console.log(user)
	return request ({
		method: "GET",
		url: '/mp/v1_0/user/profile',
		// headers: {
		//  	Authorization: `Bearer ${user.token}`
		// }
	})
}


//修改用户头像
// data 必须传FormData对形象
export const updateUserPhoto = (data)=> {
	return request ({
		method: 'PATCH',
		url: '/mp/v1_0/user/photo',
		data
	})
}


//修改信息

export const updateUserProfile = (data)=> {
	return request ({
		method: 'PATCH',
		url: '/mp/v1_0/user/profile',
		data
	})
}
