import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { nanoid } from "nanoid";
import { Button } from "@material-ui/core";
import ConversationArea from '../../../../classes/ConversationArea';
import useCoveyAppState from '../../../../hooks/useCoveyAppState';
import useConversationAreas from '../../../../hooks/useConversationAreas';
import usePlayersInTown from '../../../../hooks/usePlayersInTown';

import "./MP3FileUploaderStyle.css";
import useMaybeVideo from "../../../../hooks/useMaybeVideo";
import Song from '../../../../classes/Song';

/**
 * A basic file uploader that only accepts mp3 files and has functionality to open the operating systems file system
 * and allow a user to select a file to upload to the program.
 *
 * This file is saved in local storage for now.
 */
export default function MP3FileUploader(): JSX.Element {

  const [file, setFile] = useState<File>(); // the current file that has been uploaded
  const [songName, setSongName] = useState<string>();
  const [artistName, setArtistName] = useState<string>();
  const [dataSubmittable, setDataSubmittable] = useState<boolean>(false);
  const bucket = 'mp3-file-uploader-test'
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
  })
  const [isSongInputFocused, setIsSongInputFocused] = useState(false);
  const [isArtistInputFocused, setIsArtistInputFocused] = useState(false);

  const video = useMaybeVideo(); // constant for pausing keyboard shortcuts from rest of app when typing

  const appState = useCoveyAppState();
  const players = usePlayersInTown();
  const conversationAreas = useConversationAreas();
  let thisArea: ConversationArea;

  for (let i = 0; i < conversationAreas.length; i+=1) {
    thisArea = conversationAreas[i];
    if (thisArea.occupants.includes(appState.myPlayerID)) {
      break;
    }
  }

  // check if input fields have been clicked on, if yes, then pause keyboard shortcuts
  useEffect(() => {
    if (isSongInputFocused) {
      video?.pauseGame();
    } else {
      video?.unPauseGame();
    }
  }, [isSongInputFocused, video]);

  useEffect(() => {
    if (isArtistInputFocused) {
      video?.pauseGame();
    } else {
      video?.unPauseGame();
    }
  }, [isArtistInputFocused, video]);


  const uploadToS3 = (fileContents: File, songTitle: string) => {
    const key = songTitle + nanoid();

    return new Promise((resolve, reject) => {
      const params = {
        Key: key,
        Bucket: bucket,
        Body: fileContents,
        ContentType: 'audio/mpeg',
      }

      s3.upload(params, (err:Error, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    })
  }

  /**
   * Sets the uploaded file locally in component.
   * @param event the file being uploaded
   */
  const onFileUploaded = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const uploadedFile: File = event.target.files[0];
      if (uploadedFile) {
        setFile(uploadedFile);
      }
    }
  };

  /**
   * Input for song name metadata, once a file has been uploaded
   * @param event the song name being inputted
   */
  const onSongNameInputted = (event: React.ChangeEvent<HTMLInputElement>): void => {

    const song = event.target.value;
    if (song) {
      setSongName(song);
    }
    // if this is the last metadata inputted, set submittable to true
    if (file && song && artistName && song.length > 0) {
      setDataSubmittable(true);
    } else {
      setDataSubmittable(false);
    }
  }

  /**
   * Input for artist name metadata, once a file has been uploaded.
   * @param event the artist name being inputted
   */
  const onArtistNameInputted = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const artist = event.target.value;
    if (artist) {
      setArtistName(artist);
    }
    // if this is the last metadata inputted, set submittable to true
    if (file && songName && artist && artist.length > 0) {
      setDataSubmittable(true);
    } else {
      setDataSubmittable(false);
    }
  }


  /**
   * Action when the submit file button is pressed.
   * Saves the uploaded file to local storage.
   */
  const onSubmit = async (): Promise<void> => {
    if (file && songName && artistName) {
      // we had to disable linter for this line because wwe are working with an external library (S3) so we caannot provide a type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any =

        // needed to move to new line to disable linter issue
        // disabled linter issue on the line bacues we do need the inputs to not be null in order to display the right song data
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await uploadToS3(file, songName);

        const requester = players.find(p => p.id === appState.myPlayerID);

        if (requester) {
          const requesterName = requester.userName;
          const request: Song = new Song(songName, artistName, response.Location, requesterName);


          thisArea.queue.addRequest(request);
          setDataSubmittable(false); // set data not submittable after it has been saved
        }
      }
    }

    // TODO make button styling consistent later on when we have more styling to do
    return (
      <>
        <form className="center" method="post">
            <div className="paddingBelow">
                <label htmlFor="file-upload">
                    <input type="file" accept=".mp3" onChange={onFileUploaded} />
                </label>
            </div>

          {file &&
            <div className="inputGroup">
              <div className="inputs">
              <label htmlFor="input-track-name">Input Song Title:
                <input className="inputBox" type="text" onChange={onSongNameInputted}
                       onFocus={() => setIsSongInputFocused(true)}
                       onBlur={() => setIsSongInputFocused(false)}/>
              </label>
              </div>
              <div className="inputs">
              <label htmlFor="input-arist-name">Input Artist Name:
                <input className="inputBox" type="text" onChange={onArtistNameInputted}
                       onFocus={() => setIsArtistInputFocused(true)}
                       onBlur={() => setIsArtistInputFocused(false)}/>
              </label>
              </div>
            </div>}
        </form>


        <Button
        onClick={onSubmit}
        variant="contained"
        disabled={!dataSubmittable}
        className="submit">
          Submit
        </Button>

      </>
    )
};
