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
 
    const [exercise, setExercise] = React.useState<ExerciseDTO>({} as ExerciseDTO)
    const [sendingRegister, setSendingRegister] = React.useState(false);

    const route = useRoute();
    const Toast = useToast();

    const { exerciseId } = route.params as RouteParamsProps;

    console.log(exerciseId);
    

    const navigation = useNavigation<AppNavigatorRoutesProps>();

   function handleGoBack(){
      navigation.goBack();
   }

   async function fetchExerciseDetails(){
    try {
        const response = await api.get(`/exercises/${exerciseId} `);  
        setExercise(response.data);  
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

   async function handleExercisehistoryRegister(){
     try {
        setSendingRegister(true);
        
        
        await api.post('/history', { exercise_id: exerciseId });


        Toast.show({
            title: 'Parabéns! Exercicio Concluido e Registrado no seu Historico!',
            placement: "top",
            bgColor: 'green.700'
        })

        navigation.navigate('history');

     } catch (error) {
        console.log('dadada => ',error);
        
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : "Não foi possível carregar o historico !"

        Toast.show({
            title,
            placement: "top",
            bgColor: 'red.500'
        })
     }finally{
        setSendingRegister(false)
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
            
                    <Heading color="white" fontSize="lg" flexShrink={1}>{exercise.name}</Heading>
                    <HStack alignItems="center">
                        <BodySvg />
                        <Text color="gray.200" ml={1} textTransform="capitalize">
                            {exercise.group}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            <VStack p={8}>
              { exercise.demo && (
                    <Image 
                    w="full" 
                    h={80}
                    source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                    alt="Nome do Exercicio"
                    mb={3}
                    resizeMode="cover"
                    rounded="lg"
                    />
            )}  
               

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
                            {exercise.series} séries
                            </Text>
                        </HStack>

                        <HStack>
                            <RepetitionsSvg />
                            <Text color="gray.200" ml={2}>
                                {exercise.repetitions} Repetições
                            </Text>
                        </HStack>
                    </HStack>
                   
                   <Button 
                    title='Marcar como realizado'
                    isLoading={sendingRegister}
                    onPress={handleExercisehistoryRegister}
                    />

                 </Box>
            </VStack>
        </VStack>
    )
}