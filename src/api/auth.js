import request from '@/utils/request.js'
export const loginAPI = (form) => {
    return request.post('/api/auth/login', form)
}

export const registerAPI = (form) => {
    return request.post('/api/auth/register', form)
}