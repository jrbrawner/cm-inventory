import axios from 'axios';

class SnortEngineService {

    checkStatus() {
        return axios.get(`/api/snort-engine/status`)
    }

    readPcap(data){
        return axios.post(`/api/snort-engine/read-pcap`, data, {"Content-Type": "multipart/form-data"})
    }

    readPcapDetailed(data, show_raw_packet_deta) {
        return axios.post(`/api/snort-engine/read-pcap-detailed`, data, { params: {'show_raw_packet_data': show_raw_packet_deta}},
         {"Content-Type": "multipart/form-data"})
    }

    analyzePcapAll(data){
        return axios.post(`/api/snort-engine/analyze-pcap`, data, {"Content-Type": "multipart/form-data"})
    }

    analyzePcapInput(data){
        return axios.post(`/api/snort-engine/analyze-pcap/input`, data, {"Content-Type": "multipart/form-data"})
    }

    
}

export default new SnortEngineService();