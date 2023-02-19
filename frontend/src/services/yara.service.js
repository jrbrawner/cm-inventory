import axios from 'axios';

class YaraDataService {

    createText(data) {
        return axios.post(`/api/yara`, data, {"Content-Type": "multipart/form-data"})
    }

    createFile(data){
        return axios.post(`/api/yara/file`, data, {"Content-Type": "multipart/form-data"})
    }

    get(id) {
        return axios.get(`/api/yara/${id}`)
    }

    update(id, data) {
        return axios.put(`/api/yara/${id}`, data, {"Content-Type": "multipart/form-data"})
    }

    delete(id) {
        return axios.delete(`/api/yara/${id}`)
    }

    search(field, value, page, size) {
        return axios.get(`/api/yara/${field}/${value}`, {params: {page: page, size: size}})
    }

    test(id, ioc_text) {
        return axios.post(`/api/yara/test/${id}`, ioc_text)
    }

    testAllIOC(ioc_text) {
        return axios.post(`/api/yara/ioc`, ioc_text)
    }

}

export default new YaraDataService();