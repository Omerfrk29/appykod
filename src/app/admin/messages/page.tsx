'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Calendar, Trash2, Check } from 'lucide-react';
import { messagesApi } from '@/lib/api/client';
import type { Message } from '@/lib/db';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    setError(null);
    try {
      const response = await messagesApi.getAll();
      if (response.success && response.data) {
        setMessages(response.data);
      } else {
        setError('Mesajlar yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Mesajlar yüklenirken bir hata oluştu');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await messagesApi.markAsRead(id);
      if (response.success) {
        await fetchMessages();
      } else {
        setError(response.error || 'Mesaj işaretlenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Mesaj işaretlenirken bir hata oluştu');
      console.error('Error marking message as read:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await messagesApi.delete(id);
      if (response.success) {
        await fetchMessages();
      } else {
        setError(response.error || 'Mesaj silinirken bir hata oluştu');
      }
    } catch (err) {
      setError('Mesaj silinirken bir hata oluştu');
      console.error('Error deleting message:', err);
    } finally {
      setLoading(false);
    }
  }

  const unreadMessages = messages.filter((m) => !m.read);

  return (
    <div className="p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between">
          <span className="text-red-800 dark:text-red-200">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            ✕
          </button>
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <span className="text-blue-800 dark:text-blue-200">Yükleniyor...</span>
        </div>
      )}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mesajlar
        </h1>
        <p className="text-gray-500 mt-1">
          {messages.length} mesaj {unreadMessages.length > 0 && `(${unreadMessages.length} okunmamış)`}
        </p>
      </header>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Henüz mesaj yok</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border ${
                !m.read
                  ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-100 dark:border-gray-700'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {m.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span>{m.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(m.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {!m.read && (
                    <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      Yeni
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4">
                {m.content}
              </p>
              <div className="flex items-center space-x-2">
                {!m.read && (
                  <button
                    onClick={() => handleMarkAsRead(m.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
                  >
                    <Check size={14} />
                    <span>Okundu İşaretle</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMessage(m.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                >
                  <Trash2 size={14} />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
