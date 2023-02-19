import axios from 'axios';

class SnortDataService {

    createText(data) {
        return axios.post(`/api/snort`, data, {"Content-Type": "multipart/form-data"})
    }

    createFile(data){
        return axios.post(`/api/snort/file`, data, {"Content-Type": "multipart/form-data"})
    }
    
    get(id) {
        return axios.get(`/api/snort/${id}`)
    }
    
    update(id, data) {
        return axios.put(`/api/snort/${id}`, data, {"Content-Type": "multipart/form-data"})
    }

    delete(id) {
        return axios.delete(`/api/snort/${id}`)
    }
    
    rebuildRule(id) {
        return axios.get(`/api/snort/rebuild/${id}`)
    }

    search(field, value, page, size) {
        return axios.get(`/api/snort/${field}/${value}`, {params: {page: page, size: size}})
    }

    testRule(data) {
        return axios.post(`/api/snort/test`, data, {"Content-Type": "multipart/form-data"})
    }

    deconstructRule(data) {
        return axios.post(`/api/snort/deconstruct`, data, {"Content-Type": "multipart/form-data"})
    }

    deconstructRuleId(id) {
        return axios.get(`/api/snort/deconstruct/${id}`);
    }
}

export default new SnortDataService();