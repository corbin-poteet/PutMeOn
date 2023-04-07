import { View, Text, Button, TouchableOpacity, Image, ScrollView, Alert, Animated, StyleSheet } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fromJSON } from 'postcss';
import { FontAwesome5 } from '@expo/vector-icons';

const GameScreen = () => {
  
  const navigation = useNavigation();

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View className='flex-1 items-center justify-center'>
        <Text></Text>
      </View>
    </LinearGradient>
  );
};

export default GameScreen;