import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';

const [componentHandler, setComponentHandler] = React.useState<any>();

const navigation = useNavigation();
const { spotify, user } = useAuth();

React.useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerTitle: "Game Logic"
    });
}, [navigation]);

React.useEffect(() => {
    
}, []);

const questions[] = [];

type Question = {
    image: string;   // spotify track image url
    trackId: string; // spotify track id
    name: string;    // spotify track name
    album: string;   // spotify track album name
    artist: string;  // spotify track artist name
    challengeType: string;   // this string determines which prop is blank that needs to be guessed
}
 
function buildQustions(count: number) { // param count: number of questions to build
    
    for(let i = 0; i < count; i++) {
        let choice = Math.random()*2;
        console.log(choice);
    }
}

function getQuestionList() {

}
  
function getQuestion() {
    
}

const GameLogic = () => {

    return (
        <View className='flex-1 justify-center'>
            <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
                <Text>Game Logic Screen</Text>
            </LinearGradient>
        </View>
    );
};
