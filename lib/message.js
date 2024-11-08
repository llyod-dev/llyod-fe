import {
  getDatabase,
  ref,
  child,
  push,
  update,
  remove,
} from "firebase/database";
import { db } from "@/config";
import { v4 as uuidv4 } from "uuid";
import { updateLastInteractionInFirebase } from "@/pages/api/send_response";
export async function saveMessageinFirebase(
  setNewMessage,
  newMessage,
  chat_id,
  lastmessage,
  setLoading
) {
  try {
    console.log("saving message in Firebase DB");
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const messageData = {
      sender_type: "VA",
      message: newMessage,
      message_id: uuidv4(),
      createAt: formattedDate,
      status: "sent",
      message_type: lastmessage?.message_type,
      reply_to:
        lastmessage?.message_type == "SMS"
          ? lastmessage?.reply_to
          : lastmessage?.message_id,
      read: true, // New messages are marked as unread by default
    };
    //console.log("----messageData----- ", messageData);
    // const chatsRef = ref(db, `chats/${chat_id}/messages`);

    // // ------------
    // // Get a key for a new Post.
    // const newMessageKey = push(chatsRef).key;

    // const updates = {};
    // updates[`chats/${chat_id}/messages/${newMessageKey}`] = messageData;

    // update(ref(db), updates).then(
    //   async () => {
    //     console.log(" saved the message  successfully");
    //     setNewMessage("");
    //     const response = await fetch(`/api/send_response`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ data: messageData, chat_id }),
    //     });

    //     const responseData = await response.json();
    //   },
    //   () => {
    //     console.log("coud not save the message ");
    //     setNewMessage("");
    //   }
    // );

    // console.log(" saved the message  successfully");

    const response = await fetch(`/api/send_response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: messageData, chat_id }),
    });

    const responseData = await response.json();
    console.log("responseData is ", responseData);
    if (responseData.sent_status) {
      await updateLastInteractionInFirebase(chat_id);
    }

    setNewMessage("");
    setLoading(false);

    // ------------
  } catch (error) {
    setNewMessage("");
    setLoading(false);
    console.error("Error saving the message:", error);
    return false;
  }
}
export async function updateMessageInFirebase(
  chat_id,
  messageKey,
  updatedMessage,
  lastmessage
) {
  try {
    console.log("updating message in Firebase DB");

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const updates = {};
    const messageData = {
      ...updatedMessage,
      status: "sent",
      message_type: lastmessage?.message_type,
      reply_to:
        lastmessage?.message_type == "SMS"
          ? lastmessage?.reply_to
          : lastmessage?.message_id,
      read: true, // New messages are marked as unread by default
    };
    // updates[`chats/${chat_id}/messages/${messageKey}`] = messageData;

    // update(ref(db), updates).then(
    //   async () => {
    //     console.log(" saved the message  successfully");

    //     const response = await fetch(`/api/send_response`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ data: messageData, chat_id, messageKey }),
    //     });

    //     const responseData = await response.json();
    //   },
    //   () => {
    //     console.log("coud not save the message ");
    //   }
    // );

    // console.log("Message updated successfully");

    //console.log(" saved the message  successfully");

    const response = await fetch(`/api/send_response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: messageData, chat_id, messageKey }),
    });

    const responseData = await response.json();
    console.log("responseData is ", responseData);
    if (responseData.sent_status) {
      await updateLastInteractionInFirebase(chat_id);
    }
    return true;
  } catch (error) {
    console.error("Error updating the message:", error);
    return false;
  }
}

export function getLastClientMessage(messages, message_id = null) {
  console.log("messages are ", messages);
  let clientMessages = [];
  if (message_id) {
    // Filter client messages sent before the provided message_id
    clientMessages = messages
      .filter((message) => message.sender_type === "client")
      .filter(
        (message) =>
          new Date(message.createAt) <
          new Date(messages.find((m) => m.message_id === message_id).createAt)
      );
  } else {
    clientMessages = messages.filter(
      (message) => message.sender_type === "client"
    );
  }

  if (clientMessages.length === 0) {
    return null; // No client messages found
  }

  // Find the last client message using reduce
  const lastClientMessage = clientMessages.reduce((prev, current) => {
    return new Date(current.createAt) > new Date(prev.createAt)
      ? current
      : prev;
  });
  console.log("last client message is ", lastClientMessage);
  return lastClientMessage ? lastClientMessage : null;
}

export function deleteMessageInFirebase(chat_id, messageKey) {
  try {
    const messageRef = ref(db, `chats/${chat_id}/messages/${messageKey}`);

    // Use the remove function to delete the message
    remove(messageRef);

    console.log("Message deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting the message:", error);
    return false;
  }
}

export async function markMessageAsRead(chat_id, message_id, message) {
  try {
    console.log("marking message as read in Firebase DB");

    const messageData = {
      ...message,
      read: true,
    };

    const updates = {};
    updates[`chats/${chat_id}/messages/${message_id}`] = messageData;

    update(ref(db), updates).then(
      async () => {
        console.log(" marked as read  successfully");
      },
      () => {
        console.log("coud not mark the message as read ");
      }
    );
  } catch (error) {
    console.error("Error maring the message as read: ", error);
  }
}

export async function handleDeleteChat(chat_id, setChatTobeDeleted) {
  const chatRef = ref(db, `chats/${chat_id}`);
  const reservationsRef = ref(db, `reservations/${chat_id}`);

  try {
    // Use the remove function to delete the message
    await Promise.all([remove(chatRef), remove(reservationsRef)]);

    console.log("Chat and reservations deleted successfully");
    setChatTobeDeleted(null);
  } catch (error) {
    console.error("Error deleting the chat and reservations:", error);
    setChatTobeDeleted(null);
  }
}
