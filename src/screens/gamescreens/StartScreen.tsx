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
            headerShown: true,
            headerTitle: 'App Information',
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
                    <Text className='text-white text-4xl text-left px-1 my-16 font-bold'>Discover new music with Put Me On</Text>
                    <Text className='text-white text-2xl text-left px-1 my-2'>Swipe right on a song to like it!</Text>
                    <Text className='text-white text-2xl text-left px-1 my-2'>Swipe left on a song to dislike it!</Text>
                </View>
            </View>
            <View className='flex-1 justify-center'>
                <View>
                    <Image source={require('@assets/swipe_logo.png')} style={{
                        width: 256,
                        height: 256,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
                </View>
            </View>
            <View style={{ alignItems: 'right' }}>
                <TouchableOpacity style={{ backgroundColor: '#014871', width: '60%', height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 50 }}
                    onPress={() => { navigation.navigate('Finish') }}>
                    <AntDesign style={{ marginRight: 12, marginLeft: 12 }} name="arrowright" size={35} color="white" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}


export default StartScreen