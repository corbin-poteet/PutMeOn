import { View, Text, Button, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator} from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { fromJSON } from 'postcss';

let selectedPlaylist: string;
let playlists: any[];
//let loaded: boolean = false;

const PlaylistScreen = () => {

  const navigation = useNavigation();

  //const [selectedPlaylist, setSelectedPlaylist] = React.useState<any>();
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
    console.log("Setting Loaded to: "+loaded)
    const response = await spotify.getUserPlaylists(user?.id
      ).then(
      function (data) {
        playlists = data.items;

        for(var i = 0; i < playlists.length; i++) {
          if(playlists[i].owner.id === user?.id) //Remove Playlists not created by user
          {
            result.push(
              {
                "name": playlists[i].name,
                "image": playlists[i].images[0], 
                "index": i
              }
            );
          }
      }
      const listItems = result.map(
        (element) => {
          return (
            <View>  
              <TouchableOpacity onPress = { 
                () => {
                  createAlert(element)
                  //selectedPlaylist = playlists[element.index].id;
                  //console.log("SELECTED: "+selectedPlaylist)
                  //navigation.navigate('Home')
                }
              }>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                  <Image source={element.image != undefined ? {uri: element.image.url} : require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }}/>
                  <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white'}}> {element.name} </Text>
                </View>
              </TouchableOpacity>
            </View>
            )
          }
        )
      setComponentHandler(listItems);
      //loaded = true;
      setLoaded(true)
      console.log("Finished Loaded to: "+loaded)
     
      //https://www.geeksforgeeks.org/how-to-render-an-array-of-objects-in-reactjs/
    });
  }
  
  function createAlert(playlist: any) { //Confirm playlist selection alert
    Alert.alert('Confirm Playlist', 'Select '+playlist.name+' as your Put Me On playlist?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Yes', onPress: 
        () => {
          console.log('YES Pressed')
          selectedPlaylist = playlists[playlist.index].id;
          navigation.navigate('Home')
        }
      }  
    ]);
  }

  React.useEffect(() => {
    getPlaylists();
  }, []);
  
  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <View className='absolute top-1'>
          <Text className='text-white text-2xl px-3'>Songs you like in Put Me On will be added to a Playlist that you have created in Spotify: </Text>
        </View>
        <View style={{padding: 10, flex: 1}}>
          { !loaded //Render Loading Effect, come back to center perfectly later. DOESN'T WORK PROPERLY YET...
            ? 
              <View style={{flex: 1, marginTop: 300}}> 
                <ActivityIndicator size="large" color="#014871"/> 
              </View>
            :
              <ScrollView style={{flex: 1, marginTop: 100}}>
                <TouchableOpacity onPress = {
                  async () => {
                    const response = await spotify.createPlaylist(user?.id)
                    console.log('Created Playlist userId: '+user?.id)
                  }
                }>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                    <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }}/>
                    <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white'}}>New Playlist</Text>
                  </View>
                </TouchableOpacity>
                
                { componentHandler }
              </ScrollView>
          }
        </View>
      </LinearGradient>
    </View>
  )
}

export default PlaylistScreen
export {selectedPlaylist};
