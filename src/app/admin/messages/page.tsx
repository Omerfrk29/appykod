'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Calendar, Trash2, Check, Loader2 } from 'lucide-react';
import { messagesApi } from '@/lib/api/client';
import type { Message } from '@/lib/db';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
        setError('Mesajlar yüklenirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Mesajlar yüklenirken bir hata oluştu');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id: string) {
    setProcessingId(id);
    setError(null);
    try {
      const response = await messagesApi.markAsRead(id);
      if (response.success) {
        await fetchMessages();
      } else {
        setError(response.error || 'Mesaj işaretlenirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Mesaj işaretlenirken bir sorun oluştu');
      console.error('Error marking message as read:', err);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    setProcessingId(id);
    setError(null);
    try {
      const response = await messagesApi.delete(id);
      if (response.success) {
        await fetchMessages();
      } else {
        setError(response.error || 'Mesaj silinirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Mesaj silinirken bir sorun oluştu');
      console.error('Error deleting message:', err);
    } finally {
      setProcessingId(null);
    }
  }

  const unreadMessages = messages.filter((m) => !m.read);

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
          <span className="text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Mesajlar
        </h1>
        <p className="text-gray-400">
          {messages.length} mesaj {unreadMessages.length > 0 && `(${unreadMessages.length} okunmamış)`}
        </p>
      </header>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16 bg-[#1E2330] rounded-3xl border border-white/5">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Henüz mesaj yok</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border transition-all duration-300 ${
                !m.read
                  ? 'bg-[#1E2330] border-primary/50 shadow-lg shadow-primary/10'
                  : 'bg-[#1E2330] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white text-lg">
                        {m.name}
                      </h3>
                      {!m.read && (
                        <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                          Yeni
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {new Date(m.date).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl mb-5 ${
                !m.read 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-black/20'
              }`}>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                  {m.content}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {!m.read && (
                  <button
                    onClick={() => handleMarkAsRead(m.id)}
                    disabled={processingId === m.id}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {processingId === m.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>Okundu İşaretle</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMessage(m.id)}
                  disabled={processingId === m.id}
                  className="flex items-center gap-2 px-5 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingId === m.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
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
