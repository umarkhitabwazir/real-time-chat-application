'use client';

import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Auth from '../utils/auth';
import { User } from '../interfaces/user.interface';
import { useRouter, useSearchParams } from 'next/navigation';
import AddUserComponent from './AddUser.component';

// Define a type for individual chat messages
interface Message {
  sender: { username: string };
  receiver: { username: string };
  content: string;
}


// Our ChatApp component
const ChatApp:React.FC<User> = ( { user }) => {
  // const [selectedUser, setSelectedUser] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [participants, setParticipants] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const selectedUser = searchParams.get('user') || '';
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // Fetch all messages, group by the "other" participant (sender or receiver)
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/fetch-all-message`, { withCredentials: true });
      const data: Message[] = res.data.data;

      const grouped: Record<string, Message[]> = {};
      const usersSet = new Set<string>();

      data.forEach(msg => {
        // Identify the other user in this message thread
        const other = msg.sender.username === user.username
          ? msg.receiver.username
          : msg.sender.username;
        // Initialize the array if needed
        if (!grouped[other]) grouped[other] = [];
        grouped[other].push(msg);
        // Track unique participants
        usersSet.add(other);
      });

      // Update state once
      setConversations(grouped);
      setParticipants(Array.from(usersSet));

      // If there's no selected user yet but we have an initial username param
      // if (!selectedUser && initialUser && usersSet.has(initialUser)) {
      //   setSelectedUser(initialUser);
      // }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data.error === 'Invalid token') {
        alert('Session expired, please login again');
        router.push('/api/login');
      } else {
        console.error(err);
        setError('Failed to fetch messages.');
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [API, user,router]);

  // Handle sending a message
  const handleSend = async () => {
    if (!messageText.trim() || !selectedUser) {
      setError('Please select a user and enter a message.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Send to backend
      await axios.post(
        `${API}/send-message`,
        { receiverUsername: selectedUser, message: messageText },
        { withCredentials: true }
      );

      // Optimistically update UI
      const newMsg: Message = {
        sender: { username: user.username },
        receiver: { username: selectedUser },
        content: messageText,
      };
      setConversations(prev => ({
        ...prev,
        [selectedUser]: [...(prev[selectedUser] || []), newMsg],
      }));

      setMessageText('');
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof AxiosError && err.response?.data.error === 'Invalid token') {
        alert('Session expired, please login again');
        router.push('/api/login');
      } else if (err instanceof AxiosError) {
        setError(err.response?.data.error || 'Send failed');
      } else {
        setLoading(false);
        console.error(err);
        setError('Send failed.');
      }
    }
  };

  return (
    <div className="flex h-screen">
      {
        showAddUser && <AddUserComponent setShowAddUser={setShowAddUser}/>
      }
   
      <aside className="w-fit bg-gray-200 p-4 overflow-y-auto overflow-x-auto">
        <button
          onClick={() => {
            setError('');
            setMessageText('');
            setShowAddUser(true);
          }}
          className='bg-green-600 hover:bg-green-500 cursor-pointer w-full p-2'
        >Add user
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Conversations</h2>
        {participants.length === 0 ? (
          <p className="text-gray-600">No conversations yet.</p>
        ) : (
          <ul >
            {participants.map((name) => (
              <li
                key={name}
                className={`p-2 cursor-pointer rounded ${selectedUser === name ? 'bg-blue-500 text-white' : 'text-black'}`}
                onClick={() => {
                  setError('');
                  setMessageText('');
                  // setSelectedUser(name)
                  router.push(`/api/chat?user=${name}`);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="flex-1 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">
          {selectedUser ? `Chat with ${selectedUser}` : 'Select a conversation'}
        </h2>

        {selectedUser && (
          <div className="flex-1 border bg-white rounded p-4 overflow-y-auto">
            {conversations[selectedUser]?.map((msg, idx) => (
              <React.Fragment key={idx}>


                <div
                  className={` mb-2 p-2 flex text-white rounded-b-md w-fit  ${msg.sender.username === user.username ? ' justify-self-end bg-green-400 rounded-l-md ' : 'self-start rounded-r-md bg-gray-400'}`}
                >
                  <div
                    className={`mb-2 p-2 flex text-white rounded-b-md w-fit  ${msg.sender.username === user.username ? ' justify-self-end bg-green-400 rounded-l-md ' : 'self-start rounded-r-md bg-gray-400'}`}
                  >

                  </div>
                  {msg.content}
                </div>

              </ React.Fragment>
            ))}
          </div>
        )}

        {selectedUser && (
          <div className="mt-4 flex">
            <input
              type="text"
              className="flex-1 border rounded p-2 mr-2"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value)
                setError('')
              }}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-400 rounded px-4 py-2"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </div>
  );
};

export default Auth(ChatApp);
