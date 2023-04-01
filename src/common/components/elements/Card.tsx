import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import Scrubber from 'react-native-scrubber';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export type Props = {
    track: SpotifyApi.TrackObjectFull;
}

const Card: React.ForwardRefRenderFunction<any, Props> = (props, ref) => {

    React.useImperativeHandle(ref, () => ({
        onCardSwiped
    }));

    const { track } = props;

    

    const [sound, setSound] = React.useState<Audio.Sound>();
    const [hasPreview, setHasPreview] = React.useState<boolean>(track.preview_url != null);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const [playbackPosition, setPlaybackPosition] = React.useState<number>(0);
    const [playbackDuration, setPlaybackDuration] = React.useState<number>(0);






    React.useEffect(() => {

        console.log('Card useEffect');

        if (hasPreview) {
            loadAudio(track, true);
        }
        

    }, []);


    function onCardSwiped() {
        console.log(track.name + ' swiped');
        if (sound != null) {
            stopAudio();
        }

        setSound(undefined);
    }
    

    async function loadAudio(track: SpotifyApi.TrackObjectFull, shouldPlay: boolean = true) {
        if (track.preview_url == null) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(
            { uri: track.preview_url },
            { shouldPlay: shouldPlay }
        );

        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
        sound.setProgressUpdateIntervalAsync(25);
        setSound(sound);

        await sound.playAsync();
        setIsPlaying(true);
    }

    function onPlaybackStatusUpdate(playbackStatus: any) {

        setPlaybackPosition(playbackStatus.positionMillis);
    }

    async function playAudio() {
        if (sound != null) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    }

    async function pauseAudio() {
        if (sound != null) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    }

    async function stopAudio() {
        if (sound != null) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    }

    async function seekAudio(position: number) {
        if (sound != null) {
            await sound.setPositionAsync(position);
        }
    }

    async function togglePlayAudio() {
        console.log('togglePlayAudio');
        if (sound != null) {
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        }
    }    

    return (
        <LinearGradient start={{ x: 0, y: 0 }} locations={[0.67, 1]} colors={['#3F3F3F', 'rgba(1,1,1,1)']} className="relative w-full h-full rounded-2xl"  >
            <View className='absolute left-4 right-4 top-8 bottom-0 opacity-100 z-0'>
                <View className='flex-1 justify-start items-start'>
                    <View className='relative justify-center items-center w-full aspect-square justify-start'>
                        <Image source={{ uri: track.album.images[0].url }} className='absolute w-full h-full' />
                    </View>
                    <View className='pt-2 px-0 w-full justify-start items-start pt-4'>
                        {/* Track Name */}
                        <View className='flex-row items-end'>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                scrollEnabled={false}
                            >
                                <Text className='text-white text-5xl font-bold'>{track.name}</Text>
                            </ScrollView>
                        </View>
                        {/* Artist Name */}
                        <View className='flex-row items-center opacity-80'>
                            <FontAwesome5 name="user-alt" size={16} color="white" />
                            <Animated.ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <Text className='px-2 text-white text-xl'>{
                                    track.artists.map((artist: any) => artist.name).join(', ')
                                }</Text>
                            </Animated.ScrollView>
                        </View>
                        {/* Album Name */}
                        <View className='flex-row items-center opacity-80'>
                            <FontAwesome5 name="compact-disc" size={16} color="white" />
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <Text className='px-2 text-white text-xl'>{track.album.name}</Text>
                            </ScrollView>
                        </View>
                        {hasPreview ?
                            <View>
                                <View className='flex-row'>
                                    <Scrubber
                                        value={playbackPosition / 1000}
                                        onSlidingComplete={(value: number) => {
                                            seekAudio(value * 1000);
                                        }}
                                        totalDuration={Math.ceil(playbackDuration / 1000)}
                                        trackColor='#29A3DA'
                                        scrubbedColor='#29A3DA'
                                    />
                                </View>
                                <View className='flex-row justify-center items-center w-full'>
                                    <View className='flex-row justify-center items-center align-center'>
                                        <TouchableOpacity className='rounded-full py-0' onPress={() => { togglePlayAudio() }}>
                                            <Ionicons name={isPlaying ? "pause-circle-sharp" : "play-circle-sharp"} size={84} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            : null}
                    </View>
                </View>
            </View>
        </LinearGradient >
    )
}

const CardRef = React.forwardRef(Card);

export default CardRef;