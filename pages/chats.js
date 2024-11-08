import Chat from "@/components/Chat/Chat";
import Message from "@/components/Message/Message";
import Sidebar from "@/components/Sidebar/Sidebar";
import withAuthProtection from "@/src/hoc/withAuthProtection";
import { useState, useEffect } from "react";

import { onValue, ref, get } from "firebase/database";
import { db } from "@/config";
import { handleDeleteChat, markMessageAsRead } from "@/lib/message";
import { ThreeDots } from "react-loader-spinner";

const Chats = ({ allReservations, allChats }) => {
  const [selectedChat, setSelectedChat] = useState("");

  const [reservations, setReservations] = useState(allReservations);
  const [sortedreservations, setSortedReservations] = useState([]);
  const [allmessages, setAllMessages] = useState(allChats);
  const [selectedChatMessages, setselectedChatMessages] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [chatTobeDeleted, setChatTobeDeleted] = useState(false);

  useEffect(() => {
    const reservationsRef = ref(db, "reservations");

    const reservationListener = onValue(reservationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const res = Object.keys(data).map((chat_id, ind) => {
          return {
            chat_id,
            property_detail: {
              name: data[chat_id]?.property_detail?.name || "",
              address: data[chat_id]?.property_detail?.address || "",
            },
            reservation_detail: {
              first_name: data[chat_id]?.reservation_detail?.first_name || "",
              hear_about_name:
                data[chat_id]?.reservation_detail?.hear_about_name || "",
              startdate: data[chat_id]?.reservation_detail?.startdate || "",
              enddate: data[chat_id]?.reservation_detail?.enddate || "",
            },
            reservation_title: data[chat_id]?.reservation_title || "",
            last_interaction: data[chat_id]?.last_interaction || "",
          };
        });
        setReservations(res);
      }
    });

    // Start listening for real-time chat updates
    const chatsRef = ref(db, "chats");
    const chatListener = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const allchats = Object.keys(data).map((chat_id) => {
          const messages = Object.keys(data[chat_id].messages).map(
            (message_node_id) => {
              return {
                message_node_id,
                ...data[chat_id].messages[message_node_id],
              };
            }
          );
          return {
            chat_id,
            messages: messages,
            unreadCount: messages.filter((message) => !message.read).length,
          };
        });

        setAllMessages(allchats);
      }
    });

    return () => {
      reservationListener();
      chatListener();
    };
  }, []);
  //----rest of the code-----
  useEffect(() => {
    //console.log("selectedChat: ", selectedChat);
    if (selectedChat) {
      setselectedChatMessages(
        allmessages.filter((chat) => chat?.chat_id == selectedChat?.chat_id)[0]
      );
    }
  }, [selectedChat, allmessages]);

  // const hasUnreadMessages = (chatId) => {
  //   // console.log("chatId:", chatId);

  //   const chat = allmessages.find((chat) => chat?.chat_id === chatId);
  //   return chat?.messages.some((message) => !message.read);
  // };

  // Function to sort reservations based on unread messages
  // const sortReservations = (a, b) => {
  //   const aHasUnread = hasUnreadMessages(a?.chat_id);
  //   const bHasUnread = hasUnreadMessages(b?.chat_id);

  //   if (aHasUnread && !bHasUnread) {
  //     return -1; // a comes first
  //   } else if (!aHasUnread && bHasUnread) {
  //     return 1; // b comes first
  //   } else {
  //     // If both have unread or both don't have unread, maintain the existing order
  //     return 0;
  //   }
  // };

  useEffect(() => {
    // Create a Set to store unique travelagent_name values
    const uniqueTravelAgentNames = new Set();

    // Iterate through the reservations array and add travelagent_name to the Set
    reservations?.forEach((item, index) => {
      const travelAgentName = item?.reservation_detail?.hear_about_name;

      if (travelAgentName !== undefined) {
        uniqueTravelAgentNames.add(travelAgentName);
      }
    });

    // Convert the Set to an array if needed
    const uniqueNamesArray = Array.from(uniqueTravelAgentNames);

    setPlatforms(uniqueNamesArray);
    // console.log("Unique Travel Agent Names: ", uniqueNamesArray);
  }, [reservations]);

  useEffect(() => {
    if (allmessages.length > 0 && reservations.length > 0) {
      //console.log("all chats", allmessages);

      const withUnreadCount = reservations.map((res) => {
        const thisChat = allmessages.find((i) => i.chat_id == res.chat_id);
        return {
          ...res,
          unreadCount: thisChat?.unreadCount ? thisChat.unreadCount : 0,
        };
      });
      setSortedReservations(
        withUnreadCount
          //.sort((a, b) => b?.unreadCount - a?.unreadCount)
          .sort((c, d) =>
            d?.last_interaction?.localeCompare(c?.last_interaction)
          )
      );
      //console.log("all reservations withUnreadCount", withUnreadCount);
    }
    //setReservations()
  }, [allmessages, reservations]);

  function DeleteModal() {
    const [showLoader, setShowLoader] = useState(false);
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if the click is outside the modal content
        if (event.target.classList.contains("bg-gray-600")) {
          setChatTobeDeleted(null);
        }
      };

      // Attach the event listener when the component mounts
      document.addEventListener("click", handleClickOutside);

      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [setChatTobeDeleted]);
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[20]">
        <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Delete this Chat?
            </h3>
            <div className="mt-2 px-7 py-3"></div>
            <div className="flex justify-around mt-4 w-full">
              {/* Using useRouter to dismiss modal*/}

              <button
                disabled={showLoader}
                onClick={async () => {
                  // setShowLoader(true);
                  // await handleDeleteChat(chatTobeDeleted, setChatTobeDeleted);
                }}
                className={`px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm ${
                  !showLoader &&
                  "hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                }`}
              >
                {showLoader ? (
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
                  "Yes"
                )}
              </button>

              <button
                onClick={() => setChatTobeDeleted(null)}
                className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="w-[20%] ">
        <Sidebar
          platforms={platforms}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
        />
      </div>

      <div className="px-3 h-full w-[80%]">
        <div className="h-fit py-12">
          <div className="h-12">
            <span className="text-gray-900 text-3xl font-semibold font-['Plus Jakarta Sans'] leading-9">
              Welcome back,{" "}
            </span>
            <span className="text-gray-900 text-3xl font-bold font-['Plus Jakarta Sans'] leading-9">
              chattybot.ai
            </span>
          </div>
          <div className="text-gray-500 text-base font-normal font-['Plus Jakarta Sans'] leading-normal">{`Let’s give you the answers you are looking for`}</div>
        </div>

        <div className="w-full flex flex-row grow">
          <div className="w-[25%]">
            <Chat
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              reservations={sortedreservations}
              // sortReservations={sortReservations}
              selectedPlatform={selectedPlatform}
              setChatTobeDeleted={setChatTobeDeleted}
            />
          </div>

          <div className=" w-[75%]">
            {selectedChat && (
              <Message
                selectedChat={selectedChat}
                selectedChatMessages={selectedChatMessages}
                key={selectedChat?.chat_id}
              />
            )}
          </div>
        </div>
      </div>
      {chatTobeDeleted && <DeleteModal />}
    </div>
  );
};

