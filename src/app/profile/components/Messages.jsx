'use client';

import { useEffect, useState } from 'react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('You must be logged in to view messages');
      setLoading(false);
      return;
    }

    const user = JSON.parse(userStr);
    if (!user._id) {
      setError('User data is incomplete');
      setLoading(false);
      return;
    }

    fetch(`/api/messages?userId=${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.messages) setMessages(data.messages);
        else setMessages([]);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch messages');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (messages.length === 0) return <p>No messages yet.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">My Messages</h2>
      {messages.map((msg) => (
        <div key={msg._id} className="p-4 border rounded shadow bg-white">
          <p><strong>Sender:</strong> {msg.name || 'Unknown'}</p>
          <p><strong>Email:</strong> {msg.email || 'Not available'}</p>
          <p><strong>Message:</strong> {msg.message}</p>
          <p className="text-xs text-gray-500 mt-2">
            Sent at: {new Date(msg.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
