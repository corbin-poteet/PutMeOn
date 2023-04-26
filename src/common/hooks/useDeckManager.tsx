import { createContext } from 'react'
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import React from 'react';
// @ts-ignore
import database from "../../../firebaseConfig.tsx";
import { push, ref, set, child, get, getDatabase, onValue } from "firebase/database";
import useAuth from './useAuth';


class DeckManager {

  spotify = useAuth().spotify;
  user = useAuth().user;
  tracks: SpotifyApi.TrackObjectFull[] = [];
  likedTracks: SpotifyApi.TrackObjectFull[] = [];
  dislikedTracks: SpotifyApi.TrackObjectFull[] = [];

  constructor() {

  }

  /**
   * Initializes the deck with a given size
   * @param finalSize the size of the deck after filtering
   * @param responseSize the size of the response from the spotify api
   */
  public async initializeDeck(seed_tracks: string[], seed_genres: string[], seed_artists: string[], finalSize: number = 5, responseSize: number = 50): Promise<SpotifyApi.TrackObjectFull[]> {
    await this.getTrackRecommendationsFromSpotify(seed_tracks, seed_genres, seed_artists, finalSize, responseSize).then((tracks) => {
      this.tracks = tracks as SpotifyApi.TrackObjectFull[];
      return this.tracks;
    });
    return this.tracks;
  }

  /**
   * Initializes tracks from the given track id array
   * @param trackIds the array of track ids
   */
  public async initializeDeckFromTrackIds(trackIds: string[]) {
    await this.spotify.getTracks(trackIds).then((response) => {
      var tracks = response.tracks as SpotifyApi.TrackObjectFull[];
      this.tracks = tracks;
      return tracks;
    });
  }

  private selectSeedTracks(): string[] {
    // if there are no liked tracks, use the last 5 tracks in the deck
    if (this.likedTracks.length == 0) {
      return this.getTrackIds().slice(Math.max(this.tracks.length - 5, 0), this.tracks.length);
    }

    const likedTrackIds = this.likedTracks.map((track) => track.id);
    const lastLikedTrackIds = likedTrackIds.slice(Math.max(this.likedTracks.length - 5, 0), this.likedTracks.length);
    return lastLikedTrackIds;
  }

  private selectSeedArtists(): string[] {
    return [];
  }

  /**
   * Adds new tracks to the deck from the spotify api
   * Passes track ids as seed tracks
   * @param finalSize 
   * @param responseSize 
   */
  public async addNewTracksFromSpotify(finalSize: number = 1, responseSize: number = 50) {

    var seed_tracks = this.selectSeedTracks();
    var seed_artists = this.selectSeedArtists();

    await this.getTrackRecommendationsFromSpotify(seed_tracks, [], seed_artists, finalSize, responseSize).then((tracks) => {
      this.addTracks(tracks as SpotifyApi.TrackObjectFull[]);
      return tracks;
    });
  }

  /**
   * Calls the spotify api to get track recommendations then filters them
   * @param seed_tracks the seed tracks
   * @param seed_genres the seed genres
   * @param seed_artists the seed artists
   * @param finalSize the size of the final array
   * @param responseSize the size of the response from the spotify api
   * @returns the array of filtered tracks
   */
  private async getTrackRecommendationsFromSpotify(seed_tracks: string[], seed_genres: string[], seed_artists: string[], finalSize: number = 1, responseSize: number = 50) {
    const tracks = await
      this.spotify.getRecommendations({
        seed_tracks: seed_tracks,
        seed_genres: seed_genres,
        seed_artists: seed_artists,
        limit: responseSize,
      }).then((response) => {
        const trackResponse = response as SpotifyApi.RecommendationsFromSeedsResponse;
        var tracks = response.tracks as SpotifyApi.TrackObjectFull[];
        tracks = this.filterTracks(tracks);
        tracks = tracks.slice(0, finalSize);
        if (tracks.length < finalSize) {
          console.log("Not enough tracks found");
          // DUETO: should probably make this recursive to ensure we get finalSize number of tracks
          // but like
        }
        return tracks as SpotifyApi.TrackObjectFull[];
      }).catch((error) => {
        console.log(error);
      });
    return tracks;
  }

  /**
   * Filters the given array of tracks
   * @param tracks input array of unfiltered tracks
   * @returns array of filtered tracks
   */
  public filterTracks(tracks: SpotifyApi.TrackObjectFull[]): SpotifyApi.TrackObjectFull[] {
    return tracks.filter((track) => track.preview_url != null);
  }

  /***
   * Returns an array of track ids from the tracks in the deck
   */
  public getTrackIds(): string[] {
    return this.tracks.map((track) => track.id);
  }

  public addTrack(track: SpotifyApi.TrackObjectFull) {
    this.tracks.push(track);
  }

  public removeTrack(index: number) {
    this.tracks.splice(index, 1);
  }

  public addTracks(tracks: SpotifyApi.TrackObjectFull[]) {
    if (tracks == null) return;

    console.log("adding tracks: " + tracks.map((track) => track.name));
    this.tracks = this.tracks.concat(tracks);
  }

  public setTracks(tracks: SpotifyApi.TrackObjectFull[]) {
    this.tracks = tracks;
  }

  public getTracks(): SpotifyApi.TrackObjectFull[] {
    return this.tracks;
  }

  public async handleSwipe(index: number, liked: boolean) {
    if (liked) {
      this.handleLike(index);
    } else {
      this.handleDislike(index);
    }
    await this.addNewTracksFromSpotify(1, 15);
  }

  private handleLike(index: number) {
    const track = this.tracks[index];
    set(
      ref(database, "SwipedTracks/" + this.user?.id + "/" + track.id),
      {
        trackID: track.id,
        liked: true,
      }
    );

    this.likedTracks.push(track);
  }

  private handleDislike(index: number) {
    const track = this.tracks[index];
    set(
      ref(database, "SwipedTracks/" + this.user?.id + "/" + track.id),
      {
        trackID: track.id,
        liked: false,
      }
    );

    this.dislikedTracks.push(track);
  }




}



const deckContext = createContext({
  deckManager: new DeckManager(),
});

export const DeckManagerProvider = ({ children }) => {

  const [deckManager] = React.useState(new DeckManager());

  return (
    <deckContext.Provider
      value={{
        deckManager,
      }}
    >
      {children}
    </deckContext.Provider>
  );
};

export default function useDeckManager() {
  return React.useContext(deckContext);
}