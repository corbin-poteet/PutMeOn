import { View, Text, Button, TouchableOpacity, Image, ScrollView, Alert, Animated } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fromJSON } from 'postcss';
import { MaterialCommunityIcons } from '@expo/vector-icons';

let pageCounter: number = 0;
let temp: string;

//Welcome to Put Me On! This screen is actually 3 screens. Each screen is a part of the PMO demo

const WelcomeScreen = () => {

    const [fadeAnimOne] = React.useState(new Animated.Value(0)) //Each screen has these three animations
    const [fadeAnimTwo] = React.useState(new Animated.Value(0))
    const [fadeAnimThree] = React.useState(new Animated.Value(0))
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            //gestureEnabled: false // RE- ENABLE THIS LATER
        });
    }, [navigation]);

    React.useEffect(() => {
        Animated.timing(fadeAnimOne, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 1000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimTwo, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 2000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimThree, { //Establish Animation
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
                <Animated.View style={{ opacity: fadeAnimOne }}>
                    <Text className='text-white text-4xl text-center px-3'>Welcome to</Text>
                </Animated.View>
                <Animated.View style={{ opacity: fadeAnimTwo }}>
                    <Image source={require('@assets/Logo_512_White.png')} style={{
                        width: 256,
                        height: 256,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
                </Animated.View>
            </View>
            <Animated.View style={{ opacity: fadeAnimThree, alignItems: 'center' }}>
                <TouchableOpacity className='flex-row px-8 py-1 m-2 rounded-3xl absolute bottom-10' style={{ backgroundColor: '#014871' }}
                    // @ts-ignore
                    onPress={() => { navigation.navigate('Tutorial') }}>
                    <AntDesign style={{ marginRight: 12, marginLeft: 12 }} name="arrowright" size={35} color="white" />
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const TutorialScreen = () => {

    const [fadeAnimTwo] = React.useState(new Animated.Value(0))
    const [fadeAnimOne] = React.useState(new Animated.Value(0))
    const [fadeAnimThree] = React.useState(new Animated.Value(0))
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            //gestureEnabled: false // RE- ENABLE THIS LATER
        });
    }, [navigation]);

    React.useEffect(() => {
        Animated.timing(fadeAnimOne, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 1000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimTwo, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 2000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimThree, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 3000,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <View className='flex-1 justify-top'>
                <Animated.View style={{ opacity: fadeAnimOne }}>
                    <Text className='text-white text-4xl text-center px-2 my-16 font-bold'>Discover new music with Put Me On</Text>
                    <Text className='text-white text-4xl text-center px-2 my-2'>Swipe right on a song to like it!</Text>
                    <Text className='text-white text-4xl text-center px-2 my-2'>Swipe left on a song to dislike it!</Text>
                </Animated.View>
            </View>
            <View className='flex-1 justify-center absolute bottom-20'>
                <Animated.View style={{ opacity: fadeAnimTwo }}>
                    <Image source={require('@assets/swipe_logo.png')} style={{
                        width: 256,
                        height: 256,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
                </Animated.View>
            </View>
            <Animated.View style={{ opacity: fadeAnimThree, alignItems: 'center' }}>
                <TouchableOpacity className='flex-row px-8 py-1 m-2 rounded-3xl absolute bottom-10' style={{ backgroundColor: '#014871' }}
                    // @ts-ignore
                    onPress={() => { navigation.navigate('Finish') }}>
                    <AntDesign style={{ marginRight: 12, marginLeft: 12 }} name="arrowright" size={35} color="white" />
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const FinishScreen = () => {

    const [fadeAnimTwo] = React.useState(new Animated.Value(0))
    const [fadeAnimOne] = React.useState(new Animated.Value(0))
    const [fadeAnimThree] = React.useState(new Animated.Value(0))
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            //gestureEnabled: false // RE- ENABLE THIS LATER
        });
    }, [navigation]);

    React.useEffect(() => {
        Animated.timing(fadeAnimOne, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 1000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimTwo, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 2000,
            useNativeDriver: true
        }).start();

        Animated.timing(fadeAnimThree, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 3000,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <View className='flex-1 justify-top items-center'>
                <Animated.View style={{ opacity: fadeAnimOne }} className = 'items-center'>
                    <Text className='text-white text-4xl text-center px-2 my-16 font-bold'>But first we need to create a Put Me On Deck.</Text>
                    <Text className='text-white text-4xl text-center px-2 my-10'>Give your deck 5 seed songs and artists you like!</Text>
                    <MaterialCommunityIcons className='' name="cards-outline" size={120} color = "white" />
                </Animated.View>
            </View>
            <View className='flex-1 justify-center items-center'>
                <Animated.View style={{ opacity: fadeAnimTwo }}>
                    <Text className='text-white text-2xl text-center px-2 my-2' style={{ color: '#FFFFFF' }}>Recommended songs are based off of your Deck's seeds.</Text>
                </Animated.View>
            </View>
            <Animated.View style={{ opacity: fadeAnimThree, alignItems: 'center' }}>
                <TouchableOpacity className='flex-row px-6 py-2 m-2 rounded-3xl absolute bottom-10' style={{ backgroundColor: '#014871' }}
                    // @ts-ignore
                    onPress={() => { navigation.navigate('Decks') }}>
                    <Text className='px-12 text-white text-xl text-center font-bold'>Create Deck</Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

export { WelcomeScreen, TutorialScreen, FinishScreen } //Export each component to other components