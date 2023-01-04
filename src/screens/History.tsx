import React, { useCallback } from 'react';
import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { Heading, VStack, SectionList, Text, Toast} from 'native-base';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';


export function History(){
    const [groupExercises, setGroupExercises] = React.useState<HistoryByDayDTO[]>([]);

   const [isLoading, setIsLoading] = React.useState<boolean>(false); 

    async function fetchHystory(){
      try {
        setIsLoading(true);
        const response = await api.get('/history');
        setGroupExercises(response.data);
      } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : "Não foi possível registrar exercício. !"

        Toast.show({
            title,
            placement: "top",
            bgColor: 'red.500'
        })
      }finally{
        setIsLoading(false)
      }
    }

    useFocusEffect(useCallback(()=> {
       fetchHystory();
    },[]));


    return (
        <VStack flex={1}>
            <ScreenHeader title='Histórico de Exercicios' />

            <SectionList 
              sections={groupExercises}
              keyExtractor={item => item.id}
              renderItem={({ item })=> (
                <HistoryCard data={item}  />
              )}
              renderSectionHeader={({ section })=> (
                <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
                    {section.title}
                </Heading>
              )}
              px={8}
              contentContainerStyle={groupExercises.length === 0 && { flex: 1, justifyContent: "center"}}
              ListEmptyComponent={()=> (
                <Text color="gray.100" textAlign="center">
                    Não há exercicios registrados ainda.
                    Vamos Malhar Hoje? 
                </Text>
              )}
            />

        </VStack>
    )
}