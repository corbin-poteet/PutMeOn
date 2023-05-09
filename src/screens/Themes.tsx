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
    { id: '3', label: 'Carbon', colors: ['#333', '#111'] },
    { id: '4', label: 'Mango', colors: ['#ff8c00', '#4b941b'] },
    { id: '5', label: 'Lemon', colors: ['#f5cc00', '#2f6b2e'] },
    { id: '6', label: 'Sunset', colors: ['#8f34eb', '#eb7434'] },
    { id: '7', label: 'Firestone', colors: ['#a80707', '#210502'] },
    { id: '8', label: 'Volcano', colors: ['#222', '#761616'] },
    { id: '9', label: 'Channel', colors: ['#ff7303', '#482000']},
    { id: '10', label: 'Kokomo', colors: ['#ab7d4a', '#64155b'] },
    { id: '11', label: 'Retro', colors: ['#0f011a', '#1e146e'], labelColor: '#03e7fb' },
    { id: '12', label: 'Midnight', colors: ['#000000', '#1541d8'] },
    { id: '13', label: 'RAM', colors: ['#808080', '#b89900'] },
    { id: '14', label: 'ZABA', colors: ['#245c5d', '#432b48'] },
    { id: '15', label: 'Desktop', colors: ['#8dbcf4', '#6e9123'] },
    { id: '16', label: 'Spectre', colors: ['#5b9a48', '#0000'] },
    { id: '17', label: 'Contrast', colors: ['#000000', '#000000'], labelColor: '#0000ff' },
    { id: '18', label: 'Ink', colors: ['#000000', '#000000'] },
    { id: '19', label: 'Atlantic', colors: ['#29527b', '#050c1c'] },
    { id: '20', label: 'Mint', colors: ['#008080', '#111'] },
    { id: '21', label: 'F1', colors: ['#a80707', '#2f6b2e'] },
    { id: '22', label: 'Brick', colors: ['#a80707', '#a80707'] },
    { id: '23', label: 'Aqua', colors: ['#29527b', '#29527b'] },
    { id: '24', label: 'Pine', colors: ['#2f6b2e', '#2f6b2e'] },
    { id: '25', label: 'Royalty', colors: ['#64155b', '#64155b'] },
    { id: '26', label: 'Cocoa', colors: ['#512b18', '#512b18'] },
    { id: '27', label: 'Tangerine', colors: ['#ff7303', '#ff7303'] },
    { id: '28', label: 'Null', colors: ['#0000', '#0000'] },
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
    //@ts-ignore
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