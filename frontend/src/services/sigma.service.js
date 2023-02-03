import axios from 'axios';

class SigmaDataService {

    create(data) {
        return axios.post(`/sigma`, data)
    }

    get(id) {
        return axios.get(`/sigma/${id}`)
    }

    createFile(data){
        return axios.post(`/sigma/file`, data, {"Content-Type": "multipart/form-data"})
    }

    rebuildRule(id) {
        return axios.get(`/sigma/rebuild/${id}`)
    }
}

export default new SigmaDataService();