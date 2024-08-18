import request from '@/utils/request.js';
import axios from "axios";

export const getVulsAPI = ({ pageNum, pageSize, name, ip, level, priority, status, startTime, endTime}) => {
    return request({
        url: '/api/vuls',
        params: {
            pageNum,
            pageSize,
            name,
            ip,
            level,
            priority,
            status,
            startTime,
            endTime,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const deleteVulAPI = (id) => {
    return request.delete(`/api/vuls/${id}`)
}

export const batchDeleteVulsAPI = (ids) => {
    return request.post('/api/vuls/deleteBatch', ids)
}

export const updateVulAPI = (form) => {
    return request.put(`/api/vuls/${form.id}`, form)
}

export const addVulAPI = (form) => {
    return request.post('/api/vuls/add', form)
}

export const importFileAPI = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/api/vuls/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
};

export const coutPriorityAPI = () => {
    return request.get('/api/vuls/coutPriority')
}

export const batchEditStatusAPI = (ids, newStatus) => {
    return request.post('/api/vuls/batchEditStatus', ids, { params: { newStatus}})
}

