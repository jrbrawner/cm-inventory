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

    getTacticYara(id, page, size) {
        return axios.get(`/mitre/tactic/${id}/yara`, {params: {page: page, size: size}})
    }

    getTacticSnort(id, page, size) {
        return axios.get(`/mitre/tactic/${id}/snort`, {params: {page: page, size: size}})
    }

    getTacticSigma(id, page, size){
        return axios.get(`/mitre/tactic/${id}/sigma`, {params: {page: page, size: size}})
    }

    getTechniqueYara(id, page, size) {
        return axios.get(`/mitre/technique/${id}/yara`, {params: {page: page, size: size}})
    }

    getTechniqueSnort(id, page, size) {
        return axios.get(`/mitre/technique/${id}/snort`, {params: {page: page, size: size}})
    }

    getTechniqueSigma(id, page, size){
        return axios.get(`/mitre/technique/${id}/sigma`, {params: {page: page, size: size}})
    }

    getSubtechniqueYara(id, page, size) {
        return axios.get(`/mitre/subtechnique/${id}/yara`, {params: {page: page, size: size}})
    }

    getSubtechniqueSnort(id, page, size) {
        return axios.get(`/mitre/subtechnique/${id}/snort`, {params: {page: page, size: size}})
    }
    
    getSubtechniqueSigma(id, page, size) {
        return axios.get(`/mitre/subtechnique/${id}/sigma`, {params: {page: page, size: size}})
    }
    
}

export default new MitreDataService();
