import useAuth from '../hooks/useAuth';

const { spotify } = useAuth();

class DeckManager {
  seed_tracks: string[];
  seed_genres: string[];
  seed_artists: string[];
  deck: SpotifyApi.TrackObjectFull[];
  onDeckInitialized: () => void;

  constructor(seed_tracks: string[], seed_genres: string[], seed_artists: string[], initialSize: number = 20, onDeckInitialized: () => void = () => { }) {
    this.seed_tracks = seed_tracks;
    this.seed_genres = seed_genres;
    this.seed_artists = seed_artists;
    this.onDeckInitialized = onDeckInitialized;

    this.deck = [];
    this.initializeDeck(initialSize);
  }

  /**
   * Initializes the deck with a given size
   * @param finalSize the size of the deck after filtering
   * @param responseSize the size of the response from the spotify api
   */
  private async initializeDeck(finalSize: number, responseSize: number = 50) {
    spotify.getRecommendations({
      seed_tracks: this.seed_tracks,
      seed_genres: this.seed_genres,
      seed_artists: this.seed_artists,
      limit: responseSize,
    }).then((response) => {
      var deck = response.tracks as SpotifyApi.TrackObjectFull[];
      deck = deck.filter((track) => track.preview_url != null);
      deck = deck.slice(0, finalSize);
      this.deck = deck;
      this.onDeckInitialized();
    });
  }

  public getDeck() {
    return this.deck;
  }
}