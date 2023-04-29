import { View, Text, TouchableOpacity, Image, Animated } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import useTheme from '@/common/hooks/useThemes';

const StartScreen = () => { //Game Welcome Screen

    const { themes, selectedTheme } = useTheme(); //Allows dynamic theme color changing
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
        // @ts-ignore
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={[themes[selectedTheme].topGradient, themes[selectedTheme].bottomGradient]} style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('@assets/PMO_MU_Logo.png')} style={{
                        width: 320,
                        height: 120,
                        transform: [{ translateX: -6 }],
                        resizeMode: 'contain',
                    }}
                        className="mb-20" />
             <View style={{ paddingTop: 40 }}>
                {/*@ts-ignore*/}
                  <Text style={{ color: themes[selectedTheme].text, fontWeight: 'bold' }} className='text-2xl text-center px-1 my-1'>
                    Put Me On Match-Up makes music discovery fun! 
                   </Text>
                {/*@ts-ignore*/}
                  <Text style={{ color: themes[selectedTheme].text, fontWeight: 'bold' }} className='text-2xl text-center px-1 my-10'>
                      The faster you guess each song, the more points you'll earn!
                 </Text>
             </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                {/*@ts-ignore*/}
                <TouchableOpacity className="absolute bottom-10 flex-row items-center justify-center px-5 rounded-3xl" style={{ backgroundColor: themes[selectedTheme].button }}
                    // @ts-ignore
                    onPress={() => { navigation.navigate('Game') }}>
                    <Text className="text-white text-xl px-8 py-2 font-bold">Match-Up!</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
    


}


export default StartScreen