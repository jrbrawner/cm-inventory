import axios from 'axios';

class SigmaDataService {

    createText(data) {
        return axios.post(`/api/sigma`, data)
    }
    
    createFile(data){
        return axios.post(`/api/sigma/file`, data, {"Content-Type": "multipart/form-data"})
    }

    get(id) {
        return axios.get(`/api/sigma/${id}`)
    }

    update(id, data) {
        return axios.put(`/api/sigma/${id}`, data, {"Content-Type": "multipart/form-data"})
    }


    rebuildRule(id) {
        return axios.get(`/api/sigma/rebuild/${id}`)
    }

    search(field, value, page, size) {
        return axios.get(`/api/sigma/${field}/${value}`, {params: {page: page, size: size}})
    }

    delete(id) {
        return axios.delete(`/sigma/${id}`)
    }
}

export default new SigmaDataService();