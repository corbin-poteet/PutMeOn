import { View, Text, Image, ActivityIndicator, Easing } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import CardsSwipe from "react-native-cards-swipe";
import { FontAwesome5 } from "@expo/vector-icons";
import useAuth from "@/common/hooks/useAuth";
// @ts-ignore
import database from "../../../../firebaseConfig.tsx";
import { push, ref, set, child, get, getDatabase, onValue } from "firebase/database";
import Scrubber from "react-native-scrubber";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import TextTicker from "react-native-text-ticker";
import gameContext from '@/common/hooks/gameContext';
import useAudioPlayer from "@/common/hooks/useAudioPlayer";
import DeckManager from './DeckManager';
import useDeckManager from '@/common/hooks/useDeckManager';
import { useIsFocused } from "@react-navigation/native";
import useTheme from "@/common/hooks/useThemes";

const SwiperComponent = () => {

  //const [deckManager] = React.useState<DeckManager>(new DeckManager({}));
  const { deckManager } = useDeckManager();

  const { themes, selectedTheme } = useTheme(); //Allows dynamic theme color changing

  const isFocused = useIsFocused();

  const [cardIndex, setCardIndex] = React.useState<number>(0);
  const [speed] = React.useState<number>(25);

  const { audioPlayer } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = React.useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = React.useState<number>(0);

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);


  async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // this is hacky as fuck but it works for now to rerender
  React.useEffect(() => {

    //setIsPlaying(!audioPlayer.isPlaying());
    //console.log(!audioPlayer.isPlaying());
    //forceUpdate();

    if (isFocused) {
      setIsPlaying(true);
      forceUpdate();
    }




    delay(1000).then(() => {
      forceUpdate();

      if (isFocused) {
        console.log("UPDATEDINRWONJKRFNJKREFBKREFN")
      }

    });
  }, [isFocused]);

  React.useMemo(async () => {
    if (audioPlayer) {
      audioPlayer.sound.setOnPlaybackStatusUpdate(
        async (playbackStatus: any) => {
          if (playbackStatus.isLoaded) {
            setPlaybackPosition(playbackStatus.positionMillis);
            setPlaybackDuration(playbackStatus.durationMillis);

            //delay(2000).then(() => {    
              if (playbackStatus.isPlaying != isPlaying) {
                setIsPlaying(!playbackStatus.isPlaying);
              }
            //});
          }
        }
      );
    }
  }, [audioPlayer]);

  React.useMemo(async () => {
    console.log("cardIndex: " + cardIndex);
    setPlaybackPosition(0);
    if (cardIndex >= 0 && deckManager.getTracks().length > 0) {
      await audioPlayer.setTrack(deckManager.getTracks()[cardIndex]);
      await audioPlayer.play();
    }
  }, [cardIndex]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {deckManager && deckManager.getTracks().length > 0 ? (
        <CardsSwipe
          cards={deckManager.getTracks()}
          rotationAngle={15}
          cardContainerStyle={{ borderRadius: 20, shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: { width: 0, height: 0 }, shadowColor: '#000000' }}
          onSwiped={async (index: number) => { setCardIndex(cardIndex + 1); }}
          onSwipedLeft={async (index: number) => { deckManager.handleSwipe(index, false); }}
          onSwipedRight={async (index: number) => { deckManager.handleSwipe(index, true); }}
          renderYep={() => renderYep()}
          renderNope={() => renderNope()}
          renderNoMoreCard={() => renderNoMoreCard()}
          renderCard={(track: SpotifyApi.TrackObjectFull) => renderCard(track)}
        />
      ) : (
        //@ts-ignore
        <ActivityIndicator size="large" color={themes[selectedTheme].text} />
      )}
    </View>
  );

  function renderCard(track: SpotifyApi.TrackObjectFull) {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        locations={[0.67, 1]}
        //@ts-ignore
        colors={[themes[selectedTheme].topCard, themes[selectedTheme].bottomCard]}
        className="relative w-full h-full rounded-2xl items-center shadow-lg"
        style={{}}
      >
        {cardIndex % 5 === 0 ?
          <View className="top-3 items-center -mt-1" style={{ backgroundColor: '#7C7C7C', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: { width: 0, height: 0 }, shadowColor: '#000000', borderRadius: 3, width: 70, height: 18, justifyContent: 'center', alignItems: 'center' }}>
            <Text className="text-center font-semibold tracking-tighter" style={{ fontSize: 10, color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 5 }}>Sponsored</Text>
          </View>
          : <></>}
        <View className="absolute left-4 right-4 top-8 bottom-0 opacity-100 z-0">
          <View className="flex-1 justify-start items-start">
            <View className="relative items-center w-full aspect-square justify-start">
              <Image
                source={{ uri: track.album.images[0].url }}
                className="absolute w-full h-full"
                style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
              />
            </View>
            <View className="px-0 w-full justify-start items-start pt-4">

              {/* Track Name */}
              <View className="flex-row items-end">
                <TextTicker
                  scrollSpeed={speed}
                  loop
                  numberOfLines={2}
                  animationType={"scroll"}
                  easing={Easing.linear}
                  repeatSpacer={25}
                  scroll={false}
                  className="text-white text-4xl font-bold"
                  style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
                >
                  {track.name}
                </TextTicker>
              </View>

              {/* Artist Name */}
              <View className="flex-row items-center opacity-80">
                <FontAwesome5 name="user-alt" size={16} color="white" />
                <TextTicker
                  scrollSpeed={speed}
                  loop
                  numberOfLines={1}
                  animationType={"scroll"}
                  easing={Easing.linear}
                  repeatSpacer={25}
                  scroll={false}
                  className="px-2 text-white text-xl"
                  style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
                >
                  {track.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
                </TextTicker>
              </View>

              {/* Album Name */}
              <View className="flex-row items-center opacity-80">
                <FontAwesome5 name="compact-disc" size={16} color="white" />
                <TextTicker
                  scrollSpeed={speed}
                  loop
                  numberOfLines={1}
                  animationType={"scroll"}
                  easing={Easing.linear}
                  repeatSpacer={25}
                  scroll={false}
                  className="px-2 text-white text-xl"
                  style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
                >
                  {track.album.name}
                </TextTicker>
              </View>

              {/* Audio Player */}
              {track?.preview_url && audioPlayer ? (
                <View>
                  <View className="flex-row">
                    <Scrubber
                      value={playbackPosition / 1000}
                      onSlidingComplete={(value: number) => {
                        audioPlayer.seek(value * 1000);
                      }}
                      totalDuration={
                        Math.ceil(playbackDuration / 1000)
                      }
                      //@ts-ignore
                      trackColor={themes[selectedTheme].logo}
                      //@ts-ignore
                      scrubbedColor={themes[selectedTheme].logo}
                    />
                  </View>
                  <View className="flex-row justify-center items-center w-full">
                    <View className="flex-row justify-center items-center align-center">
                      <TouchableOpacity
                        className="rounded-full py-0"
                        onPress={() => {
                          setIsPlaying(!isPlaying);
                          if (!isPlaying) {
                            audioPlayer.pause();
                          } else {
                            audioPlayer.play();
                          }
                        }}
                      >
                        <Ionicons
                          name={
                            !isPlaying
                              ? "pause-circle-sharp"
                              : "play-circle-sharp"
                          }
                          size={84}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null}

            </View>
          </View>
        </View>
      </LinearGradient>
    )
  }

  function renderYep() {
    return (
      <View
        style={{
          borderWidth: 5,
          borderRadius: 6,
          padding: 8,
          marginLeft: 30,
          marginTop: 20,
          borderColor: "lightgreen",
          transform: [{ rotateZ: "-22deg" }],
        }}
      >
        <Text
          style={{
            fontSize: 32,
            color: "lightgreen",
            fontWeight: "bold",
          }}
        >
          YEP
        </Text>
      </View>
    )
  }

  function renderNope() {
    return (
      <View
        style={{
          borderWidth: 5,
          borderRadius: 6,
          padding: 8,
          marginRight: 30,
          marginTop: 25,
          borderColor: "red",
          transform: [{ rotateZ: "22deg" }],
        }}
      >
        <Text
          style={{
            fontSize: 32,
            color: "red",
            fontWeight: "bold",
          }}
        >
          NOPE
        </Text>
      </View>
    )
  }

  function renderNoMoreCard() {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-5xl font-bold">Fuck.</Text>
      </View>
    )
  }

}


export default SwiperComponent