import { View, Text, Platform } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '@/common/hooks/useAuth';
import { ScrollView } from 'react-native-gesture-handler';
import useDeckManager, { Seed, SeedType } from '@/common/hooks/useDeckManager';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Dialog, Divider, Input, SearchBar, TabView } from '@rneui/themed';
import TrackSearchResult from '@/common/components/TrackSearchResult';
import SelectedSeed from '@/common/components/SelectedSeed';
import { Tab } from '@rneui/themed';
import ArtistSearchResult from '@/common/components/ArtistSearchResult';
import SelectedArtistSeed from '@/common/components/SelectedArtistSeed';
import useTheme from '@/common/hooks/useThemes';

//👌😂👌 🔥 🔥 🔥

var output: any[] = [];

//Search bar screen for selecting seeds

const SearchScreen = () => {

  const { spotify } = useAuth();
  const { deckManager } = useDeckManager();
  const navigation = useNavigation();

  const [searchResultObject, setSearchResultObject] = useState<SpotifyApi.SearchResponse>(); //holds search results in getSearchResults function
  const [selectedTracks] = useState<SpotifyApi.TrackObjectFull[]>([]); //holds selected tracks
  const [selectedArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]); //holds selected tracks
  const [dialogVisible, setDialogVisible] = useState<boolean>(false); //keeps track of whether or not to show the dialog box
  const [search, setSearch] = useState("");
  const [deckName, setDeckName] = useState<string>(''); //keeps track of deck name
  const [trackSearchResultComponents, setTrackSearchResultComponents] = useState<any>([]); //component handler for showing search results
  const [artistSearchResultComponents, setArtistSearchResultComponents] = useState<any>([]); //component handler for showing search results
  const [selectedSeedComponents, setSelectedSeedComponents] = useState<any>([]); //component handler for showing/removing seeds (lmao component handler 2)
  const [searching, setSearching] = useState<boolean>(false); //keeps track of whether or not the user is actively searching
  const [index, setIndex] = React.useState(0);
  const { themes, selectedTheme } = useTheme(); //Allows dynamic theme color changing


  useLayoutEffect(() => { //hide header
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: true, //will be set to false later (you can't back out of this screen)
      gestureDirection: 'horizontal'
    })
  }, [navigation])

  async function updateSearch(search: string) {
    setSearch(search);
  };

  React.useEffect(() => {
    if (search == '') {
      return;
    }

    const response = spotify.search(search, ['track', 'artist'], { limit: 20 }).then(
      function (data) {
        setSearchResultObject(data);
      }
    ).catch(
      function (error) {
        console.log(error);
      }
    )
  }, [search]);


  function updateSelectedList() {
    const selectedTrackComponents = selectedTracks.map(
      (track) => {
        return (
          <SelectedSeed key={track.id} track={track} remove={removeSelectedTrack} />
        )
      }
    );

    const selectedArtistComponents = selectedArtists.map(
      (artist) => {
        return (
          <SelectedArtistSeed key={artist.id} artist={artist} remove={removeSelectedArtist} />
        )
      }
    );

    const selectedComponents = selectedTrackComponents.concat(selectedArtistComponents);
    setSelectedSeedComponents(selectedComponents);
  }

  function removeSelectedTrack(track: SpotifyApi.TrackObjectFull) {
    for (var i = 0; i < selectedTracks.length; i++) {
      if (selectedTracks[i].id == track.id) {
        selectedTracks.splice(i, 1);
        updateSelectedList();
        break;
      }
    }
  }

  function onSelectTrack(track: SpotifyApi.TrackObjectFull) {
    selectedTracks.push(track);
    updateSelectedList();
  }

  function removeSelectedArtist(artist: SpotifyApi.ArtistObjectFull) {
    for (var i = 0; i < selectedArtists.length; i++) {
      if (selectedArtists[i].id == artist.id) {
        selectedArtists.splice(i, 1);
        updateSelectedList();
        break;
      }
    }
  }

  function onSelectArtist(artist: SpotifyApi.ArtistObjectFull) {
    selectedArtists.push(artist);
    updateSelectedList();
  }

  React.useEffect(() => {
    if (searchResultObject == undefined) {
      return;
    }

    if (searchResultObject.tracks != undefined) {
      const trackSearchResults = searchResultObject.tracks.items.map(
        (track) => {
          var isSelected = false;
          for (var i = 0; i < selectedTracks.length; i++) {
            if (selectedTracks[i].id == track.id) {
              isSelected = true;
              break;
            }
          }
          return (
            <TrackSearchResult key={track.id} track={track} onPress={onSelectTrack} onDeselect={removeSelectedTrack} isChecked={isSelected} />
          )
        }
      );
      setTrackSearchResultComponents(trackSearchResults);
    }

    if (searchResultObject.artists != undefined) {

      const artistSearchResults = searchResultObject.artists.items.map(
        (artist) => {

          var isSelected = false;
          for (var i = 0; i < selectedArtists.length; i++) {
            if (selectedArtists[i].id == artist.id) {
              isSelected = true;
              break;
            }
          }
          return (
            <ArtistSearchResult key={artist.id} artist={artist} onPress={onSelectArtist} onDeselect={removeSelectedArtist} isChecked={isSelected} />
          )
        }
      );
      setArtistSearchResultComponents(artistSearchResults);
    }
  }, [searchResultObject]);



  React.useEffect(() => {
    if (search == '') {
      setSearchResultObject(undefined);
      setArtistSearchResultComponents([]);
      setTrackSearchResultComponents([]);
    }
    console.log("selected tracks: " + selectedTracks.length);
    updateSelectedList();
  }, [searching]);

  React.useEffect(() => {
    if (dialogVisible) {
      setDeckName('');
    }
  }, [dialogVisible]);

  function createNewDeck() {
    const seeds = [] as Seed[];
    for (var i = 0; i < selectedTracks.length; i++) {
      seeds.push({ type: 'track', id: selectedTracks[i].id, name: selectedTracks[i].name, image: selectedTracks[i].album.images[0].url });
    }
    for (var i = 0; i < selectedArtists.length; i++) {
      seeds.push({ type: 'artist', id: selectedArtists[i].id, name: selectedArtists[i].name, image: selectedArtists[i].images[0].url });
    }
    setDialogVisible(false);
    deckManager.createNewDeck(deckName, seeds);

    // @ts-ignore
    navigation.navigate('Home');
  }

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#f0f2f4', '#f0f2f4']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <Dialog isVisible={dialogVisible} onBackdropPress={() => { setDialogVisible(false) }} >
        <Dialog.Title title='Give your deck a name' />
        <Input placeholder='Deck name' onChangeText={text => setDeckName(text)} value={deckName} />
        <Dialog.Actions>
          <Button onPress={createNewDeck} disabled={deckName == ''}>Create</Button>
        </Dialog.Actions>
      </Dialog>
      <SafeAreaView className='flex-1 pt-5 bg-white' >
        <View className='flex-1 bg-white'>
          <View>
            {!searching ?
              <Text className='text-3xl font-bold text-start px-5' style={{ color: '#000000' }}>Search</Text>
              : <></>}
            <SearchBar
              platform={Platform.OS === 'ios' ? 'ios' : 'android'}
              placeholder={index ? "Search for an artist" : "Search for a track"}
              onChangeText={updateSearch}
              value={search}
              containerStyle={{ backgroundColor: 'transparent', marginBottom: 5 }}
              inputContainerStyle={searching ? { backgroundColor: '#EEEEEF', height: 15 } : { backgroundColor: '#EEEEEF' }}
              inputStyle={searching ? { fontSize: 0 } : { fontSize: 20 }}
              onSubmitEditing={() => { }}
              onPressIn={() => { setSearching(true); console.log("searching true") }}
              onKeyboardHide={() => { setSearching(false); console.log("searching false") }}
              onCancel={() => { setSearching(false); console.log("searching false") }}
              showCancel={true}
              cancelButtonTitle="Done"
            />
            {searching ?
              <View>
                <Tab value={index} onChange={(e) => setIndex(e)} indicatorStyle={{ 
                  //ts-ignore
                  backgroundColor: themes[selectedTheme].button, height: 3 }} variant="default">
                  <Tab.Item title="Tracks" titleStyle={{ fontSize: 12, color: 'black' }} icon={{ name: 'music-note-quarter', type: 'material-community', color: 'black' }} />
                  <Tab.Item title="Artists" titleStyle={{ fontSize: 12, color: 'black' }} icon={{ name: 'account-music', type: 'material-community', color: 'black' }} />
                </Tab>
              </View>
              : <></>}
            <Divider />
          </View>
          {searching ?
            <View className='flex-1'>
              {/* @ts-ignore */}
              <TabView value={index} onChange={setIndex} animationType="timing" animationConfig={{ duration: 100 }} >
                <TabView.Item style={{ backgroundColor: '#f0f2f4', width: '100%' }}>
                  <ScrollView>
                    {trackSearchResultComponents}
                  </ScrollView>
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: '#f0f2f4', width: '100%' }}>
                  <ScrollView>
                    {artistSearchResultComponents}
                  </ScrollView>
                </TabView.Item>
              </TabView>
            </View>
            :
            <View className='flex-1'>
              <ScrollView>
                {selectedSeedComponents}
              </ScrollView>
              <Button
                title="Create Deck"
                onPress={() => {
                  setDialogVisible(true);
                }}
                style={{ alignSelf: 'center', width: '50%', marginVertical: 10 }}
                disabled={(selectedTracks.length == 0 && selectedArtists.length == 0) || selectedTracks.length + selectedArtists.length > 5}
                buttonStyle={{ backgroundColor: '#01b1f1', borderRadius: 30 }}
              />
            </View>
          }
        </View>
      </SafeAreaView>
    </LinearGradient >
  )



}




export { output, };
export default SearchScreen;
