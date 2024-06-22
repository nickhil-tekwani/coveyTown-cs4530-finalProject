/**
 * Represents a song with a title, artist, and audio source
 */
export default class Song {
    private _title: string;

    private _artist: string;

    private _audioSrc: string;

    private _requester: string;

    constructor(title: string, artist: string, audioSrc: string, requester: string) {
        this._title = title;
        this._artist = artist;
        this._audioSrc = audioSrc;
        this._requester = requester;
    }

    get title(): string {
        return this._title;
    }

    get artist(): string {
        return this._artist;
    }

    get audioSrc(): string {
        return this._audioSrc;
    }

    get requester(): string {
        return this._requester;
    }
}
