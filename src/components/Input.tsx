import { Input as NativeBaseImput, IInputProps, FormControl} from 'native-base';


type Props = IInputProps & {
    errorMessage? : string | null;
}

export function Input({errorMessage, isInvalid, ...rest}: Props){
    const invalid = !!errorMessage || isInvalid;
    return (
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseImput
                bg="gray.700"
                h={14}
                px={4}
                borderWidth={0}
                color="white"
                fontFamily="body"
                isInvalid={invalid}
                _invalid={{
                    borderWidth: 1,
                    borderColor: "red.500"
                }}
                placeholderTextColor="gray.300"
                _focus={{
                    bg: "gray.700",
                    borderWidth: 1,
                    borderColor: "green.500"
                }}
                {...rest}
        />

        <FormControl.ErrorMessage _text={{ color: 'red.500'}}>
            {errorMessage}
        </FormControl.ErrorMessage>
        </FormControl>
       
    )
}