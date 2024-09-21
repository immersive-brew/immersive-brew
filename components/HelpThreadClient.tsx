

"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HelpThreadClient = ({ initialThreads }) => {
  const [threads, setThreads] = useState(initialThreads || []);
  const [newThread, setNewThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setThreads(initialThreads);
  }, [initialThreads]);

  const createThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (newThread.trim() !== '') {
      setLoading(true);
      const newThreadObj = { contents: newThread, replys: [] };

      try {
        const { data, error } = await supabase
          .from('threads')
          .insert([newThreadObj]);

        if (error) {
          console.error('Error inserting thread into Supabase:', error);
          setErrorMessage('Failed to create the thread. Please try again.');
        } else {
          setThreads([...threads, data[0]]);
          setNewThread('');
          console.log('Created new thread:', data[0]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('Thankyou');
      } finally {
        setLoading(false);
      }
    }
  };

  // Update the reply in Supabase and local state
  const addReply = async (threadId: number, replyText: string) => {
    const updatedThreads = threads.map(thread => {
      if (thread.id === threadId) {
        return { ...thread, replys: [...thread.replys, replyText] };
      }
      return thread;
    });
    setThreads(updatedThreads);

    // Persist the new reply to Supabase
    try {
      const { data, error } = await supabase
        .from('threads')
        .update({ replys: updatedThreads.find(thread => thread.id === threadId)?.replys })
        .eq('id', threadId);

      if (error) {
        console.error('Error updating thread with reply in Supabase:', error);
      } else {
        console.log('Reply added to Supabase for thread ID:', threadId, 'with data:', data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const deleteThread = async (threadId: number) => {
    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', threadId);

    if (error) {
      console.error('Error deleting thread:', error);
    } else {
      setThreads(threads.filter(thread => thread.id !== threadId));
      console.log('Deleted thread with ID:', threadId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Help Threads</h1>

      <form onSubmit={createThread} className="mb-4">
        <input
          type="text"
          placeholder="Create a new help thread"
          className="border border-gray-300 p-2 rounded w-full mb-2"
          value={newThread}
          onChange={(e) => setNewThread(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Thread'}
        </button>
      </form>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread.id} className="border-3 border-brown-700 bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-semibold">{thread.contents}</h2>

            <button
              onClick={() => deleteThread(thread.id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Delete Thread
            </button>

            <ReplySection threadId={thread.id} addReply={addReply} />

            <div className="mt-4">
              <h3 className="font-semibold">Replies:</h3>
              {thread.replys.length > 0 ? (
                <ul className="list-disc ml-6">
                  {thread.replys.map((reply, index) => (
                    <li key={index}>{reply}</li>
                  ))}
                </ul>
              ) : (
                <p>No replies yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReplySection = ({ threadId, addReply }) => {
  const [reply, setReply] = useState('');

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim() !== '') {
      addReply(threadId, reply);
      setReply('');
    }
  };

  return (
    <form onSubmit={handleReply} className="mt-2">
      <input
        type="text"
        placeholder="Write a reply..."
        className="border border-gray-300 p-2 rounded w-full"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        Reply
      </button>
    </form>
  );
};

export default HelpThreadClient;
