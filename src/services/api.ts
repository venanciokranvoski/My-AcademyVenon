import { AppError } from '@utils/AppError';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.64:3333'
})


api.interceptors.response.use(response => response, error => {
    // Editing Message Back-End 
    if(error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message));
    }else {
        return Promise.reject(new AppError(error))
    }
});



export { api }



//  api.interceptors.response.use((response)=>{
//     console.log("intercept response");
//     return Response;
// }, (error)=>{
//     return Promise.reject(error);
// });