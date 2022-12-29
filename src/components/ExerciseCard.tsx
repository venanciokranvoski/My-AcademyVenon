import { Heading, HStack, Image, VStack, Text, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import {Entypo} from '@expo/vector-icons';

type Props = TouchableOpacityProps & {
      
};


export function ExerciseCard({...rest}: Props){
    return (
      <TouchableOpacity {...rest}>
         <HStack bg="gray.500" alignItems="center" p={2} rounded="md" mb={3}>
            <Image
              source={{uri: 'https://marcelogomespersonal.com/wp-content/uploads/2022/01/remada-curvada-com-barra-pegada-pronada-ou-pegada-supinada.jpg'}}
              alt="Imagem do exercicio"
              w={16}
              h={16}
              rounded="md"
              resizeMode="center"
            />

        <VStack flex={1}>
            <Heading fontSize="lg" color="white" ml={3}>
                Remada cavada
            </Heading>
            <Text fontSize="sm" color="gray.200" ml={3}>
               3 séries x 12 repetições
            </Text>
        </VStack>

        <Icon
          as={Entypo}
          name="chevron-thin-right"
          color="gray.300"
        />

        </HStack>

      </TouchableOpacity>
    )
}