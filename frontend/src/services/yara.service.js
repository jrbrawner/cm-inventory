import axios from 'axios';

class YaraDataService {

    createText(data) {
        return axios.post(`/yara`, data, {"Content-Type": "multipart/form-data"})
    }

    createFile(data){
        return axios.post(`/yara/file`, data, {"Content-Type": "multipart/form-data"})
    }

    get(id) {
        return axios.get(`/yara/${id}`)
    }

    search(field, value) {
        return axios.get(`/yara/${field}/${value}`)
    }

}

export default new YaraDataService();