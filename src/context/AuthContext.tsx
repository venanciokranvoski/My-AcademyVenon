import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";

import  { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from "@storage/storageAuthToken";
import  { storageUserGet, storageUserSave, storageUserRemove } from '@storage/storageUser';


export type AuthContextDataProps = {
    user    : UserDTO;
    signIn : (email: string, password: string)=> Promise<void>;
    isLoadingUserStorageData: boolean;
    signOut: ()=>Promise<void>;
}


type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps){

    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingUserStorageData, setisLoadingUserStorageData] = useState(true);

    async function UserAndTokenUpdate(userData: UserDTO, token: string){
           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
           setUser(userData);
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string){
        try {
            setisLoadingUserStorageData(true)
            await storageUserSave(userData);
            await storageAuthTokenSave(token); 
        } catch (error) {
            throw error;
        }finally{
            setisLoadingUserStorageData(false)
        }
    }


    async function signIn(email: string, password: string){
        try {
            const { data } = await api.post('/sessions', {email, password});
            if(data.user && data.token){
               await storageUserAndTokenSave(data.user, data.token);
               UserAndTokenUpdate(data.user, data.token);        
            }
        } catch (error) {
           throw error;           
        }finally{
            setisLoadingUserStorageData(false);
        }
    }

    async function signOut(){
        try {
           setisLoadingUserStorageData(true);   
           setUser({} as UserDTO);
           await storageUserRemove();
           await storageAuthTokenRemove();
        } catch (error) {
           throw error ;
        }finally{
            setisLoadingUserStorageData(false);
        }
    }



    async function loadUserData(){
        try {
         setisLoadingUserStorageData(true);

         const userlogged = await storageUserGet();
         const token = await storageAuthTokenGet();

         if(token && userlogged){
           UserAndTokenUpdate(userlogged, token); 
          }
        } catch (error) {
         throw error;   
        }finally{
            setisLoadingUserStorageData(false);
        } 
    }


    useEffect(()=> {
    loadUserData();      
    },[]);
  
    return (
        <AuthContext.Provider value={{ user, signIn, isLoadingUserStorageData, signOut }}>
           {children}
        </AuthContext.Provider>
    )
}