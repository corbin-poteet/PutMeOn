import React, { useContext } from 'react';
import gameContext from '@/common/hooks/gameContext';
import useAuth from '../hooks/useAuth';
import database from "../../../firebaseConfig.tsx";
import { push, ref, set, child, get, getDatabase, onValue } from "firebase/database";

const { spotify, user } = useAuth(); // Used exclusively for playlist addition, this is temporary until we
                                       // find a new way to save liked songs
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
  static contextType = gameContext
  //selectedDeck = "";

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

  //public setSelectedDeck(playlist: string) { //Set selected deck by string
  //  this.selectedDeck = playlist;
  //}

  //public getSelectedDeck() {
  //  return this.selectedDeck;
  //}

  public handleLike(index: number) {
    set(
      ref(database, "Decks/" + user?.id + "/" + selectedPlaylist + "/likedTracks/" + this.tracks[index].id),
      {
        trackID: this.tracks[index].id,
        trackName: this.tracks[index].name,
        liked: true,
      }
    );
    
    const likedTrack: string[] = [];
    likedTrack.push(this.tracks[index].uri);
    this.addToPlaylist(likedTrack); //Needs an array of tracks to add to playlist, so pass it one track in a new array
  }

  public handleDislike(index: number) {
    set(
      ref(database, "Decks/" + user?.id + "/" + selectedPlaylist + "/dislikedTracks/" + this.tracks[index].id),
      {
        trackID: this.tracks[index].id,
        trackName: this.tracks[index].name,
        liked: true,
      }
    );
  }

  public addToPlaylist(trackURIs: string[]) { // TEMPORARY until we think of another way to save songs
    spotify.addTracksToPlaylist( //Add trackURIs array to selected playlist
      this.selectedPlaylist,
      trackURIs
    );
  }

}

export default DeckManager;