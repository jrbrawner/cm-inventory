import axios from 'axios';

class SnortDataService {

    create(data) {
        return axios.post(`/snort`, JSON.stringify(data))
    }

    get(field, value) {
        return axios.get(`/snort/${field}/${value}`)
    }

    test(id) {
        return axios.get(`/snort/test/${id}/rebuild`)
    }

}

export default new SnortDataService();