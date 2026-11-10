import React, { useState } from 'react';
import { Cpu, Lock, Mail, User as UserIcon, Phone, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import type { User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, lang, onToggleLang }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setUserNotFound(false);

    if (isRegistering) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg(lang === 'ar' ? 'يرجى إدخال كافة البيانات المطلوبة' : 'Please fill all required fields');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            phone: phone.trim()
          })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setSuccessMsg(lang === 'ar' ? 'تم إنشاء حسابك بنجاح! جاري الدخول...' : 'Account created successfully! Logging in...');
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 600);
        } else {
          setErrorMsg(data.message || (lang === 'ar' ? 'فشل إنشاء الحساب' : 'Registration failed'));
        }
      } catch (err: any) {
        setErrorMsg(lang === 'ar' ? 'خطأ في الاتصال بالخادم' : 'Server connection error');
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      if (!email.trim() || !password.trim()) {
        setErrorMsg(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim()
          })
        });
        const data = await res.json();
        if (data.success && data.user) {
          onLoginSuccess(data.user);
        } else {
          if (data.code === 'USER_NOT_FOUND') {
            setUserNotFound(true);
            setErrorMsg(lang === 'ar' 
              ? 'هذا الحساب غير مسجل في قاعدة البيانات، يجب عليك إنشاء حساب أولاً.' 
              : 'Account not found in the database. Please create an account first.');
          } else {
            setErrorMsg(data.message || (lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'));
          }
        }
      } catch (err: any) {
        setErrorMsg(lang === 'ar' ? 'خطأ في الاتصال بالخادم' : 'Server connection error');
      } finally {
        setLoading(false);
      }
    }
  };

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#282828] via-gray-900 to-[#18181B] flex flex-col justify-between p-4 text-[#333333]">
      
      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 text-white">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#F68B1E] text-white w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-xl font-black text-white">إلكترو</span>
              <span className="text-xl font-black text-[#F68B1E]">تيك</span>
            </div>
            <span className="text-[9px] text-gray-400 font-bold tracking-wider">ELECTROTECH STORE</span>
          </div>
        </div>

        <button 
          onClick={onToggleLang}
          className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#F68B1E]" />
          <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Card Header */}
        <div className="p-6 bg-gradient-to-r from-[#282828] to-gray-800 text-white text-center">
          <div className="w-12 h-12 bg-[#F68B1E] text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight mb-1">
            {isRegistering 
              ? (lang === 'ar' ? 'إنشاء حساب جديد في إلكترو تيك' : 'Create an Account') 
              : (lang === 'ar' ? 'تسجيل الدخول إلى المتجر' : 'Sign In to ElectroTech')}
          </h2>
          <p className="text-xs text-gray-300">
            {isRegistering
              ? (lang === 'ar' ? 'أدخل بياناتك للتسجيل وحفظ طلباتك وعناوين الشحن' : 'Enter details to register and track orders')
              : (lang === 'ar' ? 'يجب تسجيل الدخول بالبريد الإلكتروني وكلمة المرور للمتابعة' : 'Enter your registered email and password to proceed')}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMsg}</p>
                {userNotFound && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setErrorMsg(null);
                      setUserNotFound(false);
                    }}
                    className="mt-1.5 text-xs font-bold text-[#F68B1E] hover:underline block"
                  >
                    {lang === 'ar' ? '← اضغط هنا لإنشاء حسابك الآن' : '← Click here to register your account'}
                  </button>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Registration Fields */}
            {isRegistering && (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">
                    {lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ar' ? 'محمد كمال' : 'John Doe'}
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none text-xs"
                    />
                    <UserIcon className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">
                    {lang === 'ar' ? 'رقم الهاتف المحمول' : 'Mobile Phone'}
                  </label>
                  <div className="relative">
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none text-xs font-mono"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
              </label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none text-xs"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                {lang === 'ar' ? 'كلمة المرور *' : 'Password *'}
              </label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none text-xs font-mono"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Confirm Password Field */}
            {isRegistering && (
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  {lang === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none text-xs font-mono"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F68B1E] hover:bg-[#e07a14] active:scale-95 text-white font-black py-3 rounded-lg text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span>{lang === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</span>
              ) : (
                <>
                  <span>
                    {isRegistering 
                      ? (lang === 'ar' ? 'إنشاء الحساب وبدء التسوق' : 'Create Account & Enter') 
                      : (lang === 'ar' ? 'تسجيل الدخول للمتجر' : 'Sign In to Store')}
                  </span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Switch Mode Toggle */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs">
            {isRegistering ? (
              <p className="text-gray-600">
                {lang === 'ar' ? 'لديك حساب بالفعل في قاعدة البيانات؟' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#F68B1E] hover:underline cursor-pointer"
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                {lang === 'ar' ? 'ليس لديك حساب مسجل في المتجر؟' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#F68B1E] hover:underline cursor-pointer"
                >
                  {lang === 'ar' ? 'إنشاء حساب جديد أولاً' : 'Create an Account first'}
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="bg-gray-50 p-3 border-t border-gray-100 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#238636]" />
          <span>{lang === 'ar' ? 'تسجيل مشفر وآمن عبر PostgreSQL & Supabase' : 'Encrypted with PostgreSQL & Supabase'}</span>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-xs text-gray-500 py-2">
        <p>© 2026 إلكترو تيك مصر (ElectroTech Egypt). جميع الحقوق محفوظة.</p>
      </div>

    </div>
  );
};
