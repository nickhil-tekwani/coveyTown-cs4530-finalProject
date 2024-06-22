import React, { useState, useRef } from 'react';
import { Button, styled, Theme, useMediaQuery, Menu as MenuContainer, MenuItem } from '@material-ui/core';
import FileUploadIcon from '../../VideoCall/VideoFrontend/icons/FileUploadIcon';
import MusicNoteIcon from '../../VideoCall/VideoFrontend/icons/MusicNoteIcon';
import AddSongDialog from './AddSongDialog/AddSongDialog';
import SongQueue from './SongQueue/SongQueue'
import MusicPlayer from '../../MusicPlayer/MusicPlayer';
import "./MusicMenuStyle.css"
import usePlayersInTown from '../../../hooks/usePlayersInTown';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import ConversationArea from '../../../classes/ConversationArea';
import useConversationAreas from '../../../hooks/useConversationAreas';

export const IconContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '1.5em',
  marginRight: '0.3em',
});



/**
 *  Component that renders all music integrations controls into covey.town including ability to
 *  upload mp3 files into the queue, control music output, and display the queue.
 *
 *  props: { buttonClassName?: string }
 */
export default function MusicMenu() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [menuOpen, setMenuOpen] = useState(false);
  const [addSongDialogOpen, setAddSongDialogOpen] = useState(false); // for the add song popup button

  const anchorRef = useRef<HTMLButtonElement>(null);

  const players = usePlayersInTown();
  const app = useCoveyAppState();
  
  const currPlayerID = app.myPlayerID;
  const currPlayer = players.find(player => player.id === currPlayerID);

  const conversationAreas = useConversationAreas();
  let thisArea: ConversationArea = conversationAreas[0];

  for (let i = 0; i < conversationAreas.length; i+=1) {
    thisArea = conversationAreas[i];
    if (thisArea.occupants.includes(currPlayerID)) {
      break;
    }
  }
  
  if (currPlayer) {
    if (thisArea.occupants[0] === currPlayerID) {
      currPlayer.isHost = true;
    } else {
      currPlayer.isHost = false;
    }
  }

  let isHost;
  

  if (currPlayer) {
    isHost = currPlayer.isHost;
  } else {
    isHost = false;
  }

  

  return (
    <>
      <Button
        onClick={() => setMenuOpen(isOpen => !isOpen)}
        variant="contained"
      >
        {isMobile ? (
          <MusicNoteIcon />
        ) : (
          <>
            <MusicNoteIcon />
            Connect Audio
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen(isOpen => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : 'bottom',
          horizontal: 'center',
        }}
      >
        <h1 className='connectAudio'>Connect Audio</h1>
        
        { isHost ? (
          <h2 className='headings'>You are the <b className='hostTitle'>HOST</b></h2>
        ) : (
          <h2 className='headings'>You are a <b className='hostTitle'>LISTENER</b></h2>
        )}
        <br/>
        <MusicPlayer />
        <br/>
        <br/>
        <h2 className='headings'>Queue:</h2>
        <MenuItem >
          <Button variant="contained" className='songButton' onClick={() => { setAddSongDialogOpen(true) }}>
            <IconContainer>
              <FileUploadIcon />
            </IconContainer>
            Add song
          </Button>
        </MenuItem>

        <br />
        <SongQueue />
        <MenuItem>
          <Button variant="contained" className='doneButton' onClick={() => setMenuOpen(false)}>
            Done
          </Button>
        </MenuItem>
      </MenuContainer>

      <AddSongDialog
        open={addSongDialogOpen}
        onClose={() => {
          setAddSongDialogOpen(false);
        }}
      />

    </>
  );
}
