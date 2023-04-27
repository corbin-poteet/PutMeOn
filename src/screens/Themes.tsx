import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const Themes = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Themes',
    });
  }, [navigation]);

  //Theme list. Increment ID to add more.
  const themes = [
    { id: '1', label: 'Default', colors: ['#d9d9d9', '#4a4a4a'] },
    { id: '2', label: 'PMO Blue', colors: ['#abc7f7', '#005eff'] },
    { id: '3', label: 'Carbon', colors: ['#333', '#111'] },
    { id: '4', label: 'Mango', colors: ['#ff8c00', '#4b941b'] },
    { id: '5', label: 'Lemon', colors: ['#f5cc00', '#2f6b2e'] },
    { id: '6', label: 'Sunset', colors: ['#8f34eb', '#eb7434'] },
    { id: '7', label: 'Firestone', colors: ['#a80707', '#210502'] },
    { id: '8', label: 'Volcano', colors: ['#e35e40', '#3d0f04'] },
    { id: '9', label: 'Legacy', colors: ['#696969', '#696969'], labelColor: '#82f252' }


  ];

  //@ts-ignore
  const ThemeButton = ({ theme }) => (
    <TouchableOpacity style={styles.button}>
      <LinearGradient
        colors={theme.colors}
        style={styles.circle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.label, { color: theme.labelColor || '#fff' }]}>{theme.label}</Text>
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
    borderRadius: 10,
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