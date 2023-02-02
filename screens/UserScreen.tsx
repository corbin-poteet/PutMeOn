import { View, Text } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth';

const UserScreen = () => {
    const { logout, spotify, user } = useAuth();


    return (
        <View>
        <Text>{user}</Text>
        </View>
    )
}

export default UserScreen

