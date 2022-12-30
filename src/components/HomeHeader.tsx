import { TouchableOpacity } from 'react-native';
import { Heading, HStack, Text, VStack, Icon} from 'native-base';
import  { MaterialIcons } from '@expo/vector-icons';
import { UserPhoto } from './UserPhoto';


export function HomeHeader(){
    return (
        <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
            <UserPhoto 
                size={16}
                source={{uri: 'https://avatars.githubusercontent.com/u/41402809?v=4'}}
                alt="Imagem do Usuario"
                mr={4}
            />
            <VStack flex={1}>
                <Text color="gray.100" fontSize="md">
                    Olá,
                </Text>
                
                <Heading color="gray.100" fontSize="md" fontFamily="heading">
                    Venancio 
                </Heading>
            </VStack>
            <TouchableOpacity>
                <Icon 
                    as={MaterialIcons}
                    name="logout"
                    color="gray.200"
                    size={7}
                />  
            </TouchableOpacity>
          

        </HStack>
    )
}