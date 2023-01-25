import axios from 'axios';

class MitreDataService {

    getTactics() {
        return axios.get(`/mitre/tactics`)
    }

    getTactic(id) {
        return axios.get(`/mitre/tactics/${id}`)
    }

    getTacticTechniques(id) {
        return axios.get(`/mitre/tactic/${id}/techniques`)
    }

    getTechniques() {
        return axios.get(`/mitre/techniques`)
    }

    getTechnique(id) {
        return axios.get(`/mitre/technique/${id}`)
    }

    getSubtechniques() {
        return axios.get(`/mitre/subtechniques`)
    }

    getSubtechnique(id) {
        return axios.get(`/mitre/subtechnique/${id}`)
    }
    
}

export default new MitreDataService();
