'use client';

import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Auth from '../utils/auth';
import { User } from '../interfaces/user.interface';
import { useRouter, useSearchParams } from 'next/navigation';
import AddUserComponent from './AddUser.component';
import Image from 'next/image';
import MoreComponent from './More.component';
import { Message } from '../interfaces/message.interface';
import { subscribeToMessages, sendMessage, initiateSocket, listenForTyping, emitTypingEvent, appSocket } from '../utils/socket';






const ChatApp: React.FC<User> = ({ user }) => {


  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [typing, setTyping] = useState<string | null>(null);
  const [showMore, setShowMore] = useState<number | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const selectedUser = searchParams.get('user') || '';
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();


  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/fetch-all-message`, { withCredentials: true });
      const data: Message[] = res.data.data;

      const grouped: Record<string, Message[]> = {};
      const usersSet = new Set<string>();

      data.forEach((msg) => {
        const other = msg.sender.username === user?.username
          ? msg.receiver.username
          : msg.sender.username;

        if (!grouped[other]) grouped[other] = [];
        grouped[other].push(msg);
        usersSet.add(other);
      });

      setConversations(grouped);
      setParticipants(Array.from(usersSet));



    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data.error === 'Invalid token') {
        alert('Session expired, please login again');
        router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`);
      } else {
        console.error(err);
        alert('Failed to fetch messages.');
      }
    }
  };




  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => setTyping(null), 3000);
      return () => clearTimeout(timer);
    }

  }, [typing]);

  useEffect(() => {
    initiateSocket(API.replace(/\/api\/?$/, ''));
    appSocket.on("userStatus", (data: { onlineUsers: [] }) => {
      if (data.onlineUsers) {
        setOnlineStatus(data.onlineUsers)

      }
    }
    )
    appSocket.on("userDisconnected", (data: { onlineUsers: []}) => {

      setOnlineStatus(data.onlineUsers)



    });

  }, []);

  useEffect(() => {
    subscribeToMessages((msg: Message) => {
      const other = msg.sender.username === user?.username
        ? msg.receiver.username
        : msg.sender.username;

      setConversations((prev) => ({
        ...prev,
        [other]: [...(prev[other] || []), msg],
      }));


    });
  }, [])

  useEffect(() => {
    fetchMessages();

  }, [API, user?.username]);
  useEffect(() => {
    if (!appSocket) return;
    appSocket.emit("join", user?.username);
    const handler = ({ sender, receiver }: { sender: string, receiver: string }) => {
      console.log('updateParticipants sender', sender)
      console.log('updateParticipants receiver', receiver)
      const other = user?.username === sender ? receiver : sender;
      console.log('updateParticipants other', other)

      setParticipants((prev) =>
        prev.includes(other) ? prev : [...prev, other]
      );
    };

    appSocket.on('updateParticipants', handler);

  }, [appSocket, user?.username])

  const handleSend = async () => {
    if (!messageText.trim() || !selectedUser) {
      alert('Please select a user and enter a message.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/send-message`,
        { receiverUsername: selectedUser, message: messageText },
        { withCredentials: true }
      );

      sendMessage(res.data.data);

      setTyping(null);

      setMessageText('');
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data.error === 'Invalid token') {
        alert('Session expired, please login again');
        router.push('/api/login');
      } else if (err instanceof AxiosError) {
        if (err.response?.data.error === 'Unauthorized') {
          router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`)

        }
        alert(
          err.response?.data.error || 'Send failed'
        )
      } else {
        alert('Send failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex h-screen bg-gray-100">
  {showAddUser && <AddUserComponent setShowAddUser={setShowAddUser} />}

  {/* Sidebar */}
  <aside className={`${selectedUser ? 'sm:block hidden' : ''} sm:w-80 w-full h-full sm:relative absolute bg-white border-r p-4 overflow-y-auto`}>
    <button
      onClick={() => {
        setMessageText('');
        setShowAddUser(true);
      }}
      className="bg-green-600 hover:bg-green-500 text-white w-full py-2 cursor-pointer rounded mb-4"
    >
      &#43; Add User
    </button>

    <h2 className="text-lg font-semibold mb-3 text-gray-800">Conversations</h2>

    {participants.length === 0 ? (
      <p className="text-gray-500">No conversations yet.</p>
    ) : (
      <ul className="space-y-2 select-none">
        {participants.map((name) => (
          <li
            key={name}
            className={`p-2 rounded cursor-pointer transition-all ${selectedUser === name ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-800'}`}
            onClick={() => {
              setMessageText('');
              router.push(`/api/chat?user=${name}`);
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{name}</span>
              <span className={`text-xs ${onlineStatus?.includes(name) ? 'text-green-500' : 'text-gray-400'}`}>
                {onlineStatus?.includes(name) ? 'Online' : 'Offline'}
              </span>
            </div>
            {typing && selectedUser === name && (
              <span className="text-xs text-blue-300 animate-pulse">Typing...</span>
            )}
          </li>
        ))}
      </ul>
    )}
  </aside>

  {/* Main Chat */}
  <main className="flex-1 flex flex-col overflow-hidden">
    {/* Chat Header */}
    <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-lg font-medium">
          {selectedUser ? `Chat with ${selectedUser}` : 'Select a user to chat'}
        </span>
        {selectedUser && (
          <span className="text-sm">
            {onlineStatus?.includes(selectedUser) ? (
              <Image className='rounded-full' src="/active.png" width={20} height={20} alt="active" />
            ) : (
              'Offline'
            )}
          </span>
        )}
      </div>
      {selectedUser && (
        <button onClick={() => router.push('/api/chat')} className="sm:hidden cursor-pointer">
          <Image src="/arrow.png" width={25} height={25} alt="Back" />
        </button>
      )}
    </div>

    {/* Typing Indicator (Mobile Only) */}
    {typing && selectedUser && (
      <div className="sm:hidden px-4 py-2 bg-blue-100 text-blue-600 text-sm animate-pulse">
        {typing}
      </div>
    )}

    {/* Messages */}
    <div className=" h-133 mt-2  overflow-y-scroll space-y-4 bg-white">
      {selectedUser && conversations[selectedUser]?.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.sender.username === user?.username ? 'justify-end' : 'justify-start'}`}>
          <div className="flex gap-2 items-end max-w-[70%]">
            <Image
              src={msg.sender.username === user?.username ? (msg.sender.avatar || '/default-avatar.png') : (msg.receiver.avatar || '/default-avatar.png')}
              width={40}
              height={40}
              className="rounded-full"
              alt="Avatar"
            />
            <div className={`p-4 rounded-lg text-sm relative max-w-[85%]   break-words whitespace-pre-wrap ${msg.sender.username === user?.username ? 'bg-green-400 text-white rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'}`}>
              {msg.deleteForEveryone ? (
                <span className="italic text-gray-400">{msg.sender._id !== user?._id ? "This message was deleted" : "You deleted this message"}</span>
              ) : (
                <span
                className='block max-w-md break-words whitespace-pre-wrap'>{msg.content}</span>
              )}
              <div className="text-[10px] text-gray-400 mt-1">
                {new Date(msg.createdAt! ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | {new Date(msg.createdAt!).toLocaleDateString()}
              </div>
              <Image
                src="/more.png"
                width={18}
                height={18}
                className="absolute top-1 right-1 cursor-pointer hover:opacity-70"
                onClick={() => setShowMore((prev) => (prev === idx ? null : idx))}
                alt="More"
              />
            </div>
            {showMore === idx && (
              <div className="absolute mt-1 z-10">
                <MoreComponent currentUserName={user?.username ?? null} message={msg} fetchMessages={fetchMessages} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Input */}
    {selectedUser && (
      <>

      <div className="bg-white border-t p-4 flex items-center gap-2 fixed bottom-0 left-0 right-0">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={messageText}
          onChange={(e) => {
            const roomId = [user?.username, selectedUser].sort().join('_');
            emitTypingEvent(roomId, user?.username!, selectedUser);
            setMessageText(e.target.value);
            listenForTyping({ user }, setTyping);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer rounded"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>

      </div>
      </>
    )}

  </main>
</div>

  );
};

export default Auth(ChatApp);
