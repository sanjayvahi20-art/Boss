import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, Mail, Lock, User, Check, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (userData: { name: string; email: string; phone: string }) => void;
}

// Highly accurate SVG circular logo for Exam League / "ज्ञान और समृद्धि"
export function ExamLeagueLogo({ size = 72 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Outer spinning or pulsing ring */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5d40a8]/30 animate-[spin_40s_linear_infinite]" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full bg-white rounded-full p-0.5 shadow-md border-2 border-[#5d40a8]/10">
        <defs>
          {/* Curve for the text on top (Clockwise) */}
          <path
            id="curve-top"
            d="M 15,50 A 35,35 0 0,1 85,50"
            fill="none"
          />
          {/* Curve for bottom text */}
          <path
            id="curve-bottom"
            d="M 85,50 A 35,35 0 0,1 15,50"
            fill="none"
          />
        </defs>

        {/* Cute kid student with book illustration in core circle */}
        <circle cx="50" cy="50" r="23" fill="#eef2ff" className="stroke-[#5d40a8]/20 stroke-1" />
        <image
          href="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop"
          x="28"
          y="28"
          width="44"
          height="44"
          clipPath="circle(22px at 22px 22px)"
          className="rounded-full"
        />

        {/* Circular text tags */}
        <text className="fill-[#1e1b4b] font-extrabold text-[8.5px] tracking-wider fill-current uppercase">
          <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
            ज्ञान और समृद्धि
          </textPath>
        </text>

        <text className="fill-[#5d40a8] font-bold text-[8px] tracking-widest fill-current">
          <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">
            EXAM LEAGUE
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [screen, setScreen] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
  
  // Create Account Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Login inputs
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP Simulation States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('⚠️ Kripya apna Full Name enter karein!');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      showToast('⚠️ Kripya ek valid 10-digit mobile number enter karein!');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('⚠️ Kripya ek valid Email address enter karein!');
      return;
    }
    if (password.length < 4) {
      showToast('⚠️ Password kam se kam 4 character ka hona chahiye!');
      return;
    }
    if (!agreeTerms) {
      showToast('⚠️ Terms and Conditions ko agree karna mandatory hai!');
      return;
    }

    // Success Celebration
    showToast('🎉 Account successfully created! Swagat hai Exam League mein.');
    setTimeout(() => {
      onLoginSuccess({
        name: fullName,
        email: email,
        phone: mobileNumber
      });
    }, 1000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'otp') {
      if (!loginMobile.trim() || loginMobile.length < 10) {
        showToast('⚠️ Valid 10-digit mobile number enter karein!');
        return;
      }
      if (!otpSent) {
        // First step: send OTP
        setOtpSent(true);
        showToast('🔓 Demo OTP: 8888 send kiya gaya hai aapke mobile par!');
      } else {
        // Second step: verify OTP
        if (otpCode === '8888' || otpCode === '1234' || otpCode === '2026') {
          showToast('🎉 Login successful! Welcome back!');
          setTimeout(() => {
            onLoginSuccess({
              name: 'Arjun Raj',
              email: 'arjunraj@domain.com',
              phone: loginMobile
            });
          }, 1000);
        } else {
          showToast('❌ Wrong OTP entered. Kripya correct OTP enter karein (Demo Code: 8888)!');
        }
      }
    } else {
      // Login with password
      if (!loginMobile.trim()) {
        showToast('⚠️ Mobile / Email field cannot be empty!');
        return;
      }
      if (loginPassword.length < 4) {
        showToast('⚠️ Kripya apna register password sahi se enter karein!');
        return;
      }
      
      showToast('🎉 Login success! Swagat hai phir se.');
      setTimeout(() => {
        onLoginSuccess({
          name: 'Arjun Raj',
          email: loginMobile.includes('@') ? loginMobile : 'arjunraj@domain.com',
          phone: loginMobile.replace(/[^\d]/g, '') || '9876543210'
        });
      }, 1000);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white min-h-screen relative p-4 font-sans select-none justify-between text-slate-800">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-16 left-4 right-4 z-50 bg-[#1e1b4b] text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-between border border-white/10"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {screen === 'signup' ? (
          /* ================= CREATE ACCOUNT FORM ================= */
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between py-1 px-1 shrink-0">
              <button
                onClick={() => setScreen('login')}
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition active:scale-90"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => showToast('ℹ️ Humse contact karne ke liye support ticket raise karein.')}
                className="text-xs font-semibold text-[#5d40a8] hover:underline"
              >
                Need Help?
              </button>
            </div>

            {/* Core Box */}
            <div className="my-auto py-3 flex flex-col items-center">
              {/* Logo Emblem exact with Image */}
              <div className="mb-4">
                <ExamLeagueLogo size={75} />
              </div>

              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase text-center">
                CREATE ACCOUNT
              </h1>
              <p className="text-xs text-slate-500 font-medium text-center mt-1">
                Welcome to Exam League
              </p>

              {/* Input Forms */}
              <form onSubmit={handleSignupSubmit} className="w-full max-w-sm mt-5 space-y-3.5 text-left">
                {/* Field 1: Full Name */}
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-600 mb-1 ml-0.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs md:text-sm pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white placeholder-slate-400 text-slate-800"
                    />
                  </div>
                </div>

                {/* Field 2: Enter Mobile Number */}
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-600 mb-1 ml-0.5 uppercase tracking-wide">
                    Enter Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#5d40a8]">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/[^\d]/g, ''))}
                      className="w-full text-xs md:text-sm pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white placeholder-slate-400 text-slate-800"
                    />
                  </div>
                </div>

                {/* Field 3: Email Address */}
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-600 mb-1 ml-0.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs md:text-sm pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white placeholder-slate-400 text-slate-800"
                    />
                  </div>
                </div>

                {/* Field 4: Create Password */}
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-600 mb-1 ml-0.5 uppercase tracking-wide">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="........"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs md:text-sm pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white placeholder-slate-400 text-slate-800"
                    />
                  </div>
                </div>

                {/* Checkbox of T&C */}
                <div className="flex items-center gap-2 py-0.5">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-[#5d40a8] peer-checked:border-[#5d40a8] transition flex items-center justify-center text-white">
                      {agreeTerms && <Check size={12} strokeWidth={3} />}
                    </div>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    I agree to the <span className="text-[#5d40a8] font-bold cursor-pointer hover:underline">Terms & Conditions</span>
                  </span>
                </div>

                {/* Purple Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#5d40a8] hover:bg-[#4d3290] text-white text-xs md:text-sm font-black rounded-full shadow-lg hover:shadow-xl transition transform active:scale-[0.98] select-none cursor-pointer text-center uppercase tracking-wider"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>

            {/* Footer switcher Row */}
            <div className="py-2 text-center text-xs text-slate-500 shrink-0 font-medium">
              Already have an account?{' '}
              <button
                onClick={() => setScreen('login')}
                className="text-[#5d40a8] font-black underline hover:text-[#4d3290] transition focus:outline-none ml-0.5 cursor-pointer"
              >
                Login
              </button>
            </div>
          </motion.div>
        ) : (
          /* ================= LOGIN TO EXAM LEAGUE FORM ================= */
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between py-1 px-1 shrink-0">
              <button
                onClick={() => showToast('📞 Support Desk Number: +91 88888 77777')}
                className="text-xs font-bold text-[#5d40a8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Support Helpdesk 📞
              </button>
              <button
                onClick={() => showToast('🔑 Demo OTP se koshish karein ya "Login with OTP" select karein!')}
                className="text-xs font-semibold text-[#5d40a8] hover:underline"
              >
                Forgot?
              </button>
            </div>

            {/* Core Box */}
            <div className="my-auto py-3 flex flex-col items-center">
              {/* Logo Emblem exact with Image */}
              <div className="mb-4">
                <ExamLeagueLogo size={75} />
              </div>

              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase text-center block leading-tight">
                LOGIN TO EXAM LEAGUE
              </h1>
              <p className="text-xs text-slate-500 font-medium text-center mt-1">
                Welcome Back!
              </p>

              {/* Login mode selector tabs identical to mockup */}
              <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm mt-5 justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setOtpSent(false);
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                    loginMethod === 'otp'
                      ? 'bg-[#5d40a8] text-white shadow'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Login with OTP
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                    loginMethod === 'password'
                      ? 'bg-[#5d40a8] text-white shadow'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Login with Password
                </button>
              </div>

              {/* Dynamic Action Forms based on mode selected */}
              <form onSubmit={handleLoginSubmit} className="w-full max-w-sm mt-5 space-y-4 text-left">
                {loginMethod === 'otp' ? (
                  <>
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-slate-600 mb-1 ml-0.5 uppercase tracking-wide">
                        Enter Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#5d40a8]">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="98765 43210"
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value.replace(/[^\d]/g, ''))}
                          disabled={otpSent}
                          className="w-full text-xs md:text-sm pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white disabled:bg-slate-50 disabled:text-slate-400 placeholder-slate-400 text-slate-800"
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-1 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100/60"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] md:text-xs font-black text-[#5d40a8] uppercase tracking-wide">
                            Enter 4-Digit Demo OTP Code
                          </label>
                          <span className="text-[10px] font-semibold text-indigo-500 bg-white border border-indigo-200/50 px-1.5 py-0.5 rounded">
                            Demo: 8888
                          </span>
                        </div>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="Enter OTP Code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, ''))}
                          className="w-full text-center text-base md:text-lg tracking-[0.5em] font-black py-2.5 border border-indigo-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white text-slate-800"
                        />
                      </motion.div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#5d40a8] hover:bg-[#4d3290] text-white text-xs md:text-sm font-black rounded-full shadow-lg hover:shadow-xl transition transform active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
                      >
                        {otpSent ? 'Verify & Continue' : 'Send OTP'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-slate-600 mb-1 ml-0.5 uppercase tracking-wide">
                        Enter Mobile Number / Email
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Your Mobile or Email"
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value)}
                          className="w-full text-xs md:text-sm pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white placeholder-slate-400 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-slate-600 mb-1 ml-0.5 uppercase tracking-wide">
                        Enter Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          placeholder="Enter Password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full text-xs md:text-sm pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#5d40a8] focus:ring-1 focus:ring-[#5d40a8] outline-none transition bg-white placeholder-slate-400 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#5d40a8] hover:bg-[#4d3290] text-white text-xs md:text-sm font-black rounded-full shadow-lg hover:shadow-xl transition transform active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
                      >
                        Login
                      </button>
                    </div>
                  </>
                )}
              </form>

              {/* OR Continue With design directly from mockup image */}
              <div className="w-full max-w-sm mt-5 text-center">
                <div className="flex items-center my-3 relative">
                  <div className="flex-1 border-t border-slate-200"></div>
                  <span className="text-[9px] font-black text-slate-400 px-3 uppercase tracking-widest bg-white z-10">
                    OR CONTINUE WITH
                  </span>
                  <div className="flex-1 border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3.5">
                  <button
                    onClick={() => showToast('🔒 Demo login integration: Google is connected')}
                    className="py-2.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 transition active:scale-95 text-[10px] font-black text-slate-600 rounded-xl cursor-pointer"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => showToast('🔒 Demo login integration: Facebook is connected')}
                    className="py-2.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 transition active:scale-95 text-[10px] font-black text-slate-600 rounded-xl cursor-pointer"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => showToast('🔒 Demo login integration: Apple is connected')}
                    className="py-2.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 transition active:scale-95 text-[10px] font-black text-slate-600 rounded-xl cursor-pointer"
                  >
                    Apple
                  </button>
                </div>
              </div>

              {/* Create New Account Outlined Box exactly matching IMAGE */}
              <div className="w-full max-w-sm mt-6 text-center">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2.5">
                  New to Exam League?
                </p>
                <button
                  onClick={() => setScreen('signup')}
                  className="w-full py-3 bg-white border-2 border-[#5d40a8] hover:bg-[#5d40a8]/5 text-[#5d40a8] text-xs font-black rounded-full shadow-sm hover:shadow transition transform active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
                >
                  Create New Account
                </button>
              </div>
            </div>

            {/* Bottom Fine Print Row inside layout */}
            <div className="py-2 text-center text-[9px] text-slate-400 font-medium shrink-0 leading-relaxed">
              By continuing, you agree to our <br />
              <span className="text-[#5d40a8] font-bold cursor-pointer hover:underline">Terms & Conditions</span> &{' '}
              <span className="text-[#5d40a8] font-bold cursor-pointer hover:underline">Privacy Policy</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
