// Initialize firebase
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';
import { writable } from 'svelte/store';

const firebaseConfig = {
  apiKey: 'AIzaSyBSDQTQrnklilGdmyZcEXMGhIwg0dFpNlY',
  authDomain: 'thought-segmentation.firebaseapp.com',
  databaseURL: 'https://thought-segmentation.firebaseio.com',
  projectId: 'thought-segmentation',
  storageBucket: 'thought-segmentation.appspot.com',
  messagingSenderId: '456731753647',
  appId: '1:456731753647:web:079b4e850e4c03f2e1a85a'
};

firebase.initializeApp(firebaseConfig);

// Export firebase globals for use elsewhere in the app
export const db = firebase.database();
export const storage = firebase.storage();
export const auth = firebase.auth();
export const serverTime = firebase.database.ServerValue.TIMESTAMP;

// Creates dictionary to allow for number referencing of recordings
export const makeRecordingDict = async () => {
  let count = -1; // accounts for quiz.mp3
  const recordingDict = {};
  const storageItems = await storage.ref().listAll();
  storageItems.items.forEach((itemRef) => {
    // All the items under listRef.
    recordingDict[itemRef.location.path] = count;
    count += 1;
  });
  return recordingDict;
};

// dev is referenced as a store elsewhere in the code, so cannot be a simple Boolean
// eslint-disable-next-line no-undef
export const dev = DEV_MODE ? writable(true) : writable(false);

// Functions to parse the URL to get workerID, hitID, and assignmentID
const unescapeURL = (s) => decodeURIComponent(s.replace(/\+/g, '%20'));
export const getURLParams = () => {
  const params = {};
  const m = window.location.href.match(/[\\?&]([^=]+)=([^&#]*)/g);
  if (m) {
    let i = 0;
    while (i < m.length) {
      const a = m[i].match(/.([^=]+)=(.*)/);
      params[unescapeURL(a[1])] = unescapeURL(a[2]);
      i += 1;
    }
  }
  if (!params.workerId && !params.assignmentId && !params.hitId) {
    // eslint-disable-next-line no-undef
    if (DEV_MODE) {
      console.log(
        'App running in dev mode so HIT submission will not work!\nTo test in the sandbox make sure to deploy the app.'
      );
      params.workerId = 'test-worker';
      params.assignmentId = 'test-assignment';
      params.hitId = 'test-hit';
    }
  }
  console.log(params);
  return params;
};

// Use those functions to get the window URL params and make them available throughout the app
export const params = getURLParams();

// Shuffle array elements inplace: https://javascript.info/task/shuffle
export const fisherYatesShuffle = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const globalVars = {
  bonusPerRecording: 0.5,
  basePayment: 1.0
};
