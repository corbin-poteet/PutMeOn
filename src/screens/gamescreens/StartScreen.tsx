import { View, Text, Button, TouchableOpacity, Image, ScrollView, Alert, Animated } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fromJSON } from 'postcss';

const StartScreen = () => { //Game Welcome Screen

    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const [fadeAnimOne] = React.useState(new Animated.Value(0))

    React.useEffect(() => {
        Animated.timing(fadeAnimOne, { //Establish Animation
            toValue: 1,
            duration: 750,
            delay: 1000,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <View className='flex-1 justify-top'>
                <View>
                    <Text className='text-white text-4xl text-center px-1 my-24 font-bold'>Track Trivia</Text>
                    <Text className='text-white text-2xl text-center px-1 my-1'>
                    Put Me On Track Trivia gameifies music discovery! </Text>
                    <Text className='text-white text-2xl text-center px-1 my-1'>
                    The faster the guess each song, the more points you earn!</Text>
                </View>
            </View>
            <View className='flex-1 justify-center'>
                <View>
                    <Image source={require('@assets/Logo_512_White.png')} style={{
                        width: 256,
                        height: 256,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
                </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity className="absolute bottom-10 flex-row items-center justify-center bg-green-500 px-5 rounded-3xl"
                    onPress={() => { navigation.navigate('Round') }}>
                    <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Play Track Trivia</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}


export default StartScreen