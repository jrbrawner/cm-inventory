import axios from 'axios';

class SigmaDataService {

    create(data) {
        return axios.post(`/sigma`, JSON.stringify(data))
    }
}

export default new SigmaDataService();