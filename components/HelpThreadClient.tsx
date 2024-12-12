'use client'; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

// Define the Thread interface with the added user_id and created_at
interface Thread {
  id: number;
  contents: string;
  replys: string[];
  user_id: string; // Added user_id to track the thread creator
  created_at: string; // Ensure this field exists in your Supabase table
}

const supabase = createClient();

interface HelpThreadClientProps {
  initialThreads: Thread[];
}

const HelpThreadClient = ({ initialThreads }: HelpThreadClientProps) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThread, setNewThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null); // State to store the current user

  // Fetch the current user when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setCurrentUser(user);
        console.log('Fetched user:', user);
      }
    };
    fetchUser();
  }, []);

  // Fetch and sort threads whenever initialThreads or currentUser changes
  useEffect(() => {
    const fetchThreads = async () => {
      let query = supabase.from('threads').select('*').order('created_at', { ascending: false });

      // If you need to filter based on the current user, you can modify the query here
      // For example, fetching only threads created by the current user:
      // if (currentUser) {
      //   query = query.eq('user_id', currentUser.id);
      // }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching threads:', error);
        setErrorMessage('Failed to load threads.');
      } else {
        setThreads(data as Thread[]);
      }
    };

    fetchThreads();
  }, [currentUser]);

  const createThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!currentUser) {
      setErrorMessage('You must be logged in to create a thread.');
      return;
    }
    if (newThread.trim() !== '') {
      setLoading(true);
      const newThreadObj = {
        contents: newThread,
        replys: [],
        user_id: currentUser.id, // Include the user_id when creating a thread
      };

      try {
        const { data, error } = await supabase
          .from('threads')
          .insert([newThreadObj])
          .select(); // Ensure we return the inserted data

        if (error) {
          console.error('Error inserting thread into Supabase:', error);
          setErrorMessage('Failed to create the thread. Please try again.');
        } else if (data && data.length > 0) {
          // Prepend the new thread to show it first
          setThreads([data[0] as Thread, ...threads]);
          setNewThread('');
          console.log('Created new thread:', data[0]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const addReply = async (threadId: number, replyText: string) => {
    const updatedThreads = threads.map((thread) => {
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
        .update({
          replys: updatedThreads.find((thread) => thread.id === threadId)?.replys,
        })
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
    setErrorMessage('');
    const threadToDelete = threads.find((thread) => thread.id === threadId);
    if (!threadToDelete) {
      setErrorMessage('Thread not found.');
      return;
    }

    if (!currentUser) {
      setErrorMessage('You must be logged in to delete a thread.');
      return;
    }

    // Check if the current user is the creator of the thread
    if (currentUser.id !== threadToDelete.user_id) {
      setErrorMessage('You are not authorized to delete this thread.');
      return;
    }

    try {
      const { error } = await supabase.from('threads').delete().eq('id', threadId);

      if (error) {
        console.error('Error deleting thread:', error);
        setErrorMessage('Failed to delete the thread. Please try again.');
      } else {
        setThreads(threads.filter((thread) => thread.id !== threadId));
        console.log('Deleted thread with ID:', threadId);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Help Threads</h1>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* Show the thread creation form only if the user is logged in */}
      {currentUser ? (
        <form onSubmit={createThread} className="mb-4">
          {/* Create new thread */}
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
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Thread'}
          </button>
        </form>
      ) : (
        <p className="mb-4">Please log in to create a thread.</p>
      )}

      <div className="space-y-4">
        {/* Map all threads */}
        {threads.map((thread) => (
          <div key={thread.id} className="border border-brown-700 bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-semibold">{thread.contents}</h2>

            {/* Show delete button only if the current user is the thread creator */}
            {currentUser?.id === thread.user_id && (
              <button
                onClick={() => deleteThread(thread.id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
              >
                Delete Thread
              </button>
            )}

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

const ReplySection = ({
  threadId,
  addReply,
}: {
  threadId: number;
  addReply: (threadId: number, reply: string) => void;
}) => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (reply.trim() !== '') {
      setLoading(true);
      try {
        await addReply(threadId, reply);
        setReply('');
      } catch (err) {
        console.error('Error adding reply:', err);
        setError('Failed to add reply. Please try again.');
      } finally {
        setLoading(false);
      }
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
        disabled={loading}
      />
      <button
        type="submit"
        className={`bg-green-500 text-white px-4 py-2 rounded mt-2 ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
        }`}
        disabled={loading}
      >
        {loading ? 'Replying...' : 'Reply'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default HelpThreadClient;
