import { createContext } from 'react'
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import React from 'react';
// @ts-ignore
import database from "../../../firebaseConfig.tsx";
import { push, ref, set, child, get, getDatabase, onValue, DatabaseReference, update } from "firebase/database";
import useAuth from './useAuth';
import SpotifyWebApi from "spotify-web-api-js";

export type SeedType = "track" | "artist" | "genre";

export type Seed = {
  id: string
  name: string,
  type: SeedType,
  image: string,
}

export type Deck = {
  id: string,
  name: string,
  seeds: Seed[],
  likedTracks: SpotifyApi.TrackObjectFull[],
  dislikedTracks: SpotifyApi.TrackObjectFull[],
}

class DeckManager {


  dbRef: DatabaseReference = ref(database);


  _spotify: SpotifyWebApi.SpotifyWebApiJs = new SpotifyWebApi();
  _user: any;

  tracks: SpotifyApi.TrackObjectFull[] = [];

  selectedDeck!: Deck;

  public isInitialized: boolean = false;

  constructor(public spotify?: SpotifyWebApi.SpotifyWebApiJs, public user?: any) {

    if (!spotify || !user) {
      return;
    }
    this.isInitialized = true;

    this._spotify = spotify;
    this._user = user;

    this.initializeSelectedDeck().then((deck) => {
      this.setSelectedDeck(deck);
    }).catch((error) => {
      console.error(error);
    });

  }

  /**
   * Initializes the selected deck by querying the database for the selected deck.
   * If no selected deck is found, the user's first deck is selected.
   * If no deck is found, a default empty deck is created and selected.
   */
  public async initializeSelectedDeck(): Promise<Deck> {
    // Set the selected deck
    var deck: Deck = {
      id: "",
      name: "",
      seeds: [],
      likedTracks: [],
      dislikedTracks: []
    };

    console.log();
    console.log("==================== Querying Database ====================");
    const query = this.getDecksFromDatabase().then((decks) => {
      if (decks.length > 0) {
        console.log("Found " + decks.length + " decks in database");
        console.log("Decks: " + decks.map((deck) => deck.name + "(" + deck.id + ")").join(", "));
        console.log();
        console.log("pulling from selected deck (searching through loop for matching ID for now)");
        console.log();

        deck = decks[0];
      } else {
        console.log("No decks found in database, creating default empty deck");
      }

      return deck;
    }).catch((error) => {
      console.error(error);
      return deck;
    });

    return query;
  }


  public async setSelectedDeck(deck: Deck) {

    console.log("Setting selected deck: " + deck.name + "(" + deck.id + ")");

    // if (this.selectedDeck.id) {
    //   update(ref(database, "Decks/" + this.user.id + "/" + this.selectedDeck.id), {
    //     selected: false
    //   });
    // }

    const newDeck = {
      id: deck.id,
      name: deck.name,
      seeds: deck.seeds,
      likedTracks: deck.likedTracks,
      dislikedTracks: deck.dislikedTracks,
    }

    this.selectedDeck = newDeck;

    this.tracks = [];

    console.log("Loaded Seeds: " + this.selectedDeck.seeds.map((seed) => seed.name).join(", "));
    console.log("Loaded Liked Tracks: " + this.selectedDeck.likedTracks.map((track) => track.name).join(", "));
    console.log("Loaded Disliked Tracks: " + this.selectedDeck.dislikedTracks.map((track) => track.name).join(", "));

    this.addNewTracksFromSpotify(5);

    //const db = getDatabase();
    const p = set(ref(database, "SelectedDecks/" + this.user?.id), {
      id: this.selectedDeck.id
    });

  }

  /**
   * Removes all of the data of the current user from the database
   */
  public async deleteData() {
    const db = getDatabase();
    console.log("USER TO DELETE: " + this.user.id)
    await set(ref(db, "Decks/" + this.user.id), null).catch((error) => {
      console.error(error);
    });
    await set(ref(db, "SelectedDecks/" + this.user.id), null).catch((error) => {
      console.error(error);
    });

    this.selectedDeck = {
      id: "",
      name: "",
      seeds: [],
      likedTracks: [],
      dislikedTracks: []
    };

    this.tracks = [];

  }


