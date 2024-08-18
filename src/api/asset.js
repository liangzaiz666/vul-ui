import request from "@/utils/request.js";

export const getAssetsAPI = ({ pageNum, pageSize, name, ip, systemName, worth}) => {
    return request({
        url: '/api/assets',
        params: {
            pageNum,
            pageSize,
            name,
            ip,
            systemName,
            worth,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const deleteAssetAPI = (id) => {
    return request.delete(`/api/assets/${id}`)
}

export const batchDeleteAssetsAPI = (ids) => {
    return request.post('/api/assets/deleteBatch', ids)
}

export const updateAssetAPI = (form) => {
    return request.post(`/api/assets/${form.id}`, form)
}

export const addAssetAPI = (form) => {
    return request.post('/api/assets/add', form)
}

export const importFileAPI = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/api/assets/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
}