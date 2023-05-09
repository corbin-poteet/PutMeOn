import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';


const AppInfo = () => { //Display App information

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Put Me On Information',
    });
  }, [navigation]);

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, color: 'white' }}>Contact PMO support at: support@putmeon.com</Text>
        <Text style={{ fontSize: 20, color: 'white' }}>Put Me On v1.0 (The Put It Together update)</Text>
      </View>
    </LinearGradient>
  );
}


export default AppInfo
