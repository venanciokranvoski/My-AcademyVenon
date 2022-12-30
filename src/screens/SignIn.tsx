import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import BackgroundImage from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

import { AuthNativeRoutesProps } from '@routes/auth.routes';

import * as yup from 'yup';
import { useForm, Controller} from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';


type FormLoginAcess = {
  email : string;
  password: string;
}


const signInSchema = yup.object({
  email: yup.string().required('Informe o email !').email('Email inválido !'),
  password: yup.string().required('Informe a senha !').min(6, 'A senha deve ter pelo menos 6 digitos !'),
})


export function SignIn(){

  const  {control, handleSubmit, formState : { errors } } = useForm<FormLoginAcess>({
     resolver : yupResolver(signInSchema)
  })

    const navigation = useNavigation<AuthNativeRoutesProps>();

    function handleNewAccount(){
      navigation.navigate('signUp');
    }

    function handleSignIn(data: FormLoginAcess){
      console.log(data);
      
    }

    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1} px={10} pb={16}>
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
              name="email"
              render={({ field: { onChange, value}})=> (
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
              name="email"
              render={({ field: { onChange, value}})=> (
                <Input 
                  placeholder='Senha'  
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

             <Button 
              title='Acessar'
              onPress={handleSubmit(handleSignIn)} 
             /> 

          </Center>

          <Center mt={24}>
            <Text 
              color="gray.100"
              fontSize="sm" 
              mb={3}
              fontFamily="body">
              Ainda não tem Acesso?
            </Text>


            <Button 
              title='Criar conta'
              variant="outline"
              onPress={handleNewAccount}
              /> 
          </Center>
         


        </VStack>
      </ScrollView>
    );
} 