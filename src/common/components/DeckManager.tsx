import React from 'react';
import useAuth from '../hooks/useAuth';

//const { spotify } = useAuth();

// db reference
// const deck = {
//   id: "",
//   name: "",
//   likedTrackIDs: [] as string[],
//   dislikedTrackIDs: [] as string[],
// }

//var spotify = useAuth().spotify;

class DeckManager {
  spotify = useAuth().spotify;
  tracks: SpotifyApi.TrackObjectFull[] = [];

  constructor(props: any) {

  }

  /**
   * Initializes the deck with a given size
   * @param finalSize the size of the deck after filtering
   * @param responseSize the size of the response from the spotify api
   */
  public async initializeDeck(seed_tracks: string[], seed_genres: string[], seed_artists: string[], finalSize: number = 20, responseSize: number = 50): Promise<SpotifyApi.TrackObjectFull[]> {
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

  /**
   * Adds new tracks to the deck from the spotify api
   * Passes track ids as seed tracks
   * @param finalSize 
   * @param responseSize 
   */
  public async addNewTracksFromSpotify(finalSize: number = 1, responseSize: number = 50) {
    await this.getTrackRecommendationsFromSpotify(this.getTrackIds(), [], [], finalSize, responseSize).then((tracks) => {
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
        return tracks;
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
    this.tracks.concat(tracks);
  }

  public setTracks(tracks: SpotifyApi.TrackObjectFull[]) {
    this.tracks = tracks;
  }

  public getTracks(): SpotifyApi.TrackObjectFull[] {
    return this.tracks;
  }

  public handleLike(index: number) {
    const track = this.tracks[index];
    console.log("liked " + track.name);
  }

  public handleDislike(index: number) {
    const track = this.tracks[index];
    console.log("disliked " + track.name);
  }
}

export default DeckManager;