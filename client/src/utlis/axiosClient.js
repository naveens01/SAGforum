import axios from "axios";


export const axiosClient = axios.create({
    baseURL : 'http://naveen.dofreshmind.com/'
})
export default axiosClient;