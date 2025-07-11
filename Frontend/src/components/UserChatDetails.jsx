import React from "react";
import assets, { imagesDummyData } from "../assets/assets";

const UserChatDetails = ({ selectedUser, setSelectedUser }) => {
  return (
    selectedUser && (
      <div
        className={`text-white w-full bg-[#818582]/10 relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 asepect-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            <p className="bg-green-500 w-2 h-2 rounded-full"></p>
            {selectedUser.fullName}
          </h1>
          <p className="mx-auto px-10 font-light">{selectedUser.bio}</p>
        </div>
        <hr className="my-4 border-[#ffffff50]" />
        <div className="px-5 text-xs">
          <p className="text-sm font-medium">Media</p>
          <div className="mt-2 max-h-[290px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {imagesDummyData.map((img, i) => (
              <div
                key={i}
                onClick={() => window.open(img)}
                className="cursor-poiner rounded"
              >
                <img src={img} alt="" className="rounded-md h-full" />
              </div>
            ))}
          </div>
        </div>
        <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm px-20 py-2 rounded-full cursor-pointer font-medium ">
          Logout
        </button>
      </div>
    )
  );
};

export default UserChatDetails;
