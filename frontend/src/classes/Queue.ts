import Song from "./Song";

/**
 * Represents a Queue with a list of songs in the queue, and a list of song requests
 */
export default class Queue {
  private _songs: Song[];

  private _requests: Song[];

  constructor(songs: Song[], requests: Song[]) {
    if (songs.length === 0) {
      songs.push( new Song("Determinate", "Bridget Mendler", 
    "https://mp3-file-uploader-test.s3.amazonaws.com/Bridget+Mendler+-+Determinate.mp3", "Default"));
    }
    this._songs = songs;
    this._requests = requests;
  }

  get songs(): Song[] {
    return this._songs;
  }

  get requests(): Song[] {
    return this._requests;
  }

  /**
   * Add a song to the end of the requests list of this queue
   * @param song the song to add
   */
  public addRequest(song: Song) {
    this._requests.push(song);
  }

  /**
   * Delete the request at the given index in the requests list
   * @param index the index of the song to delete from the requests list
   */
  public deleteRequest(index: number) {
    this._requests.splice(index, 1);
  }

  /**
   * Accepts the song in the request list at the given index and adds it to the bottom of the songs list
   * @param index index of the song in the request list to accept
   */
  public acceptRequest(index: number) {
    const song = this._requests.splice(index, 1)[0];
    this.addSong(song);
  }

  /**
   * Adds a song to the bottom of the songs list
   * @param song the song to be added
   */
  public addSong(song: Song) {
    this._songs.push(song);
  }

  /**
   * Deletes the song at the given index in the songs list
   * @param index the index of the song to delete from the songs list
   */
  public deleteSong(index: number) {
    this._songs.splice(index, 1);
  }

}
