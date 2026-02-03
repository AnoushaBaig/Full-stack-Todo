'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '../../lib/auth-guard';
import { apiClient } from '../../lib/api';
import { jwtStorage } from '../../lib/jwt-storage';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function TodosPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Get user ID from token
  const getUserIdFromToken = (): string | null => {
    const token = jwtStorage.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      // Assuming the user ID is in the 'sub' field of the JWT
      return parsedPayload.sub || parsedPayload.userId;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      router.push('/signin');
      return;
    }

    fetchTasks();
  }, [userId, router]);

  const fetchTasks = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<Task[]>(`/api/${userId}/tasks`);

      if (response.error) {
        setError(response.error.message);
        // If it's an auth error, redirect to signin
        if (response.error.code === 'NETWORK_ERROR' && response.error.message.includes('Unauthorized')) {
          jwtStorage.removeToken();
          router.push('/signin');
        }
      } else if (response.data) {
        setTasks(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!userId) {
      router.push('/signin');
      return;
    }

    try {
      const response = await apiClient.post<Task>(`/api/${userId}/tasks`, {
        title: newTask.title,
        description: newTask.description
      });

      if (response.error) {
        setError(response.error.message);
      } else if (response.data) {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '' });
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    if (!userId) {
      router.push('/signin');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      // For toggling completion, we need to use the specific endpoint
      const response = await apiClient.patch<Task>(
        `/api/${userId}/tasks/${taskId}/complete`,
        {}
      );

      if (response.error) {
        setError(response.error.message);
      } else if (response.data) {
        setTasks(tasks.map(t =>
          t.id === taskId ? { ...t, completed: response.data!.completed } : t
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!userId) {
      router.push('/signin');
      return;
    }

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await apiClient.delete<Task>(`/api/${userId}/tasks/${taskId}`);

        if (response.error) {
          setError(response.error.message);
        } else {
          setTasks(tasks.filter(t => t.id !== taskId));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || ''
    });
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTask || !editForm.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!userId) {
      router.push('/signin');
      return;
    }

    try {
      const response = await apiClient.put<Task>(`/api/${userId}/tasks/${editingTask.id}`, {
        title: editForm.title,
        description: editForm.description
      });

      if (response.error) {
        setError(response.error.message);
      } else if (response.data) {
        setTasks(tasks.map(t =>
          t.id === editingTask.id ? response.data! : t
        ));
        setEditingTask(null);
        setEditForm({ title: '', description: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: '', description: '' });
  };

  const handleSignOut = () => {
    jwtStorage.removeToken();
    router.push('/signin');
  };

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900 p-4">
          <div className="text-2xl font-semibold text-sky-700 dark:text-sky-300 animate-pulse">Loading tasks...</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-sky-50 dark:bg-slate-900 font-sans p-4 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <header className="py-6 bg-sky-600 dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">My Tasks</h1>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </header>

          {error && (
            <div className="my-4 bg-red-100 text-red-700 p-4 rounded-xl dark:bg-red-900 dark:text-red-100 shadow-lg animate-fade-in">
              {error}
            </div>
          )}

          {/* Create Task Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mt-6 border border-slate-200 dark:border-slate-700 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-sky-800 dark:text-sky-200 mb-4 flex items-center text-lg">
              <span className="mr-3 text-2xl">📝</span> Create New Task
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-sky-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-sky-300 focus:border-sky-500 dark:bg-slate-700 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:outline-none"
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                  className="w-full px-5 py-4 border-2 border-sky-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-sky-300 focus:border-sky-500 dark:bg-slate-700 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:outline-none"
                  placeholder="Add details..."
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl glow-on-hover hover-lift"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div className="mt-8 animate-fade-in-up delay-200">
            <h2 className="text-xl font-semibold text-sky-800 dark:text-sky-200 mb-6 flex items-center text-lg">
              <span className="mr-3 text-2xl">📋</span> Your Tasks ({tasks.length})
            </h2>

            {tasks.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-16 text-center border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="text-8xl mb-6 animate-bounce">🎯</div>
                <p className="text-sky-600 dark:text-sky-300 text-xl font-medium">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border transition-all duration-300 hover:shadow-xl hover-lift ${
                      task.completed
                        ? 'border-emerald-200 dark:border-emerald-800 opacity-90 bg-emerald-50 dark:bg-slate-700/50 task-complete-animation'
                        : 'border-sky-200 dark:border-slate-700'
                    } animate-fade-in-up scale-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {editingTask?.id === task.id ? (
                      // Edit form
                      <form onSubmit={handleUpdateTask} className="space-y-4 animate-fade-in">
                        <div>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-sky-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-sky-300 focus:border-sky-500 dark:bg-slate-700 dark:text-white mb-3 transition-all duration-300"
                            placeholder="Task title"
                          />
                        </div>
                        <div>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            rows={2}
                            className="w-full px-4 py-3 border-2 border-sky-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-sky-300 focus:border-sky-500 dark:bg-slate-700 dark:text-white transition-all duration-300"
                            placeholder="Task description"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover-lift"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover-lift"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Task display
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-5 flex-grow">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleComplete(task.id)}
                              className="mt-1 h-6 w-6 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer shadow-sm transition-transform duration-200 satisfying-check"
                              onClick={(e) => {
                                if (task.completed) {
                                  e.currentTarget.classList.add('satisfying-check');
                                  setTimeout(() => {
                                    e.currentTarget.classList.remove('satisfying-check');
                                  }, 400);
                                }
                              }}
                            />
                            <div className="flex-grow">
                              <h3 className={`text-lg font-semibold transition-all duration-300 ${
                                task.completed
                                  ? 'line-through text-slate-500 dark:text-slate-400'
                                  : 'text-slate-800 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-300'
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`mt-3 transition-all duration-300 ${
                                  task.completed
                                    ? 'line-through text-slate-500 dark:text-slate-500'
                                    : 'text-slate-600 dark:text-slate-300'
                                }`}>
                                  {task.description}
                                </p>
                              )}
                              <p className="text-xs text-sky-500 dark:text-sky-400 mt-4 flex items-center transition-all duration-300">
                                <span className="mr-2">📅</span>
                                Created: {new Date(task.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => startEditing(task)}
                              className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 p-3 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover-lift"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-300 shadow-sm hover:shadow-md hover-lift"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add animation styles */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }

          .delay-200 {
            animation-delay: 0.2s;
          }
        `}</style>
      </div>
    </AuthGuard>
  );
}