export default withAuthProtection(Chats);

export async function getServerSideProps() {
  try {
    // Fetch reservations data
    const reservationsRef = ref(db, "reservations");
    const reservationsSnapshot = await get(reservationsRef);

    let allReservations = [];
    if (reservationsSnapshot.exists()) {
      const data = reservationsSnapshot.val();
      allReservations = Object.keys(data).map((chat_id, ind) => ({
        chat_id,

        property_detail: {
          name: data[chat_id]?.property_detail?.name || "",
          address: data[chat_id]?.property_detail?.address || "",
        },
        reservation_detail: {
          first_name: data[chat_id]?.reservation_detail?.first_name || "",
          hear_about_name:
            data[chat_id]?.reservation_detail?.hear_about_name || "",
          startdate: data[chat_id]?.reservation_detail?.startdate || "",
          enddate: data[chat_id]?.reservation_detail?.enddate || "",
        },
        reservation_title: data[chat_id]?.reservation_title || "",
        last_interaction: data[chat_id]?.last_interaction || "",
      }));
    }

    // Fetch chats data
    const chatsRef = ref(db, "chats");
    const chatsSnapshot = await get(chatsRef);

    let allChats = [];
    if (chatsSnapshot.exists()) {
      const data = chatsSnapshot.val();
      allChats = Object.keys(data).map((chat_id) => {
        const messages = Object.keys(data[chat_id].messages).map(
          (message_node_id) => {
            return {
              message_node_id,
              ...data[chat_id].messages[message_node_id],
            };
          }
        );
        return {
          chat_id,
          messages,
          unreadCount: messages.filter((message) => !message.read).length,
        };
      });
    }

    return {
      props: {
        allReservations: allReservations.sort(
          (a, b) => b?.last_interaction - a?.last_interaction
        ),
        allChats,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        allReservations: [],
        allChats: [],
      },
    };
  }
}
