import { markMessageAsRead } from "@/lib/message";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

function ReceivedMessage({
  content,
  message,
  sender,
  message_node_id,
  chat_id,
}) {
  const [ref, inView] = useInView({
    //triggerOnce: true, // Only trigger once when element comes into view
  });
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (inView && !message?.read) {
      // Message is in view, start the timer
      timeoutRef.current = setTimeout(() => {
        markMessageAsRead(chat_id, message_node_id, message);
      }, 300);
    } else {
      // Message is out of view, clear the timer
      clearTimeout(timeoutRef.current);
    }

    return () => {
      // Clean up the timer on component unmount or if the message goes out of view
      clearTimeout(timeoutRef.current);
    };
  }, [inView]);

  return (
    <div className="flex justify-start items-center  mx-12 mb-2 " ref={ref}>
      <div className="w-9 h-9 relative">
        <div className="w-9 h-9 left-0 top-0 absolute bg-stone-300 rounded-full" />
      </div>

      <div
        className={`
        max-w-[70%] min-h-14 px-8 py-4 bg-zinc-100 rounded-3xl
        flex-col justify-start items-center gap-2 inline-flex mx-4
        ${
          !message?.read &&
          "border-2 border-red-500 ring ring-red-100 ring-opacity-10 ring-offset-0 animate-pulse"
        }
      `}
      >
        <div className="text-neutral-950 text-base font-normal font-['Lato'] leading-snug">
          {content}
        </div>
      </div>
    </div>
  );
}

export default ReceivedMessage;
