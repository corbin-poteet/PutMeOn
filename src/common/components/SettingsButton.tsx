import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React from 'react'


type SettingsButtonProps = {
  text: string,
  navigateString: string;
}

const defaultProps = { // navigation.navigate
  value: false,
  onValueChange: () => { }
};

const SettingsButton = (propsIn: SettingsButtonProps) => {
  const props = { ...defaultProps, ...propsIn }
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity className='flex-row w-full items-center py-3 bg-white px-5 mb-0.5'onPress={
      () => {
        // @ts-ignore
        navigation.navigate(props.navigateString) //Navigates to set page in props
      }}>
      <Text className='text-base'>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default SettingsButton