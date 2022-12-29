import React from 'react';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import { TouchableOpacity, Alert } from 'react-native';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const PHOTO_SIZE = 32;

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = React.useState(false);
    const [photo, setPhoto] = React.useState('https://avatars.githubusercontent.com/u/41402809?v=4');

    const ToastShow = useToast();

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

                    <Input
                        placeholder='Nome'
                        bg="gray.600"
                    />

                    <Input
                        placeholder='Email'
                        bg="gray.600"
                        isDisabled
                    />
                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color="gray.200" fontSize="md" mb={2}>
                        Alterar a Senha
                    </Heading>

                    <Input
                        bg="gray.600"
                        placeholder='Senha Antiga'
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder='Nova Senha'
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder='Confirme a Nova senha '
                        secureTextEntry
                    />

                    <Button title='Atualizar' mt={4} />

                </VStack>

            </ScrollView>
        </VStack>
    )
}