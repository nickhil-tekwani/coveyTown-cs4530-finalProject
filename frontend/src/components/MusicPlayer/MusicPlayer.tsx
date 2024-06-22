import React, { useState, useEffect, useRef } from 'react';
import "./musicPlayerStyles.css"
import { ReactComponent as Play } from './svgSymbols/play.svg';
import { ReactComponent as Pause } from './svgSymbols/pause.svg';
import { ReactComponent as Next } from './svgSymbols/next.svg';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import useConversationAreas from '../../hooks/useConversationAreas';
import ConversationArea from '../../classes/ConversationArea';
import Queue from '../../classes/Queue';


/**
 * Represents the component for playing music
 * Adapted from https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks
 *
 * @param param0 The songs available to be played
 */
export default function MusicPlayer(): JSX.Element {
    const songIndex = 0;
    const [isPlaying, setIsPlaying] = useState(false);

    const players = usePlayersInTown();
    const app = useCoveyAppState();
    const currPlayerID = app.myPlayerID;
    const currPlayer = players.find(player => player.id === currPlayerID);
    let isHost;
    if (currPlayer) {
        isHost = currPlayer.isHost;
    } else {
        isHost = false;
    }

    const appState = useCoveyAppState();
    const conversationAreas = useConversationAreas();
    let thisArea: ConversationArea = conversationAreas[0];

    for (let i = 0; i < conversationAreas.length; i += 1) {
        thisArea = conversationAreas[i];
        if (thisArea.occupants.includes(appState.myPlayerID)) {
            break;
        }
    }

    const [, setCurrQueue] = useState(thisArea.queue);
    const { title, artist, audioSrc } = thisArea.queue.songs[songIndex];

    // Refs
    const audioRef = useRef(new Audio(audioSrc));
    const intervalRef = useRef();
    const isReady = useRef(false);


    const onNextSong = () => {
        if (thisArea.queue.songs.length > 1) {
            thisArea.queue.deleteSong(0);
            setCurrQueue(new Queue(thisArea.queue.songs, thisArea.queue.requests));
        }
    }

    // Pause and play music using button
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() =>
        () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
        , []);

    // Handle setup when changing songs
    useEffect(() => {
        audioRef.current.pause();

        audioRef.current = new Audio(audioSrc);

        if (isReady.current) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            isReady.current = true;
        }
    }, [audioSrc, songIndex]);

    useEffect(() => {
        const updateQueueListener = {
            onQueueChange: (newQueue: Queue) => {
                thisArea.queue = newQueue;
                setCurrQueue(newQueue);
            }
        }
        thisArea.addListener(updateQueueListener);
        return () => {
            thisArea.removeListener(updateQueueListener);
        }
    }, [thisArea]);


    // Component return
    return (
        <div className="music-player">
            <div className="song-info">
                <h2 className="title">{title}</h2>
                <h3 className="artist">{artist}</h3>
                {isHost ? (
                    <div className="music-controls">
                        {isPlaying ? (
                            <button
                                type="button"
                                className="pause"
                                onClick={() => setIsPlaying(false)}
                                aria-label="Pause"
                            >
                        <Pause />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="play"
                        onClick={() => setIsPlaying(true)}
                        aria-label="Play"
                    >
                        <Play />
                    </button>
                )}

                <button
                    type="button"
                    className="next"
                    aria-label="Next"
                    onClick={onNextSong}
                >
                    <Next />
                </button>
            </div>
            ) : (
            <br />
                )}
        </div>
        </div >
    );

}
