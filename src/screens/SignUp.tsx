import React, { useState } from 'react';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import BackgroundImage from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios';
import { api } from '@services/api';
import { Alert } from 'react-native';
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';
import { SignIn } from './SignIn';
import { useAuth } from '@hooks/useAuth';


type FormDataProps = {
  name: string;
  email:string;
  password: string;
  confirm_password: string;
}


const signUpSchema = yup.object({
  name : yup.string().required('Informe o nome !'),
  email: yup.string().required('Informe o email !').email('E-mail inválido !'),
  password: yup.string().required('Informe a senha !').min(6, 'A senha deve ter pelo menos 6 digitos !'),
  confirm_password : yup.string().required('Confirme a senha !').oneOf([yup.ref('password'), null], 'A confirmação da senha não confere !')
});


export function SignUp(){
    const [isLoading, setisLoading] = useState(false);
    const navigation = useNavigation();

    const toast = useToast();

    const { SignIn } = useAuth();


    const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
      resolver: yupResolver(signUpSchema)
    });

    function handleGoBack(){
     navigation.goBack();  
    }


    async function handleSignUp({name, email, password,}: FormDataProps){
    //++  Axios   
    try {
      setisLoading(true);
      await api.post('/users', {name, email, password});
      await SignIn(email, password);

    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possivel criar a conta. Tente novamente mais tarde!';

      toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
      })

      // pegando mensagem do axios tratada pelo Back-end
      // if(axios.isAxiosError(error)){
      //   Alert.alert('Error', error.response?.data.message);
      // }
      
    }

    //=====
    //  ======================== fetch ================================
    //    const response = await fetch('http://192.168.15.64:3333/users', {
    //    method: 'POST',
    //    headers: {
    //      'Accept': 'aplication/json',
    //      'Content-Type': 'application/json'
    //    },
    //    body: JSON.stringify({name, email, password})
    //  }); 
    //   const data = await response.json(); 
    //   console.warn(data);
    //  ================================================================
         
  }

    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1}  px={10} pb={16}>
          <Image 
            source={BackgroundImage}
            defaultSource={BackgroundImage}
            alt="Pessoas treinando"
            resizeMode='contain'
            position="absolute"
          />

          <Center my={24}>
            <LogoSvg />

            <Text color="gray.100" fontSize="sm">
                Treine sua mnente e seu corpo
            </Text>
          </Center>
          
          <Center>
            <Heading 
                color="gray.100"
                fontSize="xl"
                  mb={6} 
                fontFamily="heading">
                Acesse sua conta 
            </Heading>

            <Controller 
              control={control}
              name="name"
              render={({ field: { onChange, value }})=> (
                <Input 
                  placeholder='Nome'
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message} 
                
                />
              )}
            />


            <Controller 
              control={control}
              name="email"
              render={({ field: { onChange, value }})=> (
                <Input 
                  placeholder='Email'  
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message} 
                 
              />
              )}
            />

            <Controller 
              control={control}
              name="password"
              render={({ field: { onChange, value }})=> ( 
              <Input 
                  placeholder='Senha'  
                  secureTextEntry 
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message} 
              />
              )}
            />

            <Controller 
              control={control}
              name="confirm_password"
              render={({ field: { onChange, value }})=> ( 
                <Input 
                  placeholder='Confirmar a Senha'  
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.confirm_password?.message} 
              />
              )}
            />




            <Button 
              title='Criar e Acessar'
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            /> 

          </Center>

         
            <Button 
              title='Voltar para o login'
              variant="outline"
              mt={16}
              onPress={handleGoBack}
              /> 
    
        </VStack>
      </ScrollView>
    );
} 