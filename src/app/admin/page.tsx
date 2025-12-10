'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('services');
  const [data, setData] = useState<any>({
    services: [],
    projects: [],
    messages: [],
  });
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in (mock)
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  async function fetchData() {
    const [services, projects, messages] = await Promise.all([
      fetch('/api/services').then((res) => res.json()),
      fetch('/api/projects').then((res) => res.json()),
      fetch('/api/contact').then((res) => res.json()),
    ]);
    setData({ services, projects, messages });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsLoggedIn(true);
      localStorage.setItem('admin_token', 'true');
      fetchData();
    } else {
      alert('Invalid credentials');
    }
  }

  async function handleDelete(type: 'services' | 'projects', id: string) {
    if (!confirm('Are you sure?')) return;

    await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
    fetchData();
  }

  async function handleAdd(type: 'services' | 'projects') {
    const title = prompt('Title:');
    if (!title) return;
    const description = prompt('Description:');

    const body: any = { title, description };
    if (type === 'services') body.icon = 'code';
    if (type === 'projects') {
      body.imageUrl = 'https://via.placeholder.com/800x600';
      body.link = '#';
    }

    await fetch(`/api/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchData();
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <form
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700"
          onSubmit={handleLogin}
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Admin Login
          </h1>
          <div className="space-y-4">
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-8 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full z-10 transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'services'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('services')}
          >
            <LayoutDashboard size={20} /> <span>Services</span>
          </button>
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'projects'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase size={20} /> <span>Projects</span>
          </button>
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'messages'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={20} /> <span>Messages</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="w-full px-4 py-2 text-danger hover:bg-danger/10 rounded-xl transition-colors"
            onClick={() => {
              localStorage.removeItem('admin_token');
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
            {activeTab}
          </h1>
          {activeTab !== 'messages' && (
            <button
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              onClick={() => handleAdd(activeTab as any)}
            >
              <Plus size={20} /> <span>Add New</span>
            </button>
          )}
        </header>

        <div className="space-y-4">
          {activeTab === 'services' && (
            <div className="grid gap-4">
              {data.services.map((s: any) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {s.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {s.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete('services', s.id)}
                    className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid gap-4">
              {data.projects.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {p.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete('projects', p.id)}
                    className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="grid gap-4">
              {data.messages.map((m: any) => (
                <div
                  key={m.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {m.name}{' '}
                      <span className="text-sm font-normal text-gray-500">
                        ({m.email})
                      </span>
                    </h3>
                    <small className="text-gray-400">
                      {new Date(m.date).toLocaleString()}
                    </small>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
