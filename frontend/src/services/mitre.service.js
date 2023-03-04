import axios from 'axios';

class MitreDataService {

    getTactics() {
        return axios.get(`/api/mitre/tactics`)
    }

    getTactic(id) {
        return axios.get(`/api/mitre/tactics/${id}`)
    }

    getTacticTechniques(id) {
        return axios.get(`/api/mitre/tactic/${id}/techniques`)
    }

    getTechniques() {
        return axios.get(`/api/mitre/techniques`)
    }

    getTechnique(id) {
        return axios.get(`/api/mitre/technique/${id}`)
    }

    getSubtechniques() {
        return axios.get(`/api/mitre/subtechniques`)
    }

    getSubtechnique(id) {
        return axios.get(`/api/mitre/subtechnique/${id}`)
    }

    getTacticYara(id, page, size) {
        return axios.get(`/api/mitre/tactic/${id}/yara`, {params: {page: page, size: size}})
    }

    getTacticSnort(id, page, size) {
        return axios.get(`/api/mitre/tactic/${id}/snort`, {params: {page: page, size: size}})
    }

    getTacticSigma(id, page, size){
        return axios.get(`/api/mitre/tactic/${id}/sigma`, {params: {page: page, size: size}})
    }

    getTechniqueYara(id, page, size) {
        return axios.get(`/api/mitre/technique/${id}/yara`, {params: {page: page, size: size}})
    }

    getTechniqueSnort(id, page, size) {
        return axios.get(`/api/mitre/technique/${id}/snort`, {params: {page: page, size: size}})
    }

    getTechniqueSigma(id, page, size){
        return axios.get(`/api/mitre/technique/${id}/sigma`, {params: {page: page, size: size}})
    }


    getSubtechniqueYara(id, page, size) {
        return axios.get(`/api/mitre/subtechnique/${id}/yara`, {params: {page: page, size: size}})
    }

    getSubtechniqueSnort(id, page, size) {
        return axios.get(`/api/mitre/subtechnique/${id}/snort`, {params: {page: page, size: size}})
    }
    
    getSubtechniqueSigma(id, page, size) {
        return axios.get(`/api/mitre/subtechnique/${id}/sigma`, {params: {page: page, size: size}})
    }
    
    createLayer(data) {
        return axios.post(`/api/mitre/layer`, data, {"Content-Type": "multipart/form-data"})
    }

    createHeatmap(data) {
        return axios.post(`/api/mitre/heatmap`, data, {"Content-Type": "multipart/form-data"})
    }
}

export default new MitreDataService();
