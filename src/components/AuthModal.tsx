import React, { useState } from 'react';
import { X, User as UserIcon, Lock, Mail, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  lang: 'ar' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          onLoginSuccess(data.user);
          onClose();
        } else {
          setErrorMsg(data.message || 'بيانات الدخول غير صحيحة');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone })
        });
        const data = await res.json();
        if (data.success && data.user) {
          onLoginSuccess(data.user);
          onClose();
        } else {
          setErrorMsg(data.message || 'فشل إنشاء الحساب');
        }
      }
    } catch {
      setErrorMsg('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden z-10 border border-gray-200">
        
        {/* Header */}
        <div className="p-4 bg-[#282828] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#F68B1E]" />
            <h3 className="font-bold text-sm sm:text-base">
              {tab === 'login' 
                ? (lang === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Account')
                : (lang === 'ar' ? 'إنشاء حساب عميل جديد' : 'Create New Account')}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 text-xs font-bold">
          <button
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'login' ? 'border-[#F68B1E] text-[#F68B1E] bg-orange-50/40' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'register' ? 'border-[#F68B1E] text-[#F68B1E] bg-orange-50/40' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {lang === 'ar' ? 'إنشاء حساب جديد' : 'Register'}
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {tab === 'register' && (
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  {lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                </label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none"
              />
            </div>

            {tab === 'register' && (
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                {lang === 'ar' ? 'كلمة المرور *' : 'Password *'}
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold py-2.5 rounded-lg text-xs sm:text-sm shadow-sm transition-all cursor-pointer mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span>جاري التحقق...</span>
              ) : (
                <span>{tab === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}</span>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
