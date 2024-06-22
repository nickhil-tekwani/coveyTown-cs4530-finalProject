import { Button, ListItem, OrderedList, StackDivider, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Queue from '../../../../classes/Queue';
import useConversationAreas from '../../../../hooks/useConversationAreas';
import useCoveyAppState from '../../../../hooks/useCoveyAppState';
import ConversationArea from '../../../../classes/ConversationArea';
import './SongQueueStyle.css';
import usePlayersInTown from '../../../../hooks/usePlayersInTown';

/**
 * Type to represent an area as a property
 */
 type AreaProps = {
  area: ConversationArea
}

function QueueAndRequests({area}: AreaProps): JSX.Element {

  const [currQueue, setCurrQueue] = useState(area.queue);
  const players = usePlayersInTown();
  const app = useCoveyAppState();
  const currPlayerID = app.myPlayerID;
  const currPlayer = players.find(player => player.id === currPlayerID);
  let isHost: boolean;
  if (currPlayer) {
    isHost = currPlayer.isHost;
  } else {
    isHost = false;
  }

  useEffect(() => {
    const updateQueueListener = {
      onQueueChange: (newQueue: Queue) => {
        area.queue = newQueue;
        setCurrQueue(newQueue);
      }
    }
    area.addListener(updateQueueListener);
    return () => {
      area.removeListener(updateQueueListener);
    }
  }, [area]);

  return <div>
  <h3>
    {' '}
    <b> Song Queue </b>{' '}
  </h3>
  {currQueue.songs.length < 1 && <div> No Songs In Queue! </div>}
  {currQueue.songs.length >= 1 && (
    <div>
      { isHost ? (
          <Button
          colorScheme='orange'
          size='xs'
          onClick={() => {
            area.queue.deleteSong(0);
            setCurrQueue(new Queue(area.queue.songs, area.queue.requests));
          }}>
          {' '}
          Remove Top Song in Queue{' '}
        </Button>
        ) : (
          <br />
        )}
      <OrderedList className='queueList'>
        {currQueue.songs.map((song) => (
          <ListItem key={song.audioSrc}>
            <b>{song.title}</b>
            <i> by</i> {song.artist} <i>Submitted By</i>: {song.requester}{' '}
          </ListItem>
        ))}
      </OrderedList>
    </div>
  )}

  <br />

  <div>
    <h3>
      {' '}
      <b> New Song Requests! </b>{' '}
    </h3>
    {currQueue.requests.length < 1 && <div> No Incoming Song Requests! </div>}
    {currQueue.requests.length >= 1 && (
      <div>
        { isHost ? (
          <Button
          colorScheme='cyan'
          size='xs'
          onClick={() => {
            area.queue.acceptRequest(0);
            setCurrQueue(new Queue(area.queue.songs, area.queue.requests));
          }}>
          {' '}
          Accept Next Song in Queue{' '}
        </Button>
        ) : (
          <br />
        )}
        { isHost ? (
          <Button
          colorScheme='orange'
          size='xs'
          onClick={() => {
            area.queue.deleteRequest(0);
            setCurrQueue(new Queue(area.queue.songs, area.queue.requests));
          }}>
          {' '}
          Reject Next Song in Queue{' '}
        </Button>
        ) : (
          <br />
        )}

        <OrderedList className='queueList'>
          {currQueue.requests.map((song) => (
            <ListItem key={song.audioSrc}>
              <b>{song.title}</b>
              <i> by</i> {song.artist} <i>Requested By</i>: {song.requester}{' '}
            </ListItem>
          ))}
        </OrderedList>
      </div>
    )}
  </div>
</div>
}


/**
 * !NEED TO ADD DOCUMENTATION
 * @returns
 */

export default function SongQueue(): JSX.Element {

  const appState = useCoveyAppState();
  const conversationAreas = useConversationAreas();
  let thisArea: ConversationArea = conversationAreas[0];

  for (let i = 0; i < conversationAreas.length; i+=1) {
    thisArea = conversationAreas[i];
    if (thisArea.occupants.includes(appState.myPlayerID)) {
      break;
    }
  }

  return (
    <VStack
      align='left'
      spacing={2}
      border='0px'
      padding={4}
      marginLeft={2}
      borderColor='gray.500'
      height='100%'
      divider={<StackDivider borderColor='gray.200' />}
      borderRadius='2px'>
      <QueueAndRequests area={thisArea} />
    </VStack>
  );
}
