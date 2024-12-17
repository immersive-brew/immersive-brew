'use client'; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Profile {
  full_name: string;
}

// Extend Thread interface to include a profiles relationship
interface Thread {
  id: number;
  contents: string;
  replys: string[];
  user_id: string;
  created_at: string;
  profiles?: Profile; // Relationship to user's profile
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  // Fetch threads, including the related user's profile name
  useEffect(() => {
    const fetchThreads = async () => {
      // Selecting all columns from threads, plus the related profiles table with full_name
      const { data, error } = await supabase
        .from('threads')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching threads:', error);
        setErrorMessage('Failed to load threads.');
      } else if (data) {
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
        user_id: currentUser.id,
      };

      try {
        const { data, error } = await supabase
          .from('threads')
          .insert([newThreadObj])
          .select('*, profiles(full_name)'); // Return the inserted thread with profile info

        if (error) {
          console.error('Error inserting thread into Supabase:', error);
          setErrorMessage('Failed to create the thread. Please try again.');
        } else if (data && data.length > 0) {
          // Prepend the new thread
          setThreads([data[0] as Thread, ...threads]);
          setNewThread('');
          console.log('Created new thread:', data[0]);
          setModalOpen(false);
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

      {/* Show the "Create Thread" button only if the user is logged in */}
      {currentUser ? (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Create Thread
        </button>
      ) : (
        <p className="mb-4">Please log in to create a thread.</p>
      )}

      {/* Modal for creating a new thread */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Create a New Help Thread</h2>
            <form onSubmit={createThread}>
              <input
                type="text"
                placeholder="Enter your thread content..."
                className="border border-gray-300 p-2 rounded w-full mb-2"
                value={newThread}
                onChange={(e) => setNewThread(e.target.value)}
                disabled={loading}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white px-4 py-2 rounded ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display threads in a grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="border border-gray-300 bg-white p-4 rounded shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-2">{thread.contents}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Posted by {thread.profiles?.full_name || 'Unknown User'} on{' '}
              {new Date(thread.created_at).toLocaleString()}
            </p>

            {currentUser?.id === thread.user_id && (
              <button
                onClick={() => deleteThread(thread.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm mb-2"
              >
                Delete Thread
              </button>
            )}

            <ReplySection threadId={thread.id} addReply={addReply} />

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Replies:</h3>
              {thread.replys.length > 0 ? (
                <ul className="list-disc ml-6 space-y-1">
                  {thread.replys.map((reply, index) => (
                    <li key={index} className="text-sm">{reply}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No replies yet.</p>
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
        className="border border-gray-300 p-2 rounded w-full text-sm"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className={`bg-green-500 text-white px-3 py-1 rounded mt-1 text-sm ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
        }`}
        disabled={loading}
      >
        {loading ? 'Replying...' : 'Reply'}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </form>
  );
};

export default HelpThreadClient;
