import { View, Text, Switch } from 'react-native'
import React from 'react'

type SettingsSwitchProps = {
  text: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const defaultProps = {
  value: false,
  onValueChange: () => { }
};

const SettingsSwitch = (propsIn: SettingsSwitchProps) => {
  const props = { ...defaultProps, ...propsIn }

  const [switchValue, setSwitchValue] = React.useState<boolean>(props.value)

  return (
    <View className='flex-row w-full items-center py-3 bg-white px-5 mb-0.5'>
      <Text className='text-base'>{props.text}</Text>
      <Switch
        onValueChange={props.onValueChange}
        value={switchValue}
        className='ml-auto'
      />
    </View>
  )
}

export default SettingsSwitch