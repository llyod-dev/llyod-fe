import Image from "next/image";
import darkstar from "public/icon/darkstar.png";
import brightstar from "public/icon/brightstar.png";
import { useEffect, useState } from "react";
import { onValue, ref, get, set } from "firebase/database";
import { db } from "@/config";
import { MdDeleteOutline } from "react-icons/md";
import { handleDeleteChat } from "@/lib/message";

const Chat = ({
  setSelectedChat,
  selectedChat,
  reservations,
  // sortReservations,
  selectedPlatform,
  setChatTobeDeleted,
}) => {
  const [isChecked, setIsChecked] = useState(null);
  const [search, setSearch] = useState("");

  function toggeleAutoResponse(enabled) {
    const autoReplyRef = ref(db, "autoReply");
    set(autoReplyRef, { enabled: enabled });
  }

  useEffect(() => {
    const autoReplyRef = ref(db, "autoReply");
    const autoReplyListener = onValue(autoReplyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        //console.log("auto response is ", data);
        setIsChecked(data?.enabled);
      }
    });
    return () => {
      autoReplyListener();
    };
  }, []);

  const filteredReservations = reservations.filter(
    (item) =>
      // Check if the first name includes the search string (case-insensitive)
      (item?.reservation_detail?.first_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        // OR
        // Check if the address includes the search string (case-insensitive)
        item?.property_detail?.address
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      // Check if the selected platform matches the travelagent_name or if no platform is selected
      (selectedPlatform === null ||
        item?.reservation_detail?.hear_about_name === selectedPlatform)
  );

  // const filteredReservations = filteredReservations.sort(sortReservations);

  //console.log("reservations: ", reservations);

  return (
    <div className="flex flex-col border-r-2 border-slate-300 h-[520px] overflow-hidden w-full px-2 pb-6">
      <div className="w-full h-16 bg-white flex items-center justify-between space-x-4 p-4 overflow-hidden my-2 ">
        {/* toggle bot response */}
        <div className="text-gray-900 text-sm font-medium font-['Roboto Slab'] leading-7">
          Auto reply
        </div>
        <label className="flex items-center cursor-pointer">
          {/* Hidden checkbox input */}
          <input
            type="checkbox"
            className="hidden"
            checked={isChecked}
            onChange={() => toggeleAutoResponse(!isChecked)}
          />

          {/* Slider with rounded styling */}
          <div
            className={`relative w-12 h-5  rounded-full transition duration-300 ease-in-out ${
              isChecked ? "bg-yellow-400" : "bg-gray-400"
            }`}
          >
            {/* Slider handle */}
            <div
              className={`absolute left-1 top-1 h-3 w-3 bg-white rounded-full transition duration-300 transform ${
                isChecked ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
      <div className="w-full h-16 bg-white flex items-center space-x-4 px-4 overflow-hidden">
        <div className="flex items-center space-x-2">
          <div className="text-gray-900 text-xl font-medium font-['Roboto Slab'] leading-7">
            Chats
          </div>
          {filteredReservations?.filter(
            (i) => i.unreadCount && i.unreadCount > 0
          )?.length > 0 && (
            <div className="px-2 py-1   bg-red-100 rounded-2xl justify-center overflow-hidden flex items-center ">
              <div className="text-red-500 text-xs font-medium font-['Inter'] leading-none overflow-hidden">
                {
                  filteredReservations?.filter(
                    (i) => i.unreadCount && i.unreadCount > 0
                  ).length
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* search chat */}
      <div className="w-full h-12 px-3.5 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-center gap-2 inline-flex mb-2 overflow-hidden">
        {/* <div className="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
          <div className="w-5 h-5 relative" />
          <div className="text-gray-500 text-base font-normal font-['Lato'] leading-normal">
            Search
          </div>
        </div> */}

        <input
          placeholder="Search by name, property"
          className="w-full h-full text-gray-500 text-base font-normal font-['Lato'] leading-normal outline-none focus-none border-transparent focus:border-transparent focus:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* chat list */}

      <div className="w-full h-[60vh]">
        {reservations?.length === 0 ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-gray-200 animate-spin  fill-[#FF914D]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        ) : (
          filteredReservations?.map((item, index) => {
            return (
              <div
                key={item?.chat_id}
                className={`w-full  min-h-20 border-b border-gray-200 flex-col justify-center items-start gap-4 inline-flex px-0  ${
                  selectedChat?.chat_id == item?.chat_id ? "bg-red-50" : ""
                }`}
              >
                <div className="self-stretch justify-start items-start gap-4 inline-flex">
                  <div className="grow  basis-0 h-16 justify-start items-center gap-3 flex">
                    <div className="justify-between items-center  flex  w-full h-16">
                      <div
                        className="justify-start items-center gap-3 flex h-full"
                        onClick={() => {
                          setSelectedChat(item);
                        }}
                      >
                        <div className="w-10 h-10 bg-stone-300 rounded-3xl" />
                        <div className="flex-col justify-start items-start inline-flex">
                          <div className="flex w-36 justify-between">
                            <div className="text-neutral-900 text-base font-semibold font-['Roboto Slab'] leading-tight h-6">
                              {`${item?.reservation_detail?.first_name}  `}
                            </div>
                            {item?.unreadCount ? (
                              <div className="w-6 h-6 bg-red-100 rounded-full p-2 flex items-center justify-center overflow-hidden text-red-500 text-xs font-medium font-['Inter']">
                                {item.unreadCount}
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="text-slate-600 text-sm font-normal font-['Lato'] leading-tight">
                            {item?.property_detail?.name
                              ? item?.property_detail?.name
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="py-2 flex flex-col items-center ">
                        <Image
                          src={index % 2 === 0 ? darkstar : brightstar}
                          alt="star"
                        />
                        <MdDeleteOutline
                          className="text-red-500 mt-2  font-bold text-[20px]"
                          onClick={() => setChatTobeDeleted(item?.chat_id)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="justify-end items-center gap-4 flex" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chat;
