import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme } from "native-base";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";


export function Routes(){

    const {user, isLoadingUserStorageData} = useAuth();
  
    const nativeBasetheme = useTheme();

    console.log("USUARIO LOGADO ==> ", user);     

   const theme = DefaultTheme;
   theme.colors.background = nativeBasetheme.colors.gray[700]


   if(isLoadingUserStorageData){
      return  <Loading />
   }

    return (
        <Box flex={1} bg="gray.700">
            <NavigationContainer theme={theme}>
                {user.id ? <AppRoutes/> :<AuthRoutes />}
            </NavigationContainer>
        </Box>

    )
}