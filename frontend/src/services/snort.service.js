import axios from 'axios';

class SnortDataService {

    search(field, value, page, size) {
        return axios.get(`/snort/${field}/${value}`, {params: {page: page, size: size}})
    }

    get(id) {
        return axios.get(`/snort/${id}`)
    }

    delete(id) {
        return axios.delete(`/snort/${id}`)
    }
}

export default new SnortDataService();