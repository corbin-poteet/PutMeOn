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
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('@assets/PMO_MU_Logo.png')} style={{
                        width: 320,
                        height: 120,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
             <View style={{ paddingTop: 40 }}>
                  <Text style={{ fontWeight: 'bold' }} className='text-white text-2xl text-center px-1 my-1'>
                    Put Me On Match-Up makes music discovery fun! 
                   </Text>
                  <Text style={{ fontWeight: 'bold' }} className='text-white text-2xl text-center px-1 my-10'>
                      The faster you guess each song, the more points you'll earn!
                 </Text>
             </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity className="absolute bottom-10 flex-row items-center justify-center bg-green-500 px-5 rounded-3xl"
                    onPress={() => { navigation.navigate('Game') }}>
                    <Text className="text-white text-xl px-8 py-2 text-1 font-bold">Match-Up!</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
    


}


export default StartScreen