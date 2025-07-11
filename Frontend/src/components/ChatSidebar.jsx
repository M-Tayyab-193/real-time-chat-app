import React from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { userDummyData } from "../assets/assets";

const ChatSidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`h-full bg-[#818582]/10 p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 w-32 p-5 rounded-md hidden group-hover:block z-20 text-gray-100 border border-gray-600 bg-[#282142]">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="border-t border-t-gray-500 my-2 " />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="rounded-full bg-[#282142] flex items-center gap-2 px-4 py-3 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="border-none outline-none text-white text-xs bg-transparent placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>
      <div className="flex flex-col">
        {userDummyData.map((user, i) => (
          <div
            key={i}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded-md cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="user"
              className="rounded-full w-[35px] aspect-[1/1]"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {i < 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {i > 2 && (
              <p className="absolute top-4 right-4 h-5 w-5 text-xs flex justify-center items-center rounded-full bg-violet-500/50">
                {i}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
