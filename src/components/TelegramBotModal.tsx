import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, CheckCheck, Sparkles, RefreshCw } from 'lucide-react';
import type { TelegramMessage } from '../types';

interface TelegramBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const TelegramBotModal: React.FC<TelegramBotModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'مرحباً بك في بوت خدمة عملاء ومبيعات **إلكترو تيك مصر** 🇪🇬⚡\n\nأنا مساعدك المباشر لتتبع الشحنات، فحص عروض الفلاش، أو متابعة تقرير المبيعات اللحظي.\n\nاختر من الأوامر السريعة أدناه أو اكتب استفسارك:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      buttons: [
        { text: "📦 تتبع طلبي", payload: "/track" },
        { text: "🔥 عروض اليوم الفلاش", payload: "/deals" },
        { text: "📊 تقرير المبيعات اللحظي", payload: "/sales" },
        { text: "⚠️ فحص المخزون", payload: "/stock" },
        { text: "📞 الدعم الفني", payload: "/support" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: TelegramMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/telegram/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev,
          {
            ...data.data,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'عذراً، حدث خطأ في الاتصال بالبوت. يرجى المحاولة مرة أخرى.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#0E1621] text-white rounded-2xl shadow-2xl max-w-lg w-full h-[620px] max-h-[92vh] flex flex-col z-10 overflow-hidden border border-gray-800">
        
        {/* Telegram Header */}
        <div className="p-3 sm:p-4 bg-[#17212B] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Send className="w-5 h-5 -rotate-45" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#17212B] rounded-full" />
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>ElectroTech Bot</span>
                <span className="bg-sky-500 text-white text-[9px] px-1 rounded font-normal">bot</span>
              </div>
              <span className="text-[11px] text-sky-400">
                {isTyping ? 'يكتب الآن...' : 'متصل الآن • خدمة عملاء ومبيعات'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => sendMessage('/start')}
              className="text-gray-400 hover:text-white p-1.5 transition-colors"
              title="إعادة تشغيل القائمة"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telegram Messages View */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0E1621]"
          style={{
            backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#2B5278] text-white rounded-br-xs' 
                    : 'bg-[#182533] text-gray-100 rounded-bl-xs border border-gray-800'
                }`}
              >
                {msg.text}

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                </div>
              </div>

              {/* Bot Interactive Buttons */}
              {msg.buttons && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.buttons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(btn.payload)}
                      className="bg-[#242F3D] hover:bg-[#2B5278] text-sky-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-700/60 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#182533] px-3 py-2 rounded-xl w-24">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="p-3 bg-[#17212B] border-t border-gray-800 flex items-center gap-2">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={lang === 'ar' ? 'اكتب رسالة أو أمر (مثال: /track EG-10842 أو /sales)...' : 'Type a message or command...'}
            className="flex-1 bg-[#242F3D] text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
