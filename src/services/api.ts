import { AppError } from '@utils/AppError';
import axios, { AxiosInstance } from 'axios';


import { storageAuthTokenGet, storageAuthTokenSave } from '@storage/storageAuthToken';



type PromisseType = {
    resolver: (value?: unknown) => void;
    reject: (value:unknown)=> void;
}

type ProcessQueueParams = {
    error: Error | null;
    token: string | null;
}

type RegisterInterfaceTokenManagerProps = {
       signOut: () => void;
       refreshTokenUpdate : (newToken: string) => void;
}

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager : ({ }: RegisterInterfaceTokenManagerProps) => () => void;
}


const api = axios.create({
    baseURL: 'http://192.168.15.64:3333'
}) as APIInstanceProps;

let isRefreshing = false;
let failedQueue: Array<PromisseType> = [];

const ProcessQueue = ({ error, token = null}: ProcessQueueParams ): void => {
    failedQueue.forEach(request => {
        if(error){
            request.reject(error);
        }else {
            request.resolver(token);
        }
    })
    failedQueue = [];
}

api.registerInterceptTokenManager = ({signOut,refreshTokenUpdate}) => {
    const interceptTokenManager = api.interceptors.response.use(response => response, async requestError => {
    if(requestError?.response?.status === 401){
        if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid'){
               const currentToken = await storageAuthTokenGet();

               if(!currentToken){
                signOut();
                return Promise.reject(requestError);
               }
               // fila de requisição token 
               const orinalRequest = requestError.config;

               if(isRefreshing){
                  return new Promise((resolver, reject)=> {
                    failedQueue.push({resolver, reject});
                  })
                  .then((token)=> {
                    orinalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(orinalRequest);
                  })
                  .catch((error)=> {
                    throw error
                  })
               }
              isRefreshing = true;

              return new Promise(async(resolve, reject)=> {
                try {
                    const { data } = await api.post('/sessions/refresh-token', {token: currentToken});
                
                    await storageAuthTokenSave(data.token);
    
                    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                    orinalRequest.headers['Authorization'] = `Bearer ${data.token}`;
                    
                    refreshTokenUpdate(data.token);
                    ProcessQueue({error: null, token: data.token});
                    resolve(orinalRequest);
                } catch (error: any) {
                
                ProcessQueue({error, token: null});
                signOut();
                reject(error);
                }finally{
                    isRefreshing: false;
                }

                
              })
        }

        signOut();
    }

        // Editing Message Back-End 
        if(requestError.response && requestError.response.data){
            return Promise.reject(new AppError(requestError.response.data.message));
        }else {
            return Promise.reject(requestError);
        }
    });

    return () => {
        api.interceptors.response.eject(interceptTokenManager);
    }
};





export { api }



//  api.interceptors.response.use((response)=>{
//     console.log("intercept response");
//     return Response;
// }, (error)=>{
//     return Promise.reject(error);
// });