import moment from "moment/moment";
import { useEffect, useState, useRef } from "react";

import ReceivedMessage from "./ReceivedMessage";
import SentMessage from "./SentMessage";
import {
  getLastClientMessage,
  saveMessageinFirebase,
  updateMessageInFirebase,
} from "@/lib/message";
import { SlClose } from "react-icons/sl";
import { ThreeDots } from "react-loader-spinner";

const Message = ({ selectedChat, selectedChatMessages }) => {
  const [messageCount, setMessageCount] = useState(0);
  const [newMessage, setNewMessage] = useState(null);
  const [IsEditing, setIsEditing] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef();

  useEffect(() => {
    setNewMessage("");
    setIsEditing("");

    const lastMessage = chatContainerRef.current.lastElementChild;

    // Check if there is a last message before scrolling
    if (lastMessage && selectedChatMessages?.messages?.length > messageCount) {
      // Scroll to the last message with smooth behavior
      lastMessage.scrollIntoView({ behavior: "smooth" });
      setMessageCount(selectedChatMessages?.messages?.length);
    }
  }, [selectedChat, selectedChatMessages]);

  const updateMessageHandler = async () => {
    if (selectedMessage) {
      setLoading(true);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const res = await updateMessageInFirebase(
        selectedChat.chat_id,
        selectedMessage?.message_node_id,
        {
          ...selectedMessage,
          sender_type: "VA",
          message: newMessage,
          status: "sent",
          createAt: formattedDate,
        },
        getLastClientMessage(selectedChatMessages?.messages)
      );

      if (res) {
        setNewMessage("");
        setIsEditing("");
      }
    }
    setLoading(false);
  };

  const cancelHandler = () => {
    setNewMessage("");
    setIsEditing("");
    setSelectedMessage(null);
  };
  const formatDate = (inputDate) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(inputDate);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="  w-full">
      {" "}
      <div className="w-full h-22  pt-5 justify-center items-center gap-4 inline-flex border-b-2 border-slate-100 px-12 pb-2">
        <div className="grow  basis-0 h-14 justify-start items-start gap-4 flex w-full">
          <div className="w-14 h-14 bg-stone-300 rounded-full " />
          <div className="grow  basis-0 flex-col justify-start items-start inline-flex">
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <div className="text-gray-900 text-lg font-medium font-['Roboto Slab'] leading-7">
                {selectedChat?.reservation_detail?.first_name}
              </div>
            </div>
            <div className="self-stretch text-slate-600 text-sm font-normal font-['Lato'] leading-tight">
              @{selectedChat?.reservation_detail?.first_name}
            </div>
          </div>
          {selectedChat?.property_detail?.name ? (
            <div className="text-gray-900 text-lg font-medium font-['Roboto Slab'] leading-7">
              {selectedChat?.property_detail?.name} |{" "}
              {selectedChat.reservation_detail?.hear_about_name}
            </div>
          ) : (
            <div className="text-gray-900 text-lg font-medium font-['Roboto Slab'] leading-7">
              {selectedChat?.reservation_title}
              <br></br>
              <span className="self-stretch text-slate-600 text-sm font-normal font-['Roboto Slab'] leading-tight">
                {`${selectedChat.reservation_detail?.startdate}-${selectedChat.reservation_detail?.enddate}`}
              </span>
            </div>
          )}
        </div>
        <div className="flex-col justify-start items-start inline-flex">
          <div className="w-5 h-5 relative" />
        </div>
      </div>
      <div className="w-full h-[300px] overflow-y-auto " ref={chatContainerRef}>
        {selectedChatMessages?.messages
          ?.sort((a, b) => {
            // Compare dates for sorting (ascending order)
            return a?.createAt?.localeCompare(b?.createAt);
          })
          ?.map((message, index) => {
            //console.log("message is ", message);
            if (message?.sender_type == "client") {
              return (
                <div key={message?.message_id}>
                  <div className="w-full text-center text-zinc-900 text-base font-light font-['Plus Jakarta Sans'] leading-snug my-2">
                    {moment(message?.createAt).format("D MMM y , h:mm a")}
                  </div>
                  <ReceivedMessage
                    content={message?.message}
                    message={message}
                    key={message?.message_id}
                    message_node_id={message?.message_node_id}
                    chat_id={selectedChat.chat_id}
                  />
                </div>
              );
            } else {
              return (
                <div key={message?.message_id}>
                  <div className="w-full text-center text-zinc-900 text-base font-light font-['Plus Jakarta Sans'] leading-snug my-2 ">
                    {moment(message?.createAt).format("D MMM y , h:mm a")}
                  </div>
                  <SentMessage
                    content={message?.message}
                    message={message}
                    key={message?.message_id}
                    message_node_id={message?.message_node_id}
                    status={message?.status}
                    message_id={message?.message_id}
                    IsEditing={IsEditing}
                    setIsEditing={setIsEditing}
                    chat_id={selectedChat.chat_id}
                    selectedChatMessages={selectedChatMessages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    setSelectedMessage={setSelectedMessage}
                  />
                </div>
              );
            }
          })}
      </div>
      {/* message input box */}
      <div className="w-[800px] h-16 bg-white rounded-full border border-gray-200 flex justify-center items-center p-4 absolute bottom-10 z-[10] mx-2">
        {selectedMessage && IsEditing && (
          <SlClose
            size={26}
            onClick={cancelHandler}
            className="cursor-pointer	"
          />
        )}

        <input
          placeholder="Type your message"
          className="w-[90%] h-full outline-none focus-none border-transparent focus:border-transparent focus:ring-0"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />
        <button
          onClick={async () => {
            if (newMessage.trim().length == 0) {
              return;
            }

            setLoading(true);
            if (selectedMessage && IsEditing) {
              await updateMessageHandler();
            } else {
              saveMessageinFirebase(
                setNewMessage,
                newMessage,
                selectedChat.chat_id,
                getLastClientMessage(selectedChatMessages?.messages),
                setLoading
              );
            }
          }}
          disabled={loading}
        >
          {selectedMessage && IsEditing ? (
            loading ? (
              <ThreeDots
                visible={true}
                height="20"
                width="25"
                color="#4299e1"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "update"
            )
          ) : loading ? (
            <ThreeDots
              visible={true}
              height="20"
              width="25"
              color="#4299e1"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "send"
          )}
        </button>
      </div>
    </div>
  );
};

export default Message;
