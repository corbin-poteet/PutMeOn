import { View, Text, Button, TouchableOpacity, Image, ScrollView} from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

const PlaylistScreen = () => {

  const navigation = useNavigation();

  const [selectedPlaylist, setSelectedPlaylist] = React.useState<any>();
  const [playlists, setPlaylists] = React.useState<any[]>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [componentHandler, setComponentHandler] = React.useState<any>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Playlists"
    });
  }, [navigation]);

  const { spotify, user } = useAuth();

  const result: any[] = [];

  async function getPlaylists() {
    const response = await spotify.getUserPlaylists(user?.id
      ).then(
      function (data) {
        const playlists = data.items;
        // playlists.forEach(element => { 
        //   console.log(element.name); //Testing log for debugging
        // });
        setPlaylists(playlists);
    
        for(var i = 0; i < playlists.length; i++) {
          result.push(
            {
              "name": playlists[i].name,
              "image": playlists[i].images[0] 
            }
          );
      }
      const listItems = result.map(
        (element) => {
          return (
            <View>  
              <TouchableOpacity onPress = { 
                () => {
                  setSelectedPlaylist(element)
                  console.log("SELECTED: "+element.name)
                }
              }>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                  <Image source={ {uri: element.image.url}} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }}/>
                  <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white'}}> {element.name} </Text>
                </View>
              </TouchableOpacity>
            </View>
            )
          }
        )
      setComponentHandler(listItems);
      setLoaded(true)
      //https://www.geeksforgeeks.org/how-to-render-an-array-of-objects-in-reactjs/
    });
  }

  React.useEffect(() => {
    getPlaylists();
  }, []);
  
  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <View className='absolute top-1'>
          <Text className='text-white text-2xl px-3'>Songs that you like in Put Me On will be added to a Playlist of your choice: </Text>
        </View>
        <View style={{padding: 10, flex: 1}}>
          <ScrollView style={{flex: 1, marginTop: 100}}>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            
            { componentHandler }
 
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  )
}

export default PlaylistScreen