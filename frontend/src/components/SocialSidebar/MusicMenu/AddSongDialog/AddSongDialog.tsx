import React from 'react';

import {
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
} from '@material-ui/core';
import MP3FileUploader from '../MP3FileUploader/MP3FileUploader';

import "./AddSongDialogStyle.css"

/**
 * A popup with ability for user to upload an mp3 file and add it to the queue.
 * @param open if this dialog should be displayed
 * @param onClose function for when this dialog is closed
 */
export default function AddSongDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  // const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle className='mainText'>Upload an audio file</DialogTitle>
      <MP3FileUploader />
      <DialogActions>
        <Button variant="contained" className='doneButton' onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
