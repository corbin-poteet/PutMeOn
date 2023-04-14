import { TextInput, View, Text } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Switch } from 'react-native-paper';
import SettingsSwitch from '@/common/components/SettingsSwitch';

const SearchScreen = () => {

    const navigation = useNavigation();
    const [toggle, setToggle] = useState(false); //false for genre search, true for artist search
    const [search, setSearch] = useState(''); //keeps track of what is entered in search bar dynamically

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [navigation])

    useEffect(() => { //useEffect for toggler
        if (toggle === true) {
            //code for displaying artists
        } else if (toggle === false) {
            //code for displaying genres
        }
    }, [toggle]);

    return (
        <View className='flex-1 justify-center'>
            <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
                <View className='flex-row absolute top-11 right-5'>
                    <Text className='text-white'>Artist</Text>
                    <Switch value={toggle} onValueChange={setToggle} className='mx-2'></Switch>
                    <Text className='text-white'>Genre</Text>
                </View>
                <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">This is the search screen. It looks like shit right now but it will allow you to search for 5 seed artists/genres for making a new deck</Text>
                <TextInput placeholderTextColor={"#0B0B45"} placeholder='Seach' onChangeText={setSearch} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl top-5 px-8 py-3'></TextInput>
            </LinearGradient>
        </View>
    )
}

export default SearchScreen