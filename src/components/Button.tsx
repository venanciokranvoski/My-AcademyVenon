import {Button as ButtonNativeBase, IIconButtonProps, Text} from 'native-base'

type Props = IIconButtonProps & {
   title: string;
   variant ?: 'solid' | 'outline';
   isLoading?: boolean;

}


export function Button({title, variant = 'solid', isLoading, ...rest}: Props){
    return (
     <ButtonNativeBase 
        isLoading={isLoading}
        w="full"
        h={14}
        bg={variant === "outline" ? "transparent" : "green.700"}
        borderWidth={variant === "outline" ? 1 : 0}
        borderColor="green.500"
        rounded="sm"
        _pressed={{
            bg: variant === "outline" ?  "gray.500" : "green.500" 
        }}
      
        {...rest}
        >
        <Text color={variant === "outline" ? "green.500" : "white"} fontFamily="heading" fontSize="sm">
          {title}  
        </Text>  
     </ButtonNativeBase>
    )
}