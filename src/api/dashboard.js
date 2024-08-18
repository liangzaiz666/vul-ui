import request from '@/utils/request.js'
export const getVulDataAPI = () => {
    return request.get('/api/vuls/dataCount')
}

export const getTopVulAPI = () => {
    return request.get('/api/vuls/topCount')
}