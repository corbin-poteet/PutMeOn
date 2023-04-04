import { View, Text, Button, TouchableOpacity, Image, ScrollView, Alert, Animated } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fromJSON } from 'postcss';

let pageCounter: number = 0;
let temp: string;

const WelcomeScreen = () => {

    const [fadeAnimLogo] = React.useState(new Animated.Value(0))
    const [fadeAnimWelcome] = React.useState(new Animated.Value(0))
    const [fadeAnimButton] = React.useState(new Animated.Value(0))
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            //gestureEnabled: false // RE- ENABLE THIS LATER
        });
    }, [navigation]);

    React.useEffect(() => {
        Animated.timing(fadeAnimWelcome, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 1000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimLogo, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 2000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimButton, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 3000,
            useNativeDriver: true
        }).start();
    }, []);

    //const time: ReturnType<typeof setTimeout> = setTimeout(() => '', 1000);

    return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <View className='flex-1 justify-center'>
                <Animated.View style={{ opacity: fadeAnimWelcome }}>
                    <Text className='text-white text-4xl text-center px-3'>Welcome to</Text>
                </Animated.View>
                <Animated.View style={{ opacity: fadeAnimLogo }}>
                    <Image source={require('@assets/Logo_512_White.png')} style={{
                        width: 256,
                        height: 256,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
                </Animated.View>
            </View>
            <Animated.View style={{ opacity: fadeAnimButton, alignItems: 'right' }}>
                <TouchableOpacity style={{ backgroundColor: '#014871', width: '60%', height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 50 }}
                    onPress={() => { navigation.navigate('Tutorial') }}>
                    <AntDesign style={{ marginRight: 12, marginLeft: 12 }} name="arrowright" size={35} color="white" />
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const TutorialScreen = () => {

    const [fadeAnimLogo] = React.useState(new Animated.Value(0))
    const [fadeAnimWelcome] = React.useState(new Animated.Value(0))
    const [fadeAnimButton] = React.useState(new Animated.Value(0))
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            //gestureEnabled: false // RE- ENABLE THIS LATER
        });
    }, [navigation]);

    React.useEffect(() => {
        Animated.timing(fadeAnimWelcome, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 1000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimLogo, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 2000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimButton, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 3000,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <View className='flex-1 justify-top'>
                <Animated.View style={{ opacity: fadeAnimWelcome }}>
                    <Text className='text-white text-4xl text-left px-1 my-16 font-bold'>Discover new music with Put Me On</Text>
                    <Text className='text-white text-2xl text-left px-1 my-2'>Swipe right on a song to like it!</Text>
                    <Text className='text-white text-2xl text-left px-1 my-2'>Swipe left on a song to dislike it!</Text>
                </Animated.View>
            </View>
            <View className='flex-1 justify-center'>
                <Animated.View style={{ opacity: fadeAnimLogo }}>
                    <Image source={require('@assets/swipe_logo.png')} style={{
                        width: 256,
                        height: 256,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
                </Animated.View>
            </View>
            <Animated.View style={{ opacity: fadeAnimButton, alignItems: 'right' }}>
                <TouchableOpacity style={{ backgroundColor: '#014871', width: '60%', height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 50 }}
                    onPress={() => { navigation.navigate('Finish') }}>
                    <AntDesign style={{ marginRight: 12, marginLeft: 12 }} name="arrowright" size={35} color="white" />
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const FinishScreen = () => {

    const [fadeAnimLogo] = React.useState(new Animated.Value(0))
    const [fadeAnimWelcome] = React.useState(new Animated.Value(0))
    const [fadeAnimButton] = React.useState(new Animated.Value(0))
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            //gestureEnabled: false // RE- ENABLE THIS LATER
        });
    }, [navigation]);

    React.useEffect(() => {
        Animated.timing(fadeAnimWelcome, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 1000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimLogo, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 2000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimButton, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 3000,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <View className='flex-1 justify-top'>
                <Animated.View style={{ opacity: fadeAnimWelcome }}>
                    <Text className='text-white text-4xl text-left px-2 my-16 font-bold'>When you like a song it gets added to a playlist in Spotify</Text>
                    <Text className='text-white text-2xl text-left px-2 my-2'>Let's go select a Playlist now!</Text>
                </Animated.View>
            </View>
            <View className='flex-1 justify-center'>
                <Animated.View style={{ opacity: fadeAnimLogo }}>
                    <MaterialIcons style={{ marginRight: 12, marginLeft: 10 }} name="playlist-add" size={200} color="white" />
                </Animated.View>
            </View>
            <Animated.View style={{ opacity: fadeAnimButton, alignItems: 'right' }}>
                <TouchableOpacity style={{ backgroundColor: '#014871', width: '60%', height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 50 }}
                    onPress={() => { navigation.navigate('Playlist') }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>      Select Playlist      </Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

export { WelcomeScreen, TutorialScreen, FinishScreen }