import { createContext } from 'react'
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import React from 'react';
// @ts-ignore
import database from "../../../firebaseConfig.tsx";
import { push, ref, set, child, get, getDatabase, onValue, DatabaseReference } from "firebase/database";
import useAuth from './useAuth';
import SpotifyWebApi from "spotify-web-api-js";

export type SeedType = "track" | "artist" | "genre";

export type Seed = {
  id: string
  name: string,
  type: SeedType,
}

export type Deck = {
  id: string,
  name: string,
  seeds: Seed[],
  likedTracks: string[],
  dislikedTracks: string[],
}

class DeckManager {


  dbRef: DatabaseReference = ref(database);


  _spotify: SpotifyWebApi.SpotifyWebApiJs = new SpotifyWebApi();
  _user: any;

  tracks: SpotifyApi.TrackObjectFull[] = [];

  id: string = "";
  name: string = "";
  seeds: Seed[] = [];
  likedTracks: SpotifyApi.TrackObjectFull[] = [];
  dislikedTracks: SpotifyApi.TrackObjectFull[] = [];

  constructor(public spotify?: SpotifyWebApi.SpotifyWebApiJs, public user?: any) {

    if (!spotify || !user) {
      return;
    }

    console.log("CONSTRUCTING DECK MANAGER");


    this._spotify = spotify;
    this._user = user;

    this.getDecksFromDatabase();


    console.log(user.id);
    const userId = user.id;
    const db = getDatabase();
    const refe = get(child(this.dbRef, `Decks/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Data available");

      } else {
        console.log("No data available");


        // // add user to database
        // set(ref(db, `Decks/${userId}`), {
        //   id: userId,
        // });


      }
    }).catch((error) => {
      console.error(error);
    });






  }


  public async setSelectedDeck(deck: Deck) {

    console.log("Setting selected deck");

    this.id = deck.id;
    this.name = deck.name;
    this.seeds = deck.seeds;
    //this.likedTracks = await this.getTracksFromSpotify(deck.likedTracks);
    //this.dislikedTracks = await this.getTracksFromSpotify(deck.dislikedTracks);

    this.addNewTracksFromSpotify(5);
    
  }

  private getTracksFromSpotify(ids: string[]): Promise<SpotifyApi.TrackObjectFull[]> {
    return this._spotify.getTracks(ids).then((tracks) => {
      return tracks.tracks;
    });
  }



  /**
   * Initializes the deck with a given size
   * @param finalSize the size of the deck after filtering
   * @param responseSize the size of the response from the spotify api
   */
  public async initializeDeck(seeds: Seed[], finalSize: number = 5, responseSize: number = 50) {

    console.log("Initializing deck");
    console.log(this.user.id);

    await this.getTrackRecommendationsFromSpotify(seeds, finalSize, responseSize).then((tracks) => {

      this.tracks = tracks as SpotifyApi.TrackObjectFull[];

      console.log(this.tracks.map((track) => track.name));

      this.seeds = seeds;
      this.likedTracks = [];
      this.dislikedTracks = [];

      const push = this.pushToDatabase();
    }).catch((error) => {
      console.error(error);
    });
  }

  public async getDecksFromDatabase(): Promise<Deck[]> {
    const userId = this.user.id;
    const db = getDatabase();
    const decks = await get(child(this.dbRef, `Decks/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const decks: Deck[] = Object.entries(snapshot.val()).map(([key, value]) => {
          const deck = value as Deck;
          deck.id = key;
          return deck;
        });
        return decks;
      } else {
        console.log("No data available");
        return [] as Deck[];
      }
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      console.log("Finished getting decks from database");
      return [] as Deck[];
    });

    return decks as Deck[];
  }


  private async pushToDatabase() {
    set(ref(database, "Decks/" + this.user.id + "/" + "asdfawef3"), {
      name: "Joe Mama",
      seeds: this.seeds,
      likedTracks: this.likedTracks,
      dislikedTracks: this.dislikedTracks
    }).catch((error) => {
      console.error(error);
    });
  }


  /**
   * Initializes tracks from the given track id array
   * @param trackIds the array of track ids
   */
  public async initializeDeckFromTrackIds(trackIds: string[]) {
    await this._spotify.getTracks(trackIds).then((response) => {
      var tracks = response.tracks as SpotifyApi.TrackObjectFull[];
      this.tracks = tracks;
      return tracks;
    });
  }

  private selectSeeds(): Seed[] {
    // if there are no liked tracks, use the last 5 tracks in the deck
    // if (this.likedTracks.length == 0) {
    //   return this.getTrackSeeds().slice(Math.max(this.tracks.length - 5, 0), this.tracks.length);
    // }

    if (this.likedTracks.length == 0) {
      return this.seeds;
    }

    const likedTrackIds = this.mapTracksToSeeds(this.likedTracks);
    const lastLikedTrackIds = likedTrackIds.slice(Math.max(this.likedTracks.length - 5, 0), this.likedTracks.length);
    return lastLikedTrackIds;
  }

  /**
   * Adds new tracks to the deck from the spotify api
   * Passes track ids as seed tracks
   * @param finalSize 
   * @param responseSize 
   */
  public async addNewTracksFromSpotify(finalSize: number = 1, responseSize: number = 50) {

    //var seed_tracks = this.selectSeedTracks();
    //var seed_artists = this.selectSeedArtists();

    var seeds = this.selectSeeds();

    console.log("Seeds: " + seeds.map((seed) => seed.name));



    await this.getTrackRecommendationsFromSpotify(seeds, finalSize, responseSize).then((tracks) => {
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
  private async getTrackRecommendationsFromSpotify(seeds: Seed[], finalSize: number = 1, responseSize: number = 50) {

    if (seeds.length == 0) {
      console.log("No seeds");
      return [] as SpotifyApi.TrackObjectFull[];
    }

    const seed_tracks = seeds.filter((seed) => seed.type == "track").map((seed) => seed.id);
    const seed_genres = seeds.filter((seed) => seed.type == "genre").map((seed) => seed.id);
    const seed_artists = seeds.filter((seed) => seed.type == "artist").map((seed) => seed.id);

    const tracks = await
      this._spotify.getRecommendations({
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

  public getTrackSeeds(): Seed[] {
    return this.mapTracksToSeeds(this.tracks);
  }

  public mapTracksToSeeds(tracks: SpotifyApi.TrackObjectFull[]): Seed[] {
    return tracks.map((track) => {
      return {
        name: track.name,
        type: "track",
        id: track.id,
      }
    });
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
    const trackId = track.id;

    // add this track id to the liked tracks in the database
    set(ref(database, "Decks/" + this.user?.id + "/" + this.id + "/likedTracks/" + trackId), {
      trackID: trackId,
    });

    this.likedTracks.push(track);
  }

  private handleDislike(index: number) {
    const track = this.tracks[index];
    const trackId = track.id;

    // add this track id to the disliked tracks in the database
    set(ref(database, "Decks/" + this.user?.id + "/" + this.id + "/dislikedTracks/" + trackId), {
      trackID: trackId,
    });

    this.dislikedTracks.push(track);
  }

}



const deckContext = createContext({
  deckManager: new DeckManager(),
});

export const DeckManagerProvider = ({ children }) => {

  const { spotify, user } = useAuth();

  const [deckManager, setDeckManager] = React.useState<DeckManager>(new DeckManager());

  React.useEffect(() => {
    if (spotify == null || user == null) return;

    console.log("deck manager provider mounted");
    setDeckManager(new DeckManager(spotify, user));
  }, [spotify, user]);

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