  /**
   * Initializes the deck with a given size
   * @param finalSize the size of the deck after filtering
   * @param responseSize the size of the response from the spotify api
   */
  public async createNewDeck(name: string, seeds: Seed[], finalSize: number = 5, responseSize: number = 50) {
    await this.getTrackRecommendationsFromSpotify(seeds, finalSize, responseSize).then((tracks) => {
      this.tracks = tracks as SpotifyApi.TrackObjectFull[];

      // Create new deck
      const newDeck: Deck = {
        id: "",
        name: name,
        seeds: seeds,
        likedTracks: [],
        dislikedTracks: []
      };

      // Push new deck to database
      this.pushDeckToDatabase(newDeck).then((id) => {
        newDeck.id = id;
        this.setSelectedDeck(newDeck);
        console.log("Setting selected deck: " + newDeck.name + "(" + newDeck.id + ")");
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
 * Pushes the given deck to the database and returns the id of the deck
 * @param deck the deck to push to the database
 * @returns the newly assigned id of the deck
 */
  private async pushDeckToDatabase(deck: Deck): Promise<string> {
    const p = push(ref(database, "Decks/" + this.user.id), {
      name: deck.name,
      seeds: deck.seeds,
      likedTracks: deck.likedTracks,
      dislikedTracks: deck.dislikedTracks,
      selected: true,
    }).catch((error) => {
      console.error(error);
      return null;
    }).then((ref) => {
      const dbRef = ref as DatabaseReference;
      const id = dbRef.key as string;
      return id;
    });
    return p;
  }

  public async getDeckFromDatabase(id: string): Promise<Deck | null> {
    const userId = this.user.id;
    const db = getDatabase();
    const deck = await get(child(this.dbRef, `Decks/${userId}/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const deck = snapshot.val() as Deck;
        deck.id = id;
        return deck;
      } else {
        console.log("No data available");
        return null;
      }
    }).catch((error) => {
      console.error(error);
      return null;
    });

    if (!deck) {
      console.log("No deck found");
      return null;
    }

    return deck;
  }



  public async getSelectedDeck() {
    const userId = this.user.id;
    const db = getDatabase();
    get(child(this.dbRef, `Decks/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((deckEntry) => {
          let deck = deckEntry.val();
          return deck.id;
        })
      }
    });
    return "Error failed to retrieve selected deck";
  }

  //load's a user's deck from the database
  public async getDecksFromDatabase(): Promise<Deck[]> {
    const userId = this.user.id;
    const db = getDatabase();
    const decks = await get(child(this.dbRef, `Decks/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const decks: Deck[] = Object.entries(snapshot.val()).map(([key, value]) => {

          const deck = value as Deck;
          deck.id = key;

          const v = value as any;
          if (v.likedTracks) {
            const likedTracks = Object.entries(v.likedTracks).map(([key, value]) => {
              const track = value as SpotifyApi.TrackObjectFull;
              return track;
            });
            deck.likedTracks = likedTracks;
          } else {
            deck.likedTracks = [] as SpotifyApi.TrackObjectFull[];
          }

          if (v.dislikedTracks) {
            const dislikedTracks = Object.entries(v.dislikedTracks).map(([key, value]) => {
              const track = value as SpotifyApi.TrackObjectFull;
              return track;
            });
            deck.dislikedTracks = dislikedTracks;
          } else {
            deck.dislikedTracks = [] as SpotifyApi.TrackObjectFull[];
          }

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
      return [] as Deck[];
    });

    return decks as Deck[];
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
    // if (this.selectedDeck.likedTracks.length == 0) {
    //   return this.getTrackSeeds().slice(Math.max(this.tracks.length - 5, 0), this.tracks.length);
    // }

    if (this.selectedDeck.likedTracks.length == 0) {
      return this.selectedDeck.seeds;
    }

    const likedTrackIds = this.mapTracksToSeeds(this.selectedDeck.likedTracks);
    const lastLikedTrackIds = likedTrackIds.slice(Math.max(this.selectedDeck.likedTracks.length - 5, 0), this.selectedDeck.likedTracks.length);
    return lastLikedTrackIds;
  }

  /**
   * Adds new tracks to the deck from the spotify api
   * Passes track ids as seed tracks
   * @param finalSize 
   * @param responseSize 
   */
  public async addNewTracksFromSpotify(finalSize: number = 1, responseSize: number = 50) {

    var seeds = this.selectSeeds();

    await this.getTrackRecommendationsFromSpotify(seeds, finalSize, responseSize).then((tracks) => {
      this.addTracks(tracks as SpotifyApi.TrackObjectFull[]);

      const t = tracks as SpotifyApi.TrackObjectFull[];
      console.log();
      console.log("==================== Adding new track" + (t.length > 1 ? "s" : "") + " ====================");
      console.log("TRACK" + (t.length > 1 ? "S" : "") + ": [" + t.map((track: { name: any; }) => track.name).join(", ") + "]");
      console.log("SEEDS USED: [" + seeds.map((seed) => seed.name).join(", ") + "]");

      return tracks;
    });
  }

  /**
   * Calls the spotify api to get track recommendations then filters them
   * @param seeds the seeds to use for the spotify api
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
    return tracks.filter((track) => track.preview_url != null
      && this.selectedDeck.likedTracks.findIndex((likedTrack) => likedTrack.id == track.id) == -1
      && this.selectedDeck.dislikedTracks.findIndex((dislikedTrack) => dislikedTrack.id == track.id) == -1);
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
        image: track.album.images[0].url,
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
    set(ref(database, "Decks/" + this.user?.id + "/" + this.selectedDeck.id + "/likedTracks/" + track.id), {
      album: track.album,
      artists: track.artists,
      available_markets: track.available_markets,
      disc_number: track.disc_number,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      external_ids: track.external_ids,
      external_urls: track.external_urls,
      href: track.href,
      id: track.id,
      is_local: false,
      name: track.name,
      popularity: track.popularity,
      preview_url: track.preview_url,
      track_number: track.track_number,
      type: track.type,
      uri: track.uri,
    }).catch((error) => {
      console.log(error);
    });

    this.selectedDeck.likedTracks.push(track);
  }

  private handleDislike(index: number) {
    const track = this.tracks[index];
    const trackId = track.id;

    // add this track id to the disliked tracks in the database
    set(ref(database, "Decks/" + this.user?.id + "/" + this.selectedDeck.id + "/dislikedTracks/" + trackId), {
      album: track.album,
      artists: track.artists,
      available_markets: track.available_markets,
      disc_number: track.disc_number,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      external_ids: track.external_ids,
      external_urls: track.external_urls,
      href: track.href,
      id: track.id,
      is_local: false,
      name: track.name,
      popularity: track.popularity,
      preview_url: track.preview_url,
      track_number: track.track_number,
      type: track.type,
      uri: track.uri,
    }).catch((error) => {
      console.log(error);
    });

    this.selectedDeck.dislikedTracks.push(track);
  }

}



const deckContext = createContext({
  deckManager: new DeckManager(),
});

// @ts-ignore
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