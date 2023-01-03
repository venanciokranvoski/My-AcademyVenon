import {useContext} from "react";

import { AuthContext } from '../../src/context/AuthContext';

export function useAuth(){
    const context = useContext(AuthContext);
    return context;
}