import axios from 'axios';

class YaraDataService {

    create(data) {
        return axios.post(`/yara`, data)
    }

    get(field, value) {
        return axios.get(`/yara/${field}/${value}`)
    }

}

export default new YaraDataService();