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
  const [error, setError] = useState<string>('');
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
        setError('Failed to fetch messages.');
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
        console.log("User status update received:", data);
        setOnlineStatus(data.onlineUsers)

      }
    }
    )
    appSocket.on("userDisconnected", (data: { onlineUsers: []}) => {

      console.log("User status update received on disconnect:", data);
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
console.log('onlineStatus', onlineStatus)
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
      setError('Please select a user and enter a message.');
      return;
    }

    setError('');
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
        setError(err.response?.data.error || 'Send failed');
      } else {
        console.error(err);
        setError('Send failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  h-screen">
      {showAddUser && <AddUserComponent setShowAddUser={setShowAddUser} />}

      <aside className={`${selectedUser ? "sm:block hidden" : ""}  sm:w-fit w-screen h-screen sm:relative  absolute bg-gray-200 p-4 sm:overflow-y-auto overflow-y-hidden `}>
        <button
          onClick={() => {
            setError('');
            setMessageText('');
            setShowAddUser(true);
          }}
          className="bg-green-600 hover:bg-green-500 cursor-pointer w-full p-2"
        >
          Add user
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Conversations</h2>
        {participants.length === 0 ? (
          <p className="text-gray-600">No conversations yet.</p>
        ) : (
          <ul aria-disabled className='select-none'>
            {participants.map((name) => (
              <li
                key={name}
                className={`p-2 cursor-pointer flex flex-col hover:bg-blue-600 rounded ${selectedUser === name ? 'bg-blue-500 text-white' : 'text-black'}`}
                onClick={() => {
                  setError('');
                  setMessageText('');
                  router.push(`/api/chat?user=${name}`);
                }}
              >
                <div className='flex items-center gap-2'>
                  <span>{name}</span>
                  {
                    (onlineStatus as string[] | undefined)?.includes(name)
                      ?
                      <span className="text-xs text-green-600 ml-1">online</span>

                      : <span className="text-xs text-gray-500 ml-1">offline</span>
                  }

                </div>
                {typing && selectedUser === name && (

                  <span className="text-xs animate-bounce    text-white">
                    {typing}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="flex-1  p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2 flex flex-col gap-2 ">
          <div className='flex gap-2 items-center bg-blue-600  h-10 rounded-t-md p-2 text-white'>
            <span>
              {selectedUser ? `Chat with ${selectedUser}` : 'Select a user to chat'}
            </span>
            <span className='text-xs text-gray-500 ml-1'>
              {(onlineStatus as string[] | undefined)?.includes(selectedUser) ?
                <Image className='rounded-full' src="/active.png" width={20} height={20} alt="active" />
                : "offline"}
            </span>
          </div>
          {typing && selectedUser && (

            <span className="sm:hidden text-xs animate-bounce relative  text-white">
              {typing}

            </span>
          )}
        </h2>
        {selectedUser && <div className='sm:hidden w-full rounded-t-md h-9 p-4 flex justify-start items-center bg-blue-600 '>
          <Image
            onClick={() => router.push('/api/chat')}
            src="/arrow.png" width={25} height={25} className='cursor-pointer' alt="arrow" />
        </div>}
        {selectedUser && (
          <div className="flex-1 border bg-white rounded-b-md p-4 overflow-x-auto overflow-y-auto">

            {conversations[selectedUser]?.map((msg, idx) => (
              <React.Fragment key={idx}>

                <div className={`flex justify-center gap-1   ${msg.sender.username === user?.username ? 'justify-end ' : 'justify-start '} mb-4`}>
                  {msg.sender.username === user?.username ?
                    <div className='flex justify-end '>
                      <Image
                        src={msg.sender.avatar || '/default-avatar.png'}
                        alt={`${msg.sender.username}' avatar`}
                        width={20}
                        height={20}
                        className="rounded-xl w-20  h-20 object-center mb-1"
                      />
                    </div>
                    :
                    <div className='flex justify-start '>
                      <Image
                        src={msg.receiver.avatar || '/default-avatar.png'}
                        alt={`${msg.receiver.username}' avatar`}
                        width={20}
                        height={20}
                        className="rounded-xl w-20 h-20 object-center mb-1"
                      />
                    </div>


                  }
                  <div className={`relative mb-2 p-2 flex flex-col text-white max-w-xl rounded-b-md ${msg.sender.username === user?.username ? 'bg-green-400 rounded-l-md' : 'bg-gray-400 rounded-r-md'}`}>

                    {
                      msg.deleteForEveryone ?
                        <span aria-disabled className='block max-w-md select-none break-words text-gray-300 whitespace-pre-wrap'>
                          {msg.deleteForEveryone && msg.sender._id !== user?._id ? "This message was deleted " : "You deleted this message"}
                        </span>
                        :
                        <span className='block max-w-md break-words whitespace-pre-wrap'>
                          {msg.content}
                        </span>
                    }

                    <div aria-disabled className='flex justify-between select-none items-center'>
                      <span className="text-xs  text-gray-200 ml-2">
                        {new Date(msg?.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-xs  text-gray-200 ml-2">
                          {new Date(msg?.createdAt || '').toLocaleDateString()}
                        </span>
                      </span>
                    </div>

                    <div className="relative ">
                      <Image
                        key={msg._id}
                        onClick={() => setShowMore((prev) => (prev === idx ? null : idx))}
                        title="More"
                        src="/more.png"
                        alt="more"
                        width={20}
                        height={20}
                        className="absolute top-1 right-1 cursor-pointer hover:opacity-70"
                      />
                    </div>


                  </div>

                </div>


                <div className={`absolute ${msg.sender.username === user?.username ? 'right-15 top-58' : 'left-49 top-40'} `}>

                  {showMore === idx && (
                    <div className='mt-1 '>

                      <MoreComponent currentUserName={user?.username ?? null} message={msg} fetchMessages={fetchMessages} />
                    </div>
                  )}
                </div>
              </React.Fragment >
            ))}

          </div>
        )}

        {selectedUser && (
          <div className="mt-4 flex">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 border rounded p-2 mr-2"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => {
                if (selectedUser && user?.username) {
                  const roomId = [user?.username, selectedUser].sort().join('_');
                  emitTypingEvent(roomId, user?.username, selectedUser);

                }
                setMessageText(e.target.value);
                listenForTyping({ user }, setTyping);

                setError('');
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}

              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-400 rounded px-4 py-2"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </div>
  );
};

export default Auth(ChatApp);
