import React from 'react';
import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { Heading, VStack, SectionList, Text} from 'native-base';


export function History(){
    const [groupExercises, setGroupExercises] = React.useState([{
        title : '27.08.2023',
        data  : ["Triceps", "Biceps", "Esteira"]
    },
    {
        title : '22.07.2021',
        data  : ["Puxada Frontal"]
    }
   ]);
    return (
        <VStack flex={1}>
            <ScreenHeader title='Histórico de Exercicios' />

            <SectionList 
              sections={groupExercises}
              keyExtractor={item => item}
              renderItem={({ item })=> (
                <HistoryCard  />
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