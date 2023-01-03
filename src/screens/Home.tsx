import React, { useCallback, useEffect } from 'react';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { HStack, VStack, FlatList, Heading, Text, Toast} from 'native-base';
import { ExerciseCard } from '@components/ExerciseCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Loading } from '@components/Loading';

export function Home(){
    const [groups, setGroups] = React.useState<string[]>([]);
    const [exercise, setExercise] = React.useState<ExerciseDTO[]>([]);
    const [groupSelected, setGroupSelected] = React.useState('costa');
    const [isLoading, setisLoading] = React.useState(true);
      
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOptionsExercisesDetails(exerciseId: string){
       navigation.navigate('exercise', {exerciseId})
    }

    async function fetchGroups(){
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel carregar os grupos musculares !"

            Toast.show({
                title,
                placement: "top",
                bgColor: 'red.500'
            })
        }
    }

    async function fetchExercisesByGroup(){
        try {
           setisLoading(true)
           const response = await api.get(`/exercises/bygroup/${groupSelected}`);
           setExercise(response.data);
            
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel pegar os exercicios !"

            Toast.show({
                title,
                placement: "top",
                bgColor: 'red.500'
            })
        }finally{
            setisLoading(false);
        }
    }


    useEffect(()=> {
        fetchGroups();
    },[]);

    useFocusEffect(useCallback(() => {
       fetchExercisesByGroup(); 
    },[groupSelected]))



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
          
          { 
          isLoading ? <Loading /> :
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
               keyExtractor={item => item.id}
               renderItem={({ item }) => (
                   <ExerciseCard 
                      onPress={()=> handleOptionsExercisesDetails(item.id)}
                      data={item}
                   />
               )}
               showsVerticalScrollIndicator={false}
               _contentContainerStyle={{paddingBottom: 20}}
          />
          
        
      
      
            </VStack>
          }


          
        
        </VStack>
    )
}