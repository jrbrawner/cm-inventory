import axios from 'axios';

class SigmaDataService {

    create(data) {
        return axios.post(`/sigma`, data)
    }
    
    createFile(data){
        return axios.post(`/sigma/file`, data, {"Content-Type": "multipart/form-data"})
    }

    get(id) {
        return axios.get(`/sigma/${id}`)
    }

    update(id, data) {
        return axios.put(`/sigma/${id}`, data, {"Content-Type": "multipart/form-data"})
    }


    rebuildRule(id) {
        return axios.get(`/sigma/rebuild/${id}`)
    }

    search(field, value, page, size) {
        return axios.get(`/sigma/${field}/${value}`, {params: {page: page, size: size}})
    }

    delete(id) {
        return axios.delete(`/sigma/${id}`)
    }
}

export default new SigmaDataService();