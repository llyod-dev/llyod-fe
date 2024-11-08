const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const {
  TokenCredentialAuthenticationProvider,
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");

import {
  getDatabase,
  ref,
  child,
  push,
  update,
  remove,
  get,
} from "firebase/database";
import { db } from "@/config";
import { v4 as uuidv4 } from "uuid";

const credential = new ClientSecretCredential(
  "6b1b00fa-7a1a-4bc2-a303-9fd4de9f3540",
  "92c95da7-ec65-4825-8756-feeb96b796c9",
  "rxo8Q~P3A~CDpTI0HLg-Df.vR2ABK.qseHYlxcEd"
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ["https://graph.microsoft.com/.default"],
});

const graphClient = Client.initWithMiddleware({ authProvider: authProvider });

export default async function handler(req, res) {
  const data = req.body.data;
  const url = process.env.LLYOD_AI;
  //const url = "http://127.0.0.1:5002";
  console.log("data is ", data);
  console.log("url is ", url);

  try {
    const reply_to = data.reply_to;
    const message = data.message;
    const message_type = data.message_type;
    if (message_type == "email") {
      await sendReplyAsUser(reply_to, message);
    }

    // ------ for send sms-----
    if (message_type == "SMS") {
      const response = await fetch(`${url}/send-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      const responseData = await response.json();
      console.log("reply sent as sms ", responseData);
    }

    if (req.body?.chat_id) {
      if (req.body.messageKey) {
        await updateMessageInFirebase(
          req.body.chat_id,
          req.body.messageKey,
          data
        );
      } else await saveMessageinFirebase(req.body.chat_id, data);
    }

    res.status(200).json({
      sent_status: true,
    });
  } catch (error) {
    console.error("Error sending POST request:", error);
    res.status(500).json({ error: "something went wrong", sent_status: false });
  }
}

// Function to send a reply as a specific user
async function sendReplyAsUser(reply_to, message) {
  const replyMail = {
    comment: message,
  };

  try {
    await graphClient
      .api(`/users/reservations@nestago.com/messages/${reply_to}/reply`)
      .post(replyMail);
  } catch (error) {
    console.log("Error sending reply:", error);
  }
}

// Example: Send a reply as reservations@nestago.com

// const message = "Thank you for your message. This is an automated reply.";

// const reply_to =
//   "AAMkADE1OTI1ZTUzLTA2Y2UtNGM0OC1iNTIyLWViOTJlMjk2ZDM4MwBGAAAAAACnwFZsA-J5R43l5-lTGWxKBwCZV34fhDHgRL5HaGtx-804AAAAAAEMAACZV34fhDHgRL5HaGtx-804AAP7iGTmAAA=";

// sendReplyAsUser(reply_to, message);

export function saveMessageinFirebase(chat_id, messageData) {
  try {
    console.log("saving message in Firebase DB");

    console.log("----messageData----- ", messageData);
    const chatsRef = ref(db, `chats/${chat_id}/messages`);

    // ------------
    // Get a key for a new Post.
    const newMessageKey = push(chatsRef).key;

    const updates = {};
    updates[`chats/${chat_id}/messages/${newMessageKey}`] = messageData;

    update(ref(db), updates);
    updateLastInteractionInFirebase(chat_id);
    // ------------
  } catch (error) {
    console.error("Error saving the message:", error);
    return false;
  }
}
export function updateMessageInFirebase(chat_id, messageKey, messageData) {
  try {
    console.log("updating message in Firebase DB");

    const updates = {};

    updates[`chats/${chat_id}/messages/${messageKey}`] = messageData;

    update(ref(db), updates);
    updateLastInteractionInFirebase(chat_id);
    console.log("Message updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating the message:", error);
    return false;
  }
}
export async function updateLastInteractionInFirebase(chat_id) {
  try {
    console.log("updating message in Firebase DB");

    // Fetch the existing reservation data
    const reservationRef = ref(db, `reservations/${chat_id}`);
    const snapshot = await get(reservationRef);

    if (snapshot.exists()) {
      // If the reservation exists, update only the last_interaction field
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const existingData = snapshot.val();
      existingData.last_interaction = formattedDate;

      // Perform the update
      await update(ref(db, `reservations/${chat_id}`), existingData);

      console.log("last_interaction updated successfully");
      return true;
    } else {
      console.log("Reservation not found");
      return false;
    }
  } catch (error) {
    console.error("Error updating the last_interaction:", error);
    return false;
  }
}
