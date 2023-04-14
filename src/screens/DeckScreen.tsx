import { View, Text, Button, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Animated } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { fromJSON } from 'postcss';
import { push, ref, set, child, get } from 'firebase/database';
import database from "../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine

let selectedPlaylist: string;
let playlists: any[];

//let loaded: boolean = false;
//Maybe add these values as props?
const DeckScreen = () => {

  const navigation = useNavigation();
  const dbRef = ref(database);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  //const [selectedPlaylist, setSelectedPlaylist] = React.useState<any>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [componentHandler, setComponentHandler] = React.useState<any>();
  const [fadeAnim] = React.useState(new Animated.Value(0))
  const [decks, setDecks] = React.useState<string []>();

  React.useLayoutEffect(() => {
    if (selectedPlaylist == null) {
      navigation.setOptions({
        //gestureEnabled: false // RE- ENABLE THIS LATER
      });
    }
  }, [navigation]);

  const { spotify, user } = useAuth();

  const result: any[] = [];

  function getDecks() {
    get(child(dbRef, "Decks/" + user?.id)).then((snapshot) => { //When User is obtained, establish database array
      
      let temp:string[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((element: any) => {
          var value = element.val();
          temp.push(value?.playlistId); //change to ID
          setDecks(temp); //Push database spotify playlist ids item to decks array (string)
        }); 
      } else {
        console.log("Failed to retrieve data from database")
      }
      
    });
  }

  async function getPlaylists() {
    
    const response = await spotify.getUserPlaylists(user?.id, { limit: 50 }
    ).then(
      function (data) {
        playlists = data.items;

        for (var i = 0; i < playlists.length; i++) {
          if (playlists[i].owner.id === user?.id) //Remove Playlists not created by user
          {
            decks?.forEach((item) => {
              //console.log(item?.playlistId + " === " + playlists[i]?.id)
              if(playlists[i]?.id == item) {
                result.push({
                  "name": playlists[i].name,
                  "image": playlists[i].images[0],
                  "index": i
                });
              }
            }) 
          }
          //console.log("Playlists Names: " + playlists[i].name)
        }
        const listItems = result.map(
          (element) => {
            return (
              <View>
                <TouchableOpacity onPress={
                  () => {
                    createAlert(element)
                    //selectedPlaylist = playlists[element.index].id;
                    //console.log("SELECTED: "+selectedPlaylist)
                    //navigation.navigate('Home')
                  }
                }>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                    <Image source={element.image != undefined ? { uri: element.image.url } : require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}> {element.name} </Text>
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

  function createAlert(playlist: any) { //Confirm playlist selection alert
    Alert.alert('Confirm Deck', 'Select ' + playlist.name + ' as your Put Me On Deck?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes', onPress:
          () => {
            selectedPlaylist = playlists[playlist.index].id;
            navigation.navigate('Home')
            // Alert.alert('Welcome to Put Me On!', 'Swipe right to add a song you like to a playlist, swipe left to dislike it', [
            // {
            //   text: 'Okay',
            //   style: 'cancel',
            // }]);
          }
      }
    ]);
  }

  React.useEffect(() => {
    if (user != undefined && user.id != undefined) { //Load Playlists only after user credentials are retrieved
      getDecks();
      Animated.timing(fadeAnim, { //Establish Animation
        toValue: 1,
        duration: 750,
        delay: 1000,
        useNativeDriver: true
      }).start();
    }
  }, [user]);

  React.useEffect(() => {
    //console.log("DECKS CHANGED: "+decks);
    if(decks && decks.length > 0 && user) { //This loads twice. No time to fix it. Whatever...
      getPlaylists();
    }
  }, [decks]);

  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <View className='absolute top-1' style={{ marginTop: 50, flex: 1 }}>
          <Text className='text-white text-2xl px-3'>Songs that you like in Put Me On will be added to a Spotify playlist of your choice: </Text>
        </View>
        <View style={{ padding: 10, flex: 1 }}>
          {!loaded //Render Loading Effect, come back to center perfectly later. DOESN'T WORK PROPERLY YET...
            ?
            <View style={{ flex: 1, marginTop: 300 }}>
              <ActivityIndicator size="large" color="#014871" />
            </View>
            :
            <Animated.View style={{ opacity: fadeAnim }}>
              <ScrollView style={{ flex: 1, marginTop: 150 }}>
                <TouchableOpacity onPress={() => {
                  navigation.navigate("CreatePlaylist");
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                    <Image source={require('@assets/add_playlist.png')} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}>New Playlist</Text>
                  </View>
                </TouchableOpacity>

                {componentHandler}

              </ScrollView>
            </Animated.View>
          }
        </View>
      </LinearGradient>
    </View>
  )
}

export default DeckScreen;
export { selectedPlaylist };
