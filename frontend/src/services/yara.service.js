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

    update(id, data) {
        return axios.put(`/yara/${id}`, data, {"Content-Type": "multipart/form-data"})
    }

    delete(id) {
        return axios.delete(`/yara/${id}`)
    }

    search(field, value, page, size) {
        return axios.get(`/yara/${field}/${value}`, {params: {page: page, size: size}})
    }

    test(id, ioc_text) {
        return axios.post(`/yara/test/${id}`, ioc_text)
    }

    testAllIOC(ioc_text) {
        return axios.post(`/yara/ioc`, ioc_text)
    }

}

export default new YaraDataService();