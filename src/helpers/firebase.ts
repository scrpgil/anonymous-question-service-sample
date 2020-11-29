import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { FIREBASE_CONFIG } from './firebaseConfig';
import { IMessage } from '../interfaces/message';

firebase.initializeApp(FIREBASE_CONFIG);

const auth = firebase.auth();
export default auth;
export const authenticateGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};

export const isAuth = () => {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      resolve(user || null);
    });
  });
};

const db = firebase.firestore();

export const getUserRef = (userId: string) => {
  return db.collection(`users`).doc(userId);
};

export const addMessage = (userId: string, message: IMessage) => {
  const ref = getUserRef(userId);
  return ref.collection(`messages`).add(message);
};

export const getMessages = (userId: string, createdAt: Date = new Date()) => {
  const ref = getUserRef(userId);
  return ref.collection('messages').where('createdAt', '<', createdAt).orderBy('createdAt', 'desc').limit(10).get();
};

export const isTimestamp = (arg: any) => {
  return arg.seconds !== undefined;
};
export const formatDate = (timeStamp: any) => {
  let dt = new Date();
  if (isTimestamp(timeStamp)) {
    dt = timeStamp.toDate();
  }
  return dt.getMonth() + 1 + '/' + dt.getDate();
};
export const getMessageRef = (userId: string, messageId: string) => {
  const ref = getUserRef(userId);
  return ref.collection(`messages`).doc(messageId);
};

export const getMessage = (userId: string, messageId: string) => {
  const ref = getMessageRef(userId, messageId);
  return ref.get();
};

export const getUser = (userId: string) => {
  const ref = getUserRef(userId);
  return ref.get();
};

export const putMessage = (userId: string, messageId: string, message: IMessage) => {
  const ref = getMessageRef(userId, messageId);
  message.updatedAt = new Date();
  return ref.update(message);
};

export const getUsers = (createdAt: Date = new Date()) => {
  return db.collection('users').where('createdAt', '<', createdAt).orderBy('createdAt', 'desc').limit(10).get();
};

export const signOut = async () => {
  await firebase.auth().signOut();
};

export const updateUserName = async (userId: string, name: string) => {
  await firebase.auth().currentUser.updateProfile({
    displayName: name,
  });
  const ref = getUserRef(userId);
  return ref.update({ name: name });
};
