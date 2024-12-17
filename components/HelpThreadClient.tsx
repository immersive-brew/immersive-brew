'use client'; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Thread {
  id: number;
  contents: string;
  replys: string[];
  user_id: string | null; // user_id can now be null
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
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
  const [userFullNameMap, setUserFullNameMap] = useState<Record<string, string>>({});

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

  // Fetch threads and profiles
  useEffect(() => {
    const fetchThreadsAndProfiles = async () => {
      // Fetch threads
      const { data: threadsData, error: threadsError } = await supabase
        .from('threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (threadsError) {
        console.error('Error fetching threads:', threadsError);
        setErrorMessage('Failed to load threads.');
        return;
      }

      const threads = threadsData as Thread[];

      // Extract user_ids from threads (filter out null)
      const userIds = Array.from(new Set(threads.map((t) => t.user_id).filter(Boolean))) as string[];

      let fullNameMap: Record<string, string> = {};

      if (userIds.length > 0) {
        // Fetch profiles for these user_ids
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setErrorMessage('Failed to load user profiles.');
          return;
        }

        const profiles = profilesData as Profile[];
        profiles.forEach((profile) => {
          fullNameMap[profile.id] = profile.full_name;
        });
      }

      setThreads(threads);
      setUserFullNameMap(fullNameMap);
    };

    fetchThreadsAndProfiles();
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
        user_id: currentUser.id, // user_id should not be null here since currentUser is defined
      };

      try {
        const { data, error } = await supabase.from('threads').insert([newThreadObj]).select('*');

        if (error) {
          console.error('Error inserting thread into Supabase:', error);
          setErrorMessage('Failed to create the thread. Please try again.');
        } else if (data && data.length > 0) {
          const insertedThread = data[0] as Thread;
          // Try to update the userFullNameMap (in case this user wasn't in the map yet)
          if (insertedThread.user_id && !userFullNameMap[insertedThread.user_id]) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', insertedThread.user_id)
              .single();

            if (profileData?.full_name) {
              setUserFullNameMap((prev) => ({
                ...prev,
                [insertedThread.user_id as string]: profileData.full_name,
              }));
            }
          }

          setThreads([insertedThread, ...threads]);
          setNewThread('');
          console.log('Created new thread:', insertedThread);
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
              Posted by{' '}
              {thread.user_id
                ? userFullNameMap[thread.user_id] || 'Unknown User'
                : 'Unknown User'}{' '}
              on {new Date(thread.created_at).toLocaleString()}
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
