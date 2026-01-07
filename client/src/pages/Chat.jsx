import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import socket from '../socket';
import ChatBox from '../components/ChatBox';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [text, setText] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Load all users
    const loadUsers = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter((u) => u._id !== user._id);
      setUsers(filtered);
    };

    loadUsers();
  }, [user]);

  // Load chat for selected user
  useEffect(() => {
    if (!selectedUser) return;
    const loadMessages = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/${user._id}/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChats((prev) => ({ ...prev, [selectedUser._id]: res.data }));
    };

    loadMessages();
  }, [selectedUser]);

  // Socket setup
  useEffect(() => {
    if (!user?._id) return;

    socket.connect();
    socket.emit('join', user._id);

    const handleNewMessage = (msg) => {
      const chatWith = msg.senderId === user._id ? msg.receiverId : msg.senderId;
      setChats((prev) => {
        const existing = prev[chatWith] || [];
        return {
          ...prev,
          [chatWith]: [...existing, msg],
        };
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.disconnect();
    };
  }, [user]);

  const handleSend = async () => {
    if (!text.trim() || !selectedUser) return;

    const msg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: text,
    };

    socket.emit('sendMessage', msg);

    await axios.post(`${import.meta.env.VITE_API_URL}/messages`, msg, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setChats((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), msg],
    }));

    setText('');
  };

  const currentMessages = selectedUser ? chats[selectedUser._id] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-[90vh]">
      {/* Sidebar */}
      <div className="col-span-1 border-r overflow-y-auto p-4 bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Available Users</h2>
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`p-2 rounded cursor-pointer hover:bg-blue-100 ${
              selectedUser?._id === u._id ? 'bg-blue-200' : ''
            }`}
          >
            <div className="font-medium">{u.name}</div>
            <div className="text-sm text-gray-500">{u.email}</div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="col-span-3 p-6 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-2">Chat with {selectedUser.name}</h2>
            <div className="flex-1 overflow-y-auto mb-4">
              <ChatBox messages={currentMessages} />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="border rounded p-2 flex-1"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500">Select a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
