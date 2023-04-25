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
  public async initializeDeck(seed_tracks: string[], seed_genres: string[], seed_artists: string[], finalSize: number = 20, responseSize: number = 50) {
    await this.spotify.getRecommendations({
      seed_tracks: seed_tracks,
      seed_genres: seed_genres,
      seed_artists: seed_artists,
      limit: responseSize,
    }).then((response) => {
      var tracks = response.tracks as SpotifyApi.TrackObjectFull[];
      tracks = tracks.filter((track) => track.preview_url != null);
      tracks = tracks.slice(0, finalSize);
      this.tracks = tracks;
      return tracks;
    });
  }

  public setTracks(tracks: SpotifyApi.TrackObjectFull[]) {
    this.tracks = tracks;
  }

  public getTracks() {
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