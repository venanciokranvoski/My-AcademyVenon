import React from 'react';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast, Toast } from 'native-base';
import { TouchableOpacity, Alert } from 'react-native';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import {Controller, useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; 
import * as Yup from 'yup';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';


const PHOTO_SIZE = 32;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileShema = Yup.object({
    name : Yup.string().required('Informe o nome !'),
    password: Yup.string().min(6, 'A senha deve ter pelo menos 6 digitos !').nullable().transform((value) => !!value ?  value : null),
    confirm_password: Yup.string().oneOf([Yup.ref('password'), null], 'A confirmação de senha não corresponde !').nullable().transform((value) => !!value ?  value : null)
    .when('password', {
        is: (Field: any) => Field,
        then: Yup.string()
        .nullable()
        .required('Informe a confirmação da senha')
        .transform((value) => !!value ?  value : null)
    })
})

export function Profile() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [photoIsLoading, setPhotoIsLoading] = React.useState(false);
    const [photo, setPhoto] = React.useState('https://avatars.githubusercontent.com/u/41402809?v=4');

    const ToastShow = useToast();
    const {user, updateUserProfile} = useAuth();

    const {control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
           name: user.name,
           email: user.email 
        },
        resolver: yupResolver(profileShema)
    });



    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true)
        try {
            const PhotoUser = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (PhotoUser.canceled) {
             return
            }

            if(PhotoUser.assets[0].uri){
                 
                const photoInfo = await FileSystem.getInfoAsync(PhotoUser.assets[0].uri);

                console.log(photoInfo);
                

                if(photoInfo.size && (photoInfo.size / 1024 / 1024 ) > 3 ){
                    return  ToastShow.show({
                        title:'Essa imagem é muito grande. Escolha uma de ate 3MB',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                    
                    //Alert.alert("Essa imagem é muito grande. Escolha uma de ate 5MB");
                }

                setPhoto(PhotoUser.assets[0].uri);
            }    

        } catch (error) {
            console.log(error);

        } finally {
            setPhotoIsLoading(false)
        }
    }

    async function handleProfileUpdate(data: FormDataProps){
       try {
            setIsLoading(true);

            const userUpdate = user;
            userUpdate.name = data.name;
            await api.put('/users', data)

            await updateUserProfile(userUpdate);

            ToastShow.show({
            title: 'Perfil atualizado com sucesso!',
            placement: 'top',
            bgColor: 'green.500'
            });

       } catch (error) {
          const isAppError = error instanceof AppError;
          const title = isAppError ? error.message : 'Não foi possivel catualizar dados, tente novamente mais tarde!';

          ToastShow.show({
            title: title,
            placement: 'top',
            bgColor: 'red.500'
         });

       }finally{
        setIsLoading(false);
       }
        
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil' />

            <ScrollView>
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ?
                            <Skeleton
                                w={PHOTO_SIZE}
                                h={PHOTO_SIZE}
                                rounded="full"
                                startColor="green.500"
                                endColor="gray.400"
                            />
                            :
                            <UserPhoto
                                source={{ uri: photo }}
                                alt="Foto do Usuario"
                                size={PHOTO_SIZE}
                            />
                    }
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text
                            color="green.500"
                            fontWeight="bold"
                            fontSize="md"
                            mt={2}
                            mb={8}
                        >Alterar foto</Text>
                    </TouchableOpacity>

                    <Controller 
                       control={control}
                       name="name"
                       render={({ field: { value, onChange}})=> (
                            <Input
                                placeholder='Nome'
                                bg="gray.600"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                       )}
                    />


                    <Controller 
                       control={control}
                       name="email"
                       render={({ field: { value, onChange}})=> (
                            <Input
                                placeholder='Email'
                                isDisabled
                                bg="gray.600"
                                onChangeText={onChange}
                                value={value}
                            />
                       )}
                    />

                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color="gray.200" fontSize="md" mb={2}>
                        Alterar a Senha
                    </Heading>


                    <Controller 
                       control={control}
                       name="old_password"
                       render={({ field: { onChange}})=> (
                            <Input
                                placeholder='Senha Antiga'
                                bg="gray.600"
                                onChangeText={onChange}
                                secureTextEntry
                            />
                       )}
                    />

                    <Controller 
                       control={control}
                       name="password"
                       render={({ field: { onChange}})=> (
                            <Input
                                placeholder='Nova Senha'
                                bg="gray.600"
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                                secureTextEntry
                            />
                       )}
                    />

                    <Controller 
                       control={control}
                       name="confirm_password"
                       render={({ field: { onChange}})=> (
                            <Input
                                bg="gray.600"
                                placeholder='Confirme a Nova senha '
                                secureTextEntry
                                errorMessage={errors.confirm_password?.message}
                                onChangeText={onChange}
                            />
                       )}
                    />

                    <Button 
                        title='Atualizar'
                        mt={4} 
                        onPress={handleSubmit(handleProfileUpdate)} 
                        isLoading={isLoading}
                        />

                </VStack>

            </ScrollView>
        </VStack>
    )
}