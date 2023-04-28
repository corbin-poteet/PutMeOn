import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import useTheme from '@/common/hooks/useThemes';

const Themes = () => {
  const navigation = useNavigation();
  const { setSelectedTheme, selectedTheme, themes } = useTheme(); //Allows dynamic theme color changing

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Themes',
    });
  }, [navigation]);

  //Theme list. Increment ID to add more.
  const themeList = [
    { id: '1', label: 'Default', colors: ['#d9d9d9', '#4a4a4a'] },
    { id: '2', label: 'Classic', colors: ['#014871', '#A0EBCF']},
    { id: '3', label: 'PMOBlue', colors: ['#abc7f7', '#005eff'] },
    { id: '4', label: 'Carbon', colors: ['#333', '#111'] },
    { id: '5', label: 'Mango', colors: ['#ff8c00', '#4b941b'] },
    { id: '6', label: 'Lemon', colors: ['#f5cc00', '#2f6b2e'] },
    { id: '7', label: 'Sunset', colors: ['#8f34eb', '#eb7434'] },
    { id: '8', label: 'Firestone', colors: ['#a80707', '#210502'] },
    { id: '9', label: 'Volcano', colors: ['#e35e40', '#3d0f04'] },
    { id: '10', label: 'Legacy', colors: ['#696969', '#696969'], labelColor: '#82f252' },
    { id: '11', label: 'Highcon', colors: ['#000000', '#000000'] },
    { id: '12', label: 'Midnight', colors: ['#000000', '#000032'] },
    { id: '13', label: 'Spectre', colors: ['#000000', '#0000'] },
    { id: '14', label: 'Desktop', colors: ['#8dbcf4', '#6e9123'] },
    { id: '15', label: 'Kokomo', colors: ['#7f2118', '#ab7d4a'] },
    { id: '16', label: 'Retro', colors: ['#0f011a', '#1e146e'] },
    { id: '17', label: 'Gilded', colors: ['#ffb302', '#7a5e39'] },
    { id: '18', label: 'Ink', colors: ['#000000', '#000000'] },
    { id: '19', label: 'Null', colors: ['#0000', '#0000'] },
  ];

  //@ts-ignore
  const ThemeButton = ({ theme }) => (
    <TouchableOpacity style={styles.button} onPress={() => {
      //@ts-ignore
      setSelectedTheme(theme.label);
    }}> 
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
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={[themes[selectedTheme].topGradient, themes[selectedTheme].bottomGradient]} style={{ flex: 1, justifyContent: 'flex-start' }}>  
      <View style={styles.container}>
        <FlatList
          data={themeList}
          renderItem={({ item }) => <ThemeButton theme={item} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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