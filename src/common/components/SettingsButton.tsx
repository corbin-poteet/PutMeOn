import { View, Text, Switch, TouchableOpacity } from 'react-native'
import React from 'react'

type SettingsButtonProps = {
  text: string;
}

const defaultProps = { // navigation.navigate
  value: false,
  onValueChange: () => { }
};

const SettingsButton = (propsIn: SettingsButtonProps) => {
  const props = { ...defaultProps, ...propsIn }

  return (
    <TouchableOpacity className='flex-row w-full items-center py-3 bg-white px-5 mb-0.5'>
      <Text className='text-base'>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default SettingsButton