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
import CameraCapture from './captureImage';






const ChatApp: React.FC<User> = ({ user }) => {


  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [typing, setTyping] = useState<string | null>(null);
  const [showMore, setShowMore] = useState<number | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<string[]>([]);
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [openCamera, setOpenCamera] = useState<boolean>(false);
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
    appSocket.on("userDisconnected", (data: { onlineUsers: [] }) => {

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
    const updateParticipants = ({ sender, receiver }: { sender: string, receiver: string }) => {
      console.log('updateParticipants sender', sender)
      console.log('updateParticipants receiver', receiver)
      const other = user?.username === sender ? receiver : sender;
      console.log('updateParticipants other', other)

      setParticipants((prev) =>
        prev.includes(other) ? prev : [...prev, other]
      );
    };

    appSocket.on('updateParticipants', updateParticipants);

  }, [appSocket, user?.username])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const img = formData.get('img') as File | null;
    const messageText = formData.get('message') as string;
    const cleanFormData = new FormData();
    const base64Data = imagePreview?.split(',')[1]; // Only the base64 part

    console.log('imagePreview', img)
    if (imagePreview && base64Data) {
      console.log('true imagePreview', imagePreview)
      cleanFormData.append('capturedImage', base64Data);
    }
    if (img && img.size > 0) {
      cleanFormData.append('img', img);
    }

    if (messageText?.trim()) {
      cleanFormData.append('message', messageText.trim());
    }
    if (selectedUser) {
      cleanFormData.append("receiverUsername", selectedUser);
    } else {
      alert('Please select a user.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/send-message`,
        cleanFormData,
        { withCredentials: true }
      );

      sendMessage(res.data.data);

      setTyping(null);

      setMessageText('');
      setImagePreview(null);
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
  }
  const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      console.log('previewUrl', previewUrl)
      setImagePreview(previewUrl);
    }

  }
  const handleOpenCamera = () => {
    setOpenCamera((prev) => !prev);
  };

  return (
    <div className={`flex h-screen bg-gray-50 `}>
      {showAddUser && <AddUserComponent setShowAddUser={setShowAddUser} />}

      {/* Sidebar */}
      <aside
        className={`${selectedUser ? 'sm:block hidden' : ''} sm:w-80 w-full h-full sm:relative absolute bg-white border-r border-gray-200 p-4 overflow-y-auto shadow-sm`}
      >
        <button
          onClick={() => {
            setMessageText('');
            setShowAddUser(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 cursor-pointer rounded-lg mb-6 transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Contact
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-700 px-1">Conversations</h2>

        {participants.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No conversations yet</p>
          </div>
        ) : (
          <ul className="space-y-1 select-none">
            {participants.map((name) => (
              <React.Fragment key={name}>
              <li
                key={name}
                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedUser === name ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}`}
                onClick={() => {
                  setMessageText('');
                  router.push(`/api/chat?user=${name}`);
                }}
                >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" >
                      <Image
                        src={conversations[name]?.[0]?.receiver.avatar || "/default-avatar.png"}
                        alt={`${name}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover"
                        width={40}
                        height={40}
                        />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${onlineStatus?.includes(name) ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 truncate">{name}</span>
                      <span className="text-xs text-gray-500">12:30 PM</span>
                    </div>
                    {typing && selectedUser === name ? (
                      <span className="text-xs text-indigo-500 relative animate-pulse">Typing...</span>
                    ) : (
                      <p className="text-xs text-gray-500 truncate">Last message preview...</p>
                    )}
                  </div>
                </div>
              </li>
                    </React.Fragment>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          {selectedUser ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" >
                  <Image
                    src={conversations[selectedUser]?.[0]?.receiver.avatar || "/default-avatar.png"}
                    alt={`${selectedUser}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <div
                 className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                  ${onlineStatus?.includes(selectedUser) ?
                   'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedUser}</h2>
                <p className="text-xs text-gray-500">
                  {onlineStatus?.includes(selectedUser) ? 'Online' : 'Offline'}
                </p>
                    {typing && selectedUser  ? (
                      <span className="text-xs text-indigo-500 relative animate-pulse">Typing...</span>
                    ) : (
                      <span className="text-xs text-gray-500 truncate">Last message preview...</span>
                    )}
              </div>
            </div>
          ) : (
            <h2 className="font-medium text-gray-700">Select a conversation</h2>
          )}
          {selectedUser && (
            <button
              onClick={() => {
                router.push('/api/chat')
                setMessageText('');
                setShowMore(null);
              }}
              className="sm:hidden flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
          {selectedUser && conversations[selectedUser]?.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender.username === user?.username ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-[75%] flex gap-2 ${msg.sender.username === user?.username ? 'flex-row-reverse' : ''}`}>
                {msg.sender.username !== user?.username && (

                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex-shrink-0" >
                    <Image
                      src={msg.sender.avatar || "/default-avatar.png"}
                      alt={`${msg.sender.username}'s avatar`}
                      className="w-8 h-8 rounded-full object-cover"
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <div className="relative">
                  <div className={`px-4 py-3 rounded-2xl text-sm ${msg.sender.username === user?.username ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                    {msg.deleteForEveryone ? (
                      <span className="italic text-gray-400">{msg.sender._id !== user?._id ? "This message was deleted" : "You deleted this message"}</span>
                    ) : (
                      <div>
                        {msg?.image && (
                          <div
                            onClick={() => {
                              setExpandImage((prev) => {
                                if (!prev) {
                                  setZoomImage(msg.image ? msg.image : null);
                                } else {
                                  setZoomImage(null);
                                }
                                return !prev;
                              });
                            }}

                            className="mb-2">

                            <div
                              className={`${expandImage && zoomImage === msg.image
                                ? "fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center"
                                : ""
                                }`}
                            >
                              <img
                                src={zoomImage || msg.image}
                                alt={msg.content || 'Message Image'}
                                className={`transition-all duration-300 rounded-lg shadow-lg ${expandImage && zoomImage === msg.image
                                  ? "w-auto h-[90vh] cursor-zoom-out"
                                  : "w-24 h-24 cursor-zoom-in object-cover"
                                  }`}
                              />
                            </div>
                          </div>
                        )}
                        <span className='block break-words whitespace-pre-wrap'>
                          {msg?.content}
                        </span>
                      </div>
                    )}
                    <div className={`mt-1 text-xs ${msg.sender.username === user?.username ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <button
                    className={`absolute top-2 ${msg.sender.username === user?.username ? '-left-8' : '-right-8'}
                     w-6 h-6 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors`}
                    onClick={() => setShowMore((prev) => (prev === idx ? null : idx))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                  {showMore === idx && (
                    <div className="inset-0 mt-1 z-10">
                      <MoreComponent currentUserName={user?.username ?? null} message={msg} fetchMessages={fetchMessages} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {
          openCamera &&
          <CameraCapture setImagePreview={setImagePreview} setOpenCamera={setOpenCamera} />
        }

        {/* Input Area */}
        {selectedUser && (
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap items-end gap-2"
            >
              <div className="">
                {imagePreview && (
                  <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                </button>
                <input
                  id="file-upload"
                  type={openCamera ? 'hidden' : 'file'}

                  name='img'
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={fileHandler}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="flex-1 relative">
                <input
                  name="message"
                  type="text"
                  placeholder="Type a message..."
                  className="w-full border border-gray-300 rounded-full text-black pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  value={messageText}
                  onChange={(e) => {
                    const roomId = [user?.username, selectedUser].sort().join('_');
                    if (user?.username && selectedUser) {
                      emitTypingEvent(roomId, user.username, selectedUser);
                    }
                    setMessageText(e.target.value);
                    listenForTyping({ user }, setTyping);
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={handleOpenCamera}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2zm9 2a4 4 0 110 8 4 4 0 010-8z"
                    />
                  </svg>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md"
              >
                {
                  loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"></path>
                    </svg>
                  ) : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                }

              </button>
            </form>
          </div>
        )}
      </main>
    </div>

  );
};

export default Auth(ChatApp);
