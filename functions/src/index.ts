import * as functions from 'firebase-functions';
import { addUser } from './libs/auth';

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.addUserTrigger = functions.auth.user().onCreate(async (user: any) => {
  await addUser(db, user);
  return 0;
});