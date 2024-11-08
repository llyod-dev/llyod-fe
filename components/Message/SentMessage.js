import {
  deleteMessageInFirebase,
  getLastClientMessage,
  updateMessageInFirebase,
} from "@/lib/message";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

function SentMessage({
  content,
  sender,
  status,
  message_id,
  message,
  setIsEditing,
  IsEditing,
  chat_id,
  selectedChatMessages,
  message_node_id,
  newMessage,
  setNewMessage,
  setSelectedMessage,
}) {
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewContent(content);
  }, [content]);

  function editMessage(value) {
    setNewContent(value);
    !IsEditing && setIsEditing(message_node_id);
  }

  const focusInput = () => {
    if (status != "sent") {
      setIsEditing(message_node_id);
      setNewMessage(content);
      setSelectedMessage(message);
    }
  };

  return (
    <>
      <div className="flex justify-end items-center  mx-12 mb-2 ">
        {/* {status != "sent" && IsEditing == message_id ? (
          <div className=" p-4 w-[50%]">
            <input
              value={newContent}
              className="w-full min-h-14 h-fit px-8 py-4 bg-red-500 rounded-3xl text-white text-base font-normal font-['Lato'] leading-snug ml-4 border-none  outline-none"
              onChange={(e) => editMessage(e.target.value)}
            />
          </div>
        ) : ( */}
        <div
          className="max-w-[70%] min-h-14 px-8 py-4 bg-red-500 rounded-3xl flex-col justify-start items-center gap-2 inline-flex mx-4"
          onClick={focusInput}
          style={{ zIndex: message_node_id == IsEditing ? 1000 : 0 }}
        >
          <div className=" w-full text-white text-base font-normal font-['Lato'] leading-snug">
            {content}
          </div>
        </div>
        {/* )}{" "} */}
        {status != "sent" && (
          <div className="flex flex-col justify-center mr-4">
            <div className="text-yellow-600"> not sent !</div>
            <button
              onClick={async () => {
                if (loading) {
                  return;
                }
                setLoading(true);
                await updateMessageInFirebase(
                  chat_id,
                  message_node_id,
                  {
                    ...message,
                    sender_type: "VA",
                    message: newContent,
                    status: "sent",
                  },
                  getLastClientMessage(selectedChatMessages?.messages)
                );
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="20"
                  width="15"
                  color="#4299e1"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass="w-full flex justify-center"
                />
              ) : (
                "send"
              )}
            </button>
            <button
              onClick={() => {
                deleteMessageInFirebase(chat_id, message_node_id);
              }}
            >
              Delete
            </button>
          </div>
        )}
        <div className="w-9 h-9 relative">
          <div className="w-9 h-9 left-0 top-0 absolute bg-stone-300 rounded-full" />
        </div>
      </div>
      {IsEditing == message_node_id && (
        <div
          className="absolute top-0 left-0 w-screen h-screen z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
    </>
  );
}

export default SentMessage;
