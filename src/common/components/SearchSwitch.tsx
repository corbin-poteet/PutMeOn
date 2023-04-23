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

const SearchSwitch = (propsIn: SettingsSwitchProps) => {
  const props = { ...defaultProps, ...propsIn }

  const [switchValue, setSwitchValue] = React.useState<boolean>(props.value)
  const toggleSwitch = () => {
    setSwitchValue(previousState => !previousState);
    props.onValueChange && props.onValueChange(!switchValue);
  }

  return (
    <View className='flex-row items-center py-2 px-5'>
      {
        switchValue ? 
        <Text className='text-white text-3xl font-bold mx-2'>Artists</Text>
        :
        <Text className='text-white text-3xl font-bold mx-2'>Songs</Text>
      }
      
      <Switch style={{backgroundColor: '#FF0000', borderRadius: 17}}
        trackColor={{true: "deepskyblue", false: "skyblue"}}
        onValueChange={toggleSwitch}
        value={switchValue}
        className='ml-auto mx-2'
      />
    </View>
  )
}

export default SearchSwitch