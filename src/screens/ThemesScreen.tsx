import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const themeData = [
  {
    id: '1',
    name: 'Default',
    gradientColors: ['#abc7f7', '#005eff'],
    textColor: 'white',
  },
  {
    id: '2',
    name: 'Dark',
    gradientColors: ['#333', '#111'],
    textColor: '#f0f0f0',
  },
  {
    id: '3',
    name: 'Mango',
    gradientColors: ['#ff8c00', '#4b941b'],
    textColor: '#fff',
  },
  {
    id: '4',
    name: 'Lemon',
    gradientColors: ['#f5cc00', '#2f6b2e'],
    textColor: '#fff',
  },
  {
    id: '5',
    name: 'Firestone',
    gradientColors: ['#a80707', '#210502'],
    textColor: '#fff',
  },
  {
    id: '6',
    name: 'Sunset',
    gradientColors: ['#8f34eb', '#eb7434'],
    textColor: '#fff',
  },
  {
    id: '7',
    name: 'Volcano',
    gradientColors: ['#e35e40', '#3d0f04'],
    textColor: '#fff',
  },
  {
    id: '8',
    name: 'Legacy',
    gradientColors: ['#696969', '#696969'],
    textColor: '#0dff00',
  },
];

const ThemesScreen = () => {
    const [selectedTheme, setSelectedTheme] = useState(themeData[0].id);
  
    const handleThemeSelection = (themeId) => {
      if (themeId !== selectedTheme) {
        setSelectedTheme(themeId);
      }
    };
    const currentTheme = themeData.find((theme) => theme.id === selectedTheme);

    const renderItem = ({ item }) => {
      const isSelected = item.id === selectedTheme;
  
      return (
        <TouchableOpacity
          style={[styles.themeOption, isSelected && styles.selectedTheme]}
          onPress={() => handleThemeSelection(item.id)}
        >
          <LinearGradient
            colors={item.gradientColors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.themeText, { color: item.textColor }]}>{item.name}</Text>
            {isSelected && (
              <View style={styles.checkMark}>
                <Ionicons name="checkmark" size={24} color={item.textColor} />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    };
  
    return (
      <LinearGradient
        colors={currentTheme.gradientColors}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.textColor }]}>Themes</Text>
        </View>
        <FlatList
          data={themeData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.themeRow}
          contentContainerStyle={styles.themeList}
        />
      </LinearGradient>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      width: '100%',
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#92ddf0',
    },
    title: {
      fontSize: 30,
      color: 'black',
      fontWeight: 'bold',
      marginBottom: 0,
      marginTop: 30, 
    },
    themeList: {
      paddingHorizontal: 10,
      marginTop: 50
    },
    themeRow: {
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    themeOption: {
      width: '48%',
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginTop: 5,
    },
    selectedTheme: {
      borderWidth: 2,
      borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    gradient: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
  export default ThemesScreen;
  