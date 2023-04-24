import { createContext } from 'react'
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import React from 'react';

class AudioPlayer {
  sound: Audio.Sound;
  _isPlaying: boolean;
  isBuffering: boolean;
  playbackStatus: any;
  currentTrack: SpotifyApi.TrackObjectFull;
  previousTrack: SpotifyApi.TrackObjectFull;
  playbackPosition: number;
  onPlaybackStatusUpdate: ((status: AVPlaybackStatus) => void) | null = null;

  constructor() {
    this.sound = new Audio.Sound();
    this._isPlaying = false;
    this.isBuffering = false;
    this.playbackStatus = {} as AVPlaybackStatus;
    this.currentTrack = {} as SpotifyApi.TrackObjectFull;
    this.previousTrack = {} as SpotifyApi.TrackObjectFull || null;
    this.playbackPosition = 0;
  }

  async setTrack(track: SpotifyApi.TrackObjectFull) {
    this.previousTrack = this.currentTrack;
    this.currentTrack = track;

    // unload the previous track
    await this.sound.unloadAsync().catch((error) => {
      console.log(error);
    });

    // if the track has a preview
    if (this.hasPreview()) {
      // load the preview
      await this.sound.loadAsync({
        uri: track.preview_url
      }).catch((error) => {
        console.log(error);
      });

      this.sound.setIsLoopingAsync(true);
      this.sound.setProgressUpdateIntervalAsync(1000);

      // play the preview
      this.play();
    }
  }

  async play() {
    await this.sound.playAsync().catch((error) => {
      console.log(error);
    });

    this._isPlaying = true;
  }

  async pause() {
    await this.sound.pauseAsync().catch((error) => {
      console.log(error);
    });

    this._isPlaying = false;
  }

  async stop() {
    await this.sound.stopAsync().catch((error) => {
      console.log(error);
    });

    this._isPlaying = false;

    await this.sound.unloadAsync().catch((error) => {
      console.log(error);
    });
  }

  async playPause() {
    if (this._isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  async seek(position: number) {
    await this.sound.setPositionAsync(position);
  }

  hasPreview(): boolean {
    return this.currentTrack.preview_url != null;
  }

  getPlaybackStatus() {
    return this.playbackStatus;
  }

  isPlaying() {
    return this._isPlaying;
  }
}

const audioPlayerContext = createContext({
  audioPlayer: new AudioPlayer(),
});

export const AudioPlayerProvider = ({ children }) => {

  const [audioPlayer, setAudioPlayer] = React.useState(new AudioPlayer());

  return (
    <audioPlayerContext.Provider
      value={{
        audioPlayer,
      }}
    >
      {children}
    </audioPlayerContext.Provider>
  );
};

export default function useAuth() {
  return React.useContext(audioPlayerContext);
}