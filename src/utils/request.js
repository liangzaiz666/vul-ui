import axios from 'axios'
import router from "../router";

const request = axios.create({
    baseURL: 'http://192.168.1.5:8080',
    timeout: 5000,

})

// 请求拦截器
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    // 处理请求错误
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        if (error.response && error.response.status === 403) {
            // 处理 403 错误
            console.error('403 Forbidden Error: Access denied');
            router.push('/login')
        }
        return Promise.reject(error);
    }
);

export default request