import * as functions from 'firebase-functions';
import { addUser } from './libs/auth';

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const bucket = admin.storage().bucket();
import { generateMessageImage } from './libs/message';

import * as express from "express";
var ejs = require("ejs");

const cors = require("cors")({ origin: true });
const api = express();
api.set("view engine", "ejs");
api.engine("ejs", ejs.__express);
api.use(cors);


exports.addUserTrigger = functions.auth.user().onCreate(async (user: any) => {
  await addUser(db, user);
  return 0;
});

api.get("/messages/:userId/:messageId", async (req, res) => {
  const userId = req.params.userId;
  const messageId = req.params.messageId;
  const docRef = await db
    .doc("users/" + userId + "/messages/" + messageId)
    .get();
  const message = docRef.data();
  const imageUrl = getFirebaseStorageUrl(`users/${userId}/${messageId}.jpg`);
  res.render("ogp", {
    title: message.body,
    imageUrl: imageUrl,
  });
});
exports.api = functions.https.onRequest(api);

export const getFirebaseStorageUrl = (targetPath: string): string =>
  `https://firebasestorage.googleapis.com/v0/b/${process.env.GCLOUD_PROJECT}.appspot.com/o/${encodeURIComponent(
    targetPath
  )}?alt=media`;

exports.addMessageTrigger = functions.firestore
  .document("users/{userId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    await generateMessageImage(context.params.userId, snapshot, bucket);
    return 0;
});