import React, { useEffect } from 'react';
import {Heading, HStack, Icon, VStack, Text, Image, Box, useToast} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

import  BodySvg         from  '@assets/body.svg';
import  SeriesSvg       from  '@assets/series.svg';
import  RepetitionsSvg  from  '@assets/repetitions.svg';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import { ExerciseDTO } from '@dtos/ExerciseDTO';



type RouteParamsProps = {
    exerciseId: string;
}



export function Exercise(){

    const [exercisePlus, setExercise] = React.useState<ExerciseDTO>({} as ExerciseDTO)

    const route = useRoute();
    const Toast = useToast();

    const { exerciseId } = route.params as RouteParamsProps;
   
    

    const navigation = useNavigation<AppNavigatorRoutesProps>();

   function handleGoBack(){
      navigation.goBack();
   }

   async function fetchExerciseDetails(){
    try {
        const response = await api.get(`/exercises/${exerciseId} `);  
        setExercise(response.data);
        console.log('INFO => ', response.data.demo);
        
    } catch (error) {
        const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel pegar os exercicios !"

            Toast.show({
                title,
                placement: "top",
                bgColor: 'red.500'
            })
    }
   }



   useEffect(()=> {
    fetchExerciseDetails();
   },[exerciseId])



    return (
        <VStack flex={1}>
            <VStack px={8} bg="gray.600" pt={12}>
                <TouchableOpacity onPress={handleGoBack}>
                 <Icon
                    as={Feather}
                    name="arrow-left"
                    color="green.500"
                    size={6}
                 />  
                </TouchableOpacity> 

                <HStack justifyContent="space-between" mt={4} mb={8}
                alignItems="center">
            
                    <Heading color="white" fontSize="lg" flexShrink={1}>{exercisePlus.name}</Heading>
                    <HStack alignItems="center">
                        <BodySvg />
                        <Text color="gray.200" ml={1} textTransform="capitalize">
                            {exercisePlus.group}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            <VStack p={8}>
                <Image 
                  w="full" 
                  h={80}
                  source={{uri:`${api.defaults.baseURL}/exercise/demo/${exercisePlus?.demo}`}}
                  alt="Nome do Exercicio"
                  mb={3}
                  resizeMode="cover"
                  rounded="lg"
                 />

                 <Box bg="gray.600" rounded="md" pb={4} px={4}>
                    <HStack 
                        alignItems="center"
                        justifyContent="space-around"
                        mb={6}
                        mt={5}
                        >
                        <HStack>
                            <SeriesSvg />
                            <Text color="gray.200" ml={2}>
                            {exercisePlus.series} séries
                            </Text>
                        </HStack>

                        <HStack>
                            <RepetitionsSvg />
                            <Text color="gray.200" ml={2}>
                                {exercisePlus.repetitions} Repetições
                            </Text>
                        </HStack>
                    </HStack>
                   
                   <Button title='Marcar como realizado'/>

                 </Box>
            </VStack>
        </VStack>
    )
}