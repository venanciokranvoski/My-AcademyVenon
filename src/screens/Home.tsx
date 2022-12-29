import React from 'react';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { HStack, VStack, FlatList, Heading, Text} from 'native-base';
import { ExerciseCard } from '@components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

export function Home(){
    const [groups, setGroups] = React.useState(['Costas', 'Biceps', 'Triceps', 'Ombro']);
    const [exercise, setExercise] = React.useState(['Trapezio Descendente', 'Puxada frontal', 'Remada unilateral', 'Triceps']);
    const [groupSelected, setGroupSelected] = React.useState('costa')
      
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOptionsExercisesDetails(){
       navigation.navigate('exercise')
    }



    return (
        <VStack flex={1}>
            <HomeHeader />

           <FlatList 
                data={groups}
                keyExtractor={item=> item}
                renderItem={({ item }) => (
                    <Group
                    name={item}
                    isActive={groupSelected.toLocaleUpperCase()  === item.toLocaleUpperCase()}
                    onPress={()=> setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{px: 8}}
                my={10}
                maxH={10}
           />

           <VStack flex={1} px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading color="gray.200" fontSize="md">
                        Exercicios
                    </Heading>

                    <Text color="gray.200" fontSize="sm">
                        {exercise.length}
                    </Text>
                </HStack>


               <FlatList 
                    data={exercise}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <ExerciseCard 
                        onPress={handleOptionsExercisesDetails}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{paddingBottom: 20}}
               />
               
             
           
           
           </VStack>

          
        
        </VStack>
    )
}