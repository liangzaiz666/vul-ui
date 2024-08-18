import request from '@/utils/request.js'
export const userInfoAPI = (token) =>{
    return request({
        url:'/api/users',
        params:{
            token
        }
    })
}

export const getUsersAPI = ({pageNum,pageSize,username}) =>{
    return request({
        url:'/api/users/search',
        params:{
            pageNum,
            pageSize,
            username
        }
    })
}

export const updateUserAPI = (form) => {
    return request.post(`/api/users/update/${form.id}`, form)
}

export const deleteUserAPI = (id) =>{
    return request.delete(`/api/users/${id}`)
}

export const addUserAPI = (form) =>{
    return request.post('/api/users/add', form)
}