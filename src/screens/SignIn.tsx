import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import BackgroundImage from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

import { AuthNativeRoutesProps } from '@routes/auth.routes';


export function SignIn(){

    const navigation = useNavigation<AuthNativeRoutesProps>();

    function handleNewAccount(){
      navigation.navigate('signUp');
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

            <Input 
              placeholder='Email'  
              keyboardType='email-address'
              autoCapitalize='none'
              />
              
            
            
            <Input 
              placeholder='Senha'  
              secureTextEntry
              />

             <Button 
              title='Acessar'

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