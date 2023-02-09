import axios from 'axios';

class SnortDataService {

    createText(data) {
        return axios.post(`/snort`, data, {"Content-Type": "multipart/form-data"})
    }

    createFile(data){
        return axios.post(`/snort/file`, data, {"Content-Type": "multipart/form-data"})
    }
    
    get(id) {
        return axios.get(`/snort/${id}`)
    }
    
    update(id, data) {
        return axios.put(`/snort/${id}`, data, {"Content-Type": "multipart/form-data"})
    }

    delete(id) {
        return axios.delete(`/snort/${id}`)
    }
    
    rebuildRule(id) {
        return axios.get(`/snort/rebuild/${id}`)
    }

    search(field, value, page, size) {
        return axios.get(`/snort/${field}/${value}`, {params: {page: page, size: size}})
    }

    testRule(data) {
        return axios.post(`/snort/test`, data, {"Content-Type": "multipart/form-data"})
    }
}

export default new SnortDataService();