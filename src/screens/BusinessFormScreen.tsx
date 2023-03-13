import { View, Text, TouchableOpacity, Alert, Image} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';

const BusinessFormScreen = () => {
  
  const [businessName, setBusinessName] = useState('');
  const [advertName, setAdvertName] = useState('');
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  return (
    <View className='flex-1 justify-center'>
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">Welcome to the business portal! Enter your advertisement details and submit a payment to promote your product.</Text>
            <TextInput placeholder='Business Name' onChangeText={setBusinessName} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl top-5 px-8 py-2'></TextInput>
            <TextInput placeholder='Advertisement Name' onChangeText={setAdvertName} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl top-10 px-2 py-2'></TextInput>
            <TouchableOpacity onPress={ () => Alert.alert('You have successfully submitted a dummy payment')}>
            <Image source={require('@assets/dummybutton.png')} style={{
                width: 200,
                height: 200,
                resizeMode: 'contain',
                }}
                className="mb-12"
            />
            </TouchableOpacity>
            <TouchableOpacity className='flex-row items-center justify-center bg-green-500 rounded-3xl bottom-12 px-8 py-3' onPress={ () => Alert.alert('Business Name: ' + businessName + ', Advertisement Name: ' + advertName)}><Text className='font-semibold text-1 text-white text-xl'>Submit</Text></TouchableOpacity>
        </LinearGradient>
    </View>
  )
}

export default BusinessFormScreen