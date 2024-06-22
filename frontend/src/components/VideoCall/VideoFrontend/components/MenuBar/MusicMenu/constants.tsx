import React from 'react';
import Queue from '../../../../../../classes/Queue';

const blankQueue = new Queue([], []);

const QueueMap = new Map<string, Queue>();
QueueMap.set("Foyer Table 6", blankQueue);
QueueMap.set("Foyer Table 7", blankQueue);
QueueMap.set("Foyer Table 4", blankQueue);
QueueMap.set("Foyer Table 5", blankQueue);
QueueMap.set("Foyer Table 2", blankQueue);
QueueMap.set("Foyer Table 3", blankQueue);
QueueMap.set("Foyer Table 1", blankQueue);
QueueMap.set("Basement Lounge", blankQueue);
QueueMap.set("Basement Dining Table 1", blankQueue);
QueueMap.set("Basement Dining Table 2", blankQueue);

export default QueueMap;