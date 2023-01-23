import axios from 'axios';

class YaraDataService {

    create(data) {
        return axios.post(`/yara`, JSON.stringify(data))
    }

    get(id) {
        return axios.get(`/yara/${id}`)
    }

    search(field, value) {
        return axios.get(`/yara/${field}/${value}`)
    }

}

export default new YaraDataService();