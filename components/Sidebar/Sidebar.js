import Image from "next/image";
import layers from "public/icon/layers.png";
import settings from "public/icon/settings.png";
import logout from "public/icon/log-out.png";
import { useContext, useEffect, useState } from "react";
import { unsetToken } from "@/lib/auth";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "@/config/Firebase";
import { useRouter } from "next/router";
import { AppContext } from "@/src/context/AppContext";

const Sidebar = ({ platforms, selectedPlatform, setSelectedPlatform }) => {
  const router = useRouter();
  const { state } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState(1);
  const [isOpenPlatforms, setIsOpenPlatforms] = useState(false);
  function selectTab(params) {
    setSelectedTab(params);
  }

  useEffect(() => {
    if (selectedTab != 2) {
      setSelectedPlatform(null);
    }
  }, [selectedTab]);
  return (
    <div className="flex flex-col justify-between border-r-2 border-slate-300 pb-10">
      <div className="flex flex-col">
        <div className="w-full py-12 pl-6 pr-5 flex-col justify-start items-start inline-flex">
          <div className="pr-7 py-1 justify-start items-center inline-flex">
            <div className="text-gray-900 text-2xl font-semibold font-['Inter'] leading-normal">
              chattybot.ai
            </div>
          </div>
        </div>
        <div
          className={`w-[279px] h-10 justify-start items-start inline-flex mb-6 px-3 py-2 ${
            selectedTab == 1 ? "bg-purple-50" : "bg-white"
          } cursor-pointer`}
          onClick={() => {
            selectTab(1);
          }}
        >
          <Image src={layers} alt="star" />
          <div className="grow shrink basis-0 self-stretch rounded-md justify-start items-center gap-[105px] flex">
            <div className="justify-start items-center gap-3 flex">
              <div className="w-6 h-6 relative" />
              <div className="text-slate-700 text-base font-medium font-['Inter'] leading-normal">
                All Chats
              </div>
            </div>
          </div>
        </div>

        <div
          className={`w-72 h-10 justify-between items-start inline-flex mb-6 px-3 py-2 ${
            selectedTab == 2 ? "bg-purple-50" : "bg-white"
          } rounded-md cursor-pointer`}
          onClick={() => {
            setIsOpenPlatforms(!isOpenPlatforms);
            selectTab(2);
          }}
        >
          <Image src={layers} alt="star" />
          <div className="grow shrink basis-0 self-stretch justify-start items-center gap-28 flex">
            <div className="justify-start items-center gap-3 flex">
              <div className="w-6 h-6 relative" />
              <div className="text-slate-700 text-base font-medium font-['Inter'] leading-normal">
                Platforms
              </div>
            </div>
          </div>

          {isOpenPlatforms ? (
            <FiChevronDown size={22} className="mr-[10px]" />
          ) : (
            <FiChevronRight size={22} className="mr-[10px]" />
          )}
        </div>

        <div>
          {platforms?.length > 0 &&
            isOpenPlatforms &&
            platforms?.map((platform, ind) => (
              <div
                className={`w-72 h-10 justify-start items-start inline-flex mb-1 px-3 py-2 ${
                  platform == selectedPlatform ? "bg-purple-50" : "bg-white"
                }
                 rounded-md cursor-pointer`}
                key={ind}
                onClick={() => {
                  setSelectedPlatform(platform);
                  // selectTab(null)
                }}
              >
                {/* <Image src={layers} alt="star" /> */}
                <div className="grow shrink basis-0 self-stretch justify-start items-center gap-28 flex">
                  <div className="justify-start items-center gap-3 flex">
                    <div className="w-6 h-6 relative" />
                    <div className="text-slate-700 text-base font-medium font-['Inter'] leading-normal">
                      {platform}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div
          className={`w-72 h-10 justify-start items-start inline-flex mb-6 px-3 py-2 ${
            selectedTab == 3 ? "bg-purple-50" : "bg-white"
          } rounded-md cursor-pointer`}
          onClick={() => {
            selectTab(3);
          }}
        >
          <Image src={layers} alt="star" />
          <div className="grow shrink basis-0 self-stretch justify-start items-center gap-28 flex">
            <div className="justify-start items-center gap-3 flex">
              <div className="w-6 h-6 relative" />
              <div className="text-slate-700 text-base font-medium font-['Inter'] leading-normal">
                Profiles
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* settings and logout */}
      <div className=" flex flex-col fixed bottom-[20px]">
        {/* <div className={`w-72 h-10 justify-start items-start inline-flex mb-6 px-3 py-2 ${selectedTab == 4 ? "bg-purple-50" : "bg-white"
          } rounded-md cursor-pointer`}
          onClick={() => {
            selectTab(4);
          }}>
          <Image src={settings} alt="star" />
          <div className="grow shrink basis-0 self-stretch justify-start items-center gap-28 flex">
            <div className="justify-start items-center gap-3 flex">
              <div className="w-6 h-6 relative" />
              <div className="text-slate-700 text-base font-medium font-['Inter'] leading-normal">
                Settings
              </div>
            </div>
          </div>
        </div> */}

        {/* logout  */}
        <div
          className={`w-72 h-10 px-2 justify-between items-start inline-flex ${
            selectedTab == 5 ? "bg-purple-50" : "bg-white"
          } rounded-md cursor-pointer`}
          onClick={() => {
            selectTab(5);
          }}
        >
          <div className="justify-start items-center gap-3 flex">
            <img
              className="w-10 h-10 rounded-full"
              src="https://via.placeholder.com/40x40"
            />
            <div className="flex-col justify-start items-start inline-flex mr-6">
              <div className="text-slate-700 text-sm font-medium font-['Inter'] leading-tight">
                {state?.user ? state?.user?.displayName : "Victoria"}
              </div>
              <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
                {state?.user ? state?.user?.email : "victoria@gmail.com"}
              </div>
            </div>
            <Image
              src={logout}
              alt="logout"
              onClick={async () => {
                signOut(auth)
                  .then(() => {
                    // Sign-out successful.
                    router.replace("/sign-in");
                  })
                  .catch((error) => {
                    console.error("Error logging out:", error.message);
                  });

                unsetToken();
              }}
            />
          </div>
          <div className="justify-center items-center flex">
            <div className="rounded-lg justify-start items-start inline-flex">
              <div className="p-2 rounded-lg justify-center items-center gap-2 flex">
                <div className="w-5 h-5 relative" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
