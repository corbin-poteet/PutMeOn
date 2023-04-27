import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const Themes = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Themes',
    });
  }, [navigation]);

  const themes = [
    { id: '1', label: 'Default', colors: ['#abc7f7', '#005eff'] },
    { id: '2', label: 'Dark', colors: ['#333', '#111'] },
    { id: '3', label: 'Mango', colors: ['#ff8c00', '#4b941b'] },
    { id: '4', label: 'Lemon', colors: ['#f5cc00', '#2f6b2e'] },
    { id: '5', label: 'Firestone', colors: ['#a80707', '#210502'] },
    { id: '6', label: 'Sunset', colors: ['#8f34eb', '#eb7434'] },
    { id: '7', label: 'Volcano', colors: ['#e35e40', '3d0f04'] },
    { id: '8', label: 'Legacy', colors: ['#69696', '#696969'] }
  ];

  const ThemeButton = ({ theme }) => (
    <TouchableOpacity style={styles.button}>
      <LinearGradient
        colors={theme.colors}
        style={styles.circle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.label}>{theme.label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={themes}
        renderItem={({ item }) => <ThemeButton theme={item} />}
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    margin: 10,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Themes;