import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatBox = () => {
  const scrollEnd = useRef();

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        if (scrollEnd.current && messages) {
          scrollEnd.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedUser, messages]);

  return selectedUser ? (
    <div className="h-full flex flex-col overflow-y-scroll">
      <section className="flex-1 h-full overflow-y-scroll backdrop-blur-lg">
        {/* --- HEADER --- */}
        <div className="flex items-center gap-3 py-3 mx-4 border-b border-b-stone-500">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt="user image"
            className="rounded-full w-8"
          />
          <p className="flex items-center gap-2 text-lg text-white flex-1">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
          </p>
          <img
            src={assets.arrow_icon}
            alt=""
            className="md:hidden max-w-7"
            onClick={() => setSelectedUser(null)}
          />
          <img
            src={assets.help_icon}
            alt=""
            className="max-w-5 max-md:hidden"
          />
        </div>
        {/* --- CHAT --- */}
        <div className="flex flex-col h-[calc(100% - 120px)] overflow-y-scroll p-3 pb-6 ">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 justify-end ${
                message.senderId !== authUser._id && "flex-row-reverse"
              }`}
            >
              {message.image ? (
                <img
                  src={message.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-words bg-violet-500/50 text-white ${
                    message.senderId === authUser._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {message.text}
                </p>
              )}
              <div className="text-center text-sm">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="rounded-full w-7"
                />
                <p className="text-gray-500">
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollEnd}></div>
        </div>
        {/* Search Area */}
      </section>
      <div className=" flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm border-none outline-none placeholder-gray-200 rounded-lg text-white p-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="cursor-pointer w-5 mr-2"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatBox;
