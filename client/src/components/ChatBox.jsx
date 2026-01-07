import React from 'react';
import { useSelector } from 'react-redux';

const ChatBox = ({ messages }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-2 overflow-y-auto h-96 p-3 bg-white rounded shadow-inner flex flex-col">
      {messages.map((msg, index) => {
        const isSender = msg.senderId === user._id;
        return (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
              isSender
                ? 'bg-green-500 text-white self-end ml-auto'
                : 'bg-gray-300 text-gray-800 self-start mr-auto'
            }`}
          >
            {msg.content}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
