'use client';

import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Auth from '../utils/auth';
import { User } from '../interfaces/user.interface';
import { useRouter, useSearchParams } from 'next/navigation';
import AddUserComponent from './AddUser.component';
import io from 'socket.io-client';
import Image from 'next/image';
import { Socket } from 'socket.io-client';
// Define a type for individual chat messages
interface Message {
  _id?: string;
  sender: { username: string, avatar?: string };
  receiver: { username: string, avatar?: string };
  content: string;
  createdAt?: Date

}

let socket: typeof Socket = null!;



export const initiateSocket = (url: string) => {
  socket = io(url, {
    transports: ["websocket"],

  });

  socket.on("connect", () => {

    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (err: Error) => {
    console.error("❌ Socket connection error:", err);
  });
};

export const subscribeToMessages = (cb: (msg: Message) => void) => {
  if (!socket) return;
  // socket.off('backend-message'); // remove previous to prevent duplicates
  console.log('msg', cb)
  socket.on('backend-message', cb);
};

export const sendMessage = (message: Message) => {
  if (socket) socket.emit('message', message);
};

const ChatApp: React.FC<User> = ({ user }) => {
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [participants, setParticipants] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [typing, setTyping] = useState<string | null>(null);
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

  const userTyping = async () => {

    socket.on('userTyping', ({ sender, receiver }: { sender: string; receiver: string }) => {
      console.log("user typing")
      console.log("Typing event received:", sender, receiver || "No data");
      if (receiver === user?.username) {
        setTyping(`${sender}${' '}is typing...`);
      }
    })
  }
  useEffect(() => {
    if (socket) {

      userTyping()
    }

    if (typing) {
      const timer = setTimeout(() => setTyping(null), 3000);
      return () => clearTimeout(timer);
    }

  }, [typing, socket, user?.username]);

  useEffect(() => {
    initiateSocket(API.replace(/\/api\/?$/, ''));

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
    if (!socket) return;
    socket.emit("join", user?.username);
    const handler = ({ sender, receiver }: { sender: string, receiver: string }) => {
      console.log('updateParticipants sender', sender)
      console.log('updateParticipants receiver', receiver)
      const other = user?.username === sender ? receiver : sender;
      console.log('updateParticipants other', other)

      setParticipants((prev) =>
        prev.includes(other) ? prev : [...prev, other]
      );
    };

    socket.on('updateParticipants', handler);

  }, [socket, user?.username])

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
          <ul>
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
                <span>{name}</span>
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
          <span>
            {selectedUser ? `Chat with ${selectedUser}` : 'Select a conversation'}
          </span>
             {typing && selectedUser && (

                  <span className="sm:hidden text-xs animate-bounce    text-white">
                    {typing}


                  </span>
                )}
        </h2>
 {selectedUser&&<div className='sm:hidden w-full rounded-t-md h-9 p-4 flex justify-start items-center bg-blue-600 '>
<Image
onClick={()=>router.push('/api/chat')}
   src="/arrow.png" width={25} height={25} className='cursor-pointer' alt="arrow" />
            </div>}
        {selectedUser && (
          <div className="flex-1 border bg-white rounded-b-md p-4 overflow-x-auto overflow-y-auto">

            {conversations[selectedUser]?.map((msg, idx) => (
              <React.Fragment key={idx}>

                <div title='more' className={`flex justify-center gap-1 cursor-pointer  ${msg.sender.username === user?.username ? 'justify-end hover:bg-green-400 ' : 'justify-start hover:bg-gray-400'} mb-4`}>
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
                  <div
                    className={`mb-2 p-2 flex flex-col text-white max-w-xl   rounded-b-md  ${msg.sender.username === user?.username
                      ? ' bg-green-400 rounded-l-md'
                      : ' rounded-r-md bg-gray-400'
                      }`}
                  >
                    <span className='block max-w-md break-words whitespace-pre-wrap'>
                      {msg.content}
                    </span>
                    <div className='flex justify-between items-center'>
                      <span className="text-xs  text-gray-200 ml-2">
                        {new Date(msg?.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-xs  text-gray-200 ml-2">
                          {new Date(msg?.createdAt || '').toLocaleDateString()}
                        </span>
                      </span>
                    </div>

                  </div>
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
                if (socket && selectedUser) {
                  const roomId = [user?.username, selectedUser].sort().join('_'); // e.g., "alice_bob"
                  socket.emit("join", roomId);

                  socket.emit('typing', {
                    room: roomId,
                    sender: user?.username,
                    receiver: selectedUser,
                  });
                }
                setMessageText(e.target.value);
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
