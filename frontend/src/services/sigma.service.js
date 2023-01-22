import axios from 'axios';

class SigmaDataService {

    create(data) {
        return axios.post(`/sigma`, JSON.stringify(data))
    }

    rebuild(id) {
        return axios.get(`/sigma/rebuild/${id}`)
    }
}

export default new SigmaDataService();