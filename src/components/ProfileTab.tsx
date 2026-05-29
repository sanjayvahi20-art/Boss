import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shield, Share2, HelpCircle, ChevronRight, Award, Trophy, Users, Share, 
  Copy, MessageSquare, Settings, LogOut, Activity, Headphones, Check, Sparkles, 
  X, Send, Phone, Mail, CreditCard, MapPin, Bell, Volume2, ShieldCheck, HelpCircle as HelpIcon,
  CircleDot, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  onChangeName: (name: string) => void;
  onOpenModal: (modal: 'addMoney' | 'withdraw' | 'friendBattle' | 'teamBattle' | 'referEarn' | 'shareScore' | 'editProfile') => void;
  onLogout?: () => void;
}

export default function ProfileTab({ profile, onChangeName, onOpenModal, onLogout }: ProfileTabProps) {
  // Navigation states for our custom drawers
  const [activeSection, setActiveSection] = useState<'info' | 'achievements' | 'activity' | 'settings' | 'chat' | 'help' | 'logout' | null>(null);

  // Editable local fields (Personal Info)
  const [localMail, setLocalMail] = useState('sanjay.vahi2.0@gmail.com');
  const [localPhone, setLocalPhone] = useState('+91 94580 12X90');
  const [localUpi, setLocalUpi] = useState(profile.upiId || 'sanjay@paytm');
  const [localState, setLocalState] = useState('Uttar Pradesh (UP)');

  // Sound and settings variables
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibeEnabled, setVibeEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('hi');

  // Interactive Achievements claims
  const [achievements, setAchievements] = useState([
    { id: '1', title: 'League Starter 🏅', desc: 'Syllabus tests ka pehla contest complete kiya.', status: 'claimed', reward: '₹20 Bonus' },
    { id: '2', title: 'SSC Mock Champion 🏆', desc: 'SSC Mock Test series me 90% se jyada score kiya.', status: 'claimable', reward: '₹50 Cash' },
    { id: '3', title: 'Inviter Pro 🔥', desc: 'Apne 3 dosto ko join karwaya (2/3 complete).', status: 'locked', reward: '₹100 Bonus' },
    { id: '4', title: 'Speed Topper ⚡', desc: 'Kisi bhi quiz me sabhi answers 5 seconds se pehle diye.', status: 'claimable', reward: '₹25 Cash' },
    { id: '5', title: 'Consistence King ⭐', desc: 'Lekhpal aur Police Exams ke lagatar 5 free quizzes complete kiye.', status: 'claimed', reward: '₹30 Coins' }
  ]);

  // Support Chat Message log
  const [typedMessage, setTypedMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { 
      sender: 'bot', 
      text: 'Namaste Sanjay! 🙏 Humare support system me aapka swagat hai. Main withdrawal limits, add money, refer bonus aur quiz generation issues me aapki madad kar sakta hu. Kripya apna prashn likhein ya niche diye gye fast option ko chunein!',
      time: 'Just now' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // FAQ Expanded index state
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);

  // Auto-scroll inside Support Chat drawer
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleEditName = () => {
    onOpenModal('editProfile');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    alert("📋 Referral code copied to clipboard: " + profile.referralCode);
  };

  // Claim Achievement reward trigger
  const handleClaimReward = (id: string, title: string, reward: string) => {
    setAchievements(prev => prev.map(item => item.id === id ? { ...item, status: 'claimed' as const } : item));
    alert(`🎉 Congratulations! Aapne "${title}" ke liye "${reward}" successfully claim kar liya hai. Balance jald hi update hoga!`);
  };

  // Send support message handler
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time: timeString };
    
    setChatMessages(prev => [...prev, userMsg]);
    setTypedMessage('');
    setIsTyping(true);

    // Simulate smart support executive replying based on keyword triggers
    setTimeout(() => {
      let reply = "Aapke is response ko humne support desk ticket #UDH91280 me log kar liya hai. Humari Team 5-10 minutes me aapse call/chat pr sampark karegi. Tab tak aap baaki quizzes khel sakte hain!";
      const query = text.toLowerCase();
      
      if (query.includes('withdrawal') || query.includes('paise') || query.includes('nikal')) {
        reply = "Withdrawal policy aur timing: Humara withdrawal instant UPI pr transfers hota hai. Minimum withdraw limit ₹100 hai aur dynamic processing fee 0% lagti hai. Agar koi withdraw pending hai, toh Bank and Razorpay API check karein.";
      } else if (query.includes('add money') || query.includes('payment') || query.includes('recharge')) {
        reply = "Add Money issues support counter: Razorpay gate instant load karta hai. Agar paise account se cut gye hain aur wallet update nahi hua, to 10 min wait karein ya transaction receipt screenshot humein WhatsApp support pr bhejein.";
      } else if (query.includes('ai') || query.includes('gemini') || query.includes('question')) {
        reply = "AI Question Generation system: We use premium Google Gemini model settings. Jo bhi questions banate hain, unki credibility fully certified hoti hai. Agar kisi question me truti payi jaye, to use mark karein taaki hum instant verification update de sakein.";
      } else if (query.includes('contest') || query.includes('join') || query.includes('league')) {
        reply = "Contest Leagues details: Udhan League high-performing anti-cheat mechanism ke sath chalti hai. Aap test start hone ke baad disconnect na karein, anyatha direct auto-submit ho jayega.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot' as const, text: reply, time: timeString }]);
      setIsTyping(false);
    }, 1200);
  };

  // Pre-configured questions inside FAQs
  const faqData = [
    {
      q: "Wallet details update hone me kitna time lagta hai?",
      a: "Razorpay add money instant update hota hai. Kabhi-kabhi network load ki wajah se bank processing me 5-10 minutes lag sakte hain. Bank check confirm hone par instant update ho jata hai."
    },
    {
      q: "Contest me register karne ke baad kya ise cancel kar sakte hain?",
      a: "Nahi, ek baar entry fees processing complete hone par seat book ho jati hai. Lekin agar kisi karan contest cancel hota hai, to full fees automatically instant refund kar di jayegi."
    },
    {
      q: "My Activity section kya darshata hai?",
      a: "Ye aapke dainik exam reports, correct questions attempts, dynamic win stats aur live matches ka direct database feed summary dikhata hai jisse aap progress trace kar sakein."
    },
    {
      q: "Kya ek se jyada account check/OTP use kar sakte hain?",
      a: "Nahi! Premium Firebase Dev Verification security systems multiple IP bypass ko block karta hai. Anti-cheat protection policy ke tahat aapka withdraw block ho sakta hai."
    },
    {
      q: "Dosto ko refer karne pr kitna reward milta hai?",
      a: "Direct Referral link pr join hone aur dosto dwara first cash match khela jane pr, aapko direct ₹100 cash bonus aur dosto ko instant ₹50 bonus credit kiya jata hai."
    }
  ];

  return (
    <div className="space-y-4 text-left relative pb-8">
      
      {/* 1. USER PROFILE MASCOT CARD */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Background ambient watermarks */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full filter blur-2xl -mr-16 -mt-16 pointer-events-none opacity-60"></div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <div className="relative">
            <div 
              onClick={() => onOpenModal('editProfile')}
              className="w-18 h-18 rounded-full border-4 border-red-500/10 overflow-hidden bg-gradient-to-tr from-rose-500 to-red-650 p-0.5 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all group"
            >
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop"}
                alt="Profile Mascot Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full bg-white group-hover:opacity-90 active:opacity-80 transition"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-red-650 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
              {profile.level}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-extrabold text-slate-950 text-lg leading-none">
                {profile.name}
              </h3>
              <span className="text-[9px] text-blue-600 bg-blue-50 font-black p-0.5 px-2 rounded-full uppercase tracking-wider scale-90 flex items-center gap-0.5 border border-blue-200/30">
                <ShieldCheck size={8} className="text-blue-600 fill-blue-600" /> VERIFIED
              </span>
            </div>
            
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">
              LEVEL {profile.level} • CHAMPION CHALLENGER
            </p>

            <button
              onClick={handleEditName}
              className="text-[11px] text-red-600 hover:text-red-750 font-black flex items-center gap-1 mt-1.5 transition underline cursor-pointer"
            >
              ✏️ Edit Username
            </button>
          </div>
        </div>

        {/* XP PROGRESS BAR */}
        <div className="mt-5 relative z-10">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
            <span className="flex items-center gap-1">🏆 Progress XP Wallet Wallet</span>
            <span className="text-red-650 font-black">{profile.xp} / {profile.maxXp} XP</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden border border-slate-200/30">
            <div
              className="bg-gradient-to-r from-red-500 to-rose-650 h-full rounded-full transition-all duration-350"
              style={{ width: `${(profile.xp / profile.maxXp) * 100}%` }}
            />
          </div>
        </div>

        {/* COMPREHENSIVE HIGH-END METRICS OVERLAY GRID */}
        <div className="grid grid-cols-3 gap-2.5 border-t border-slate-100 mt-5 pt-4 text-center">
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <p className="text-lg font-black text-slate-900 leading-none">{profile.quizzesPlayed}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mt-1.5">
              Played
            </p>
          </div>

          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <p className="text-lg font-black text-green-600 leading-none">{profile.contestsWon}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mt-1.5">
              Won
            </p>
          </div>

          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <p className="text-lg font-black text-amber-500 leading-none">₹{profile.totalWinnings.toLocaleString()}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mt-1.5">
              Winnings
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN CATEGORIES DIRECT LINK GRID AND SYSTEM OPTIONS FROM IMAGE */}
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 mt-6">
        App Menu Controls
      </h3>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
        
        {/* Link 1: My Personal Information */}
        <div
          onClick={() => setActiveSection('info')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-blue-50 rounded-xl">
              <User size={16} className="text-blue-600" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">My Information</span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 2: Friend Battle Match with red badge styling from IMAGE */}
        <div
          onClick={() => onOpenModal('friendBattle')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-sky-50 rounded-xl">
              <Users size={16} className="text-sky-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">Friend Battle</span>
            <span className="bg-red-500 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 select-none shadow">
              NEW
            </span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 3: Team Private Battle Lobby with red badge styling from IMAGE */}
        <div
          onClick={() => onOpenModal('teamBattle')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-purple-50 rounded-xl">
              <Users size={16} className="text-purple-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">Team Battle</span>
            <span className="bg-red-500 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 select-none shadow animate-pulse">
              NEW
            </span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 4: Refer & Earn Promo and sharing bonus */}
        <div
          onClick={() => onOpenModal('referEarn')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-amber-50 rounded-xl">
              <Share2 size={16} className="text-amber-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">Refer & Earn</span>
            <span className="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">
              ₹100 REF
            </span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 5: Share Scorecard template from IMAGE */}
        <div
          onClick={() => onOpenModal('shareScore')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-yellow-50 rounded-xl">
              <Trophy size={16} className="text-yellow-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">Share Score</span>
            <span className="bg-red-500 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 select-none shadow">
              NEW
            </span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 6: Achievements showcase Drawer */}
        <div
          onClick={() => setActiveSection('achievements')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-rose-50 rounded-xl">
              <Award size={16} className="text-rose-600" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">Achievements</span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 7: Detailed stats activity logs */}
        <div
          onClick={() => setActiveSection('activity')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-emerald-50 rounded-xl">
              <Activity size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">My Activity</span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 8: In-app Sound UI settings */}
        <div
          onClick={() => setActiveSection('settings')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-slate-100 rounded-xl">
              <Settings size={16} className="text-slate-600" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">Settings</span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 9: Live Expert/Bot Chat Support */}
        <div
          onClick={() => setActiveSection('chat')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-pink-50 rounded-xl">
              <MessageSquare size={16} className="text-pink-600" />
            </div>
            <span className="text-xs font-extrabold text-slate-900	">Live Chat Support</span>
            <span className="bg-green-500 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded-full uppercase scale-90 select-none">
              ONLINE
            </span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

        {/* Link 10: FAQs accordions */}
        <div
          onClick={() => setActiveSection('help')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition duration-150 group"
        >
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-1.5 bg-indigo-50 rounded-xl">
              <HelpCircle size={16} className="text-indigo-600" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">Help & Support</span>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition group-hover:translate-x-0.5" />
        </div>

      </div>

      {/* 3. CENTERED LOG OUT ACCOUNT BUTTON (Matches the bottom requirement from IMAGE) */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <button
          onClick={() => setActiveSection('logout')}
          className="flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-red-600 group transition cursor-pointer"
        >
          <LogOut size={14} className="text-slate-400 group-hover:text-red-650 transition group-hover:-translate-x-0.5" />
          <span>Log Out Account</span>
        </button>
      </div>

      {/* =========================================================================
          INTERACTIVE FULL SCREEN OVERLAY DRAWERS / MODALS FOR EACH CHOSEN CLICK 
          ========================================================================= */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-[34px] border-t border-slate-200/50 max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              
              {/* Header inside drawer */}
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center space-x-2">
                  {activeSection === 'info' && (
                    <>
                      <User size={18} className="text-red-650" />
                      <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">My Information</span>
                    </>
                  )}
                  {activeSection === 'achievements' && (
                    <>
                      <Award size={18} className="text-red-650" />
                      <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">My Accomplishments</span>
                    </>
                  )}
                  {activeSection === 'activity' && (
                    <>
                      <Activity size={18} className="text-red-650" />
                      <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">My Activity Ledger</span>
                    </>
                  )}
                  {activeSection === 'settings' && (
                    <>
                      <Settings size={18} className="text-red-650" />
                      <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Settings Panel</span>
                    </>
                  )}
                  {activeSection === 'chat' && (
                    <>
                      <Headphones size={18} className="text-red-650" />
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-xs text-slate-900 leading-none">Udhan AI Helpdesk</span>
                        <span className="text-[9px] text-green-500 font-bold ml-0.5 tracking-wider uppercase">Active now</span>
                      </div>
                    </>
                  )}
                  {activeSection === 'help' && (
                    <>
                      <HelpCircle size={18} className="text-red-650" />
                      <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">FAQs / Help support</span>
                    </>
                  )}
                  {activeSection === 'logout' && (
                    <>
                      <LogOut size={18} className="text-red-650 animate-pulse" />
                      <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Alert Warning</span>
                    </>
                  )}
                </div>

                <button 
                  onClick={() => setActiveSection(null)}
                  className="p-1.5 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition outline-none cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body Content Inside Drawer */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">

                {/* 1. MY INFORMATION DRAWER CONTENT */}
                {activeSection === 'info' && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                      📝 Kripya apne account verification credentials sahi bharein taaki payment instant unlock ho sake.
                    </p>

                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mascot Full Username</label>
                        <div className="relative flex items-center">
                          <User size={14} className="text-slate-400 absolute left-3" />
                          <input 
                            type="text" 
                            disabled 
                            value={profile.name} 
                            className="w-full bg-slate-50 text-slate-800 font-bold text-xs p-3.5 pl-10 rounded-2xl border border-slate-200/75 select-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Email Address</label>
                        <div className="relative flex items-center">
                          <Mail size={14} className="text-slate-400 absolute left-3" />
                          <input 
                            type="email" 
                            value={localMail} 
                            onChange={(e) => setLocalMail(e.target.value)}
                            className="w-full bg-white text-slate-800 font-bold text-xs p-3.5 pl-10 rounded-2xl border border-slate-200 hover:border-slate-350 focus:border-slate-500 transition outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Registered OTP Phone Number</label>
                        <div className="relative flex items-center">
                          <Phone size={14} className="text-slate-400 absolute left-3" />
                          <input 
                            type="text" 
                            value={localPhone} 
                            onChange={(e) => setLocalPhone(e.target.value)}
                            className="w-full bg-white text-slate-800 font-bold text-xs p-3.5 pl-10 rounded-2xl border border-slate-200 hover:border-slate-350 focus:border-slate-500 transition outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Instant Withdrawal UPI Handle ID</label>
                        <div className="relative flex items-center">
                          <CreditCard size={14} className="text-slate-400 absolute left-3" />
                          <input 
                            type="text" 
                            value={localUpi} 
                            onChange={(e) => setLocalUpi(e.target.value)}
                            className="w-full bg-white text-slate-800 font-bold text-xs p-3.5 pl-10 rounded-2xl border border-slate-200 hover:border-slate-350 focus:border-slate-500 transition outline-none"
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 ml-1 mt-1 block">Yhi handle withdrawals section me update ho jata hai.</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">State Of Residence / Rajya</label>
                        <div className="relative flex items-center">
                          <MapPin size={14} className="text-slate-400 absolute left-3" />
                          <input 
                            type="text" 
                            value={localState} 
                            onChange={(e) => setLocalState(e.target.value)}
                            className="w-full bg-white text-slate-800 font-bold text-xs p-3.5 pl-10 rounded-2xl border border-slate-200 hover:border-slate-350 focus:border-slate-500 transition outline-none"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          onChangeName(profile.name); // Keeps existing
                          alert("🎉 Personal Information details updated successfully inside temporary verification cache!");
                          setActiveSection(null);
                        }}
                        className="w-full bg-red-650 hover:bg-rose-700 text-white text-xs font-black py-4 rounded-2xl shadow-md border border-red-500/10 cursor-pointer"
                      >
                        Save & Verify Info
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. ACHIEVEMENTS DRAWER CONTENT */}
                {activeSection === 'achievements' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-600 to-rose-650 p-4 rounded-2xl text-white text-left relative overflow-hidden shadow">
                      <Trophy size={48} className="absolute -right-4 -bottom-2 text-white/10 rotate-12" />
                      <span className="text-[9px] font-black uppercase tracking-widest block opacity-75">Trophy progress ledger</span>
                      <h4 className="text-base font-extrabold mt-0.5">Leaderboard Badges & Tier</h4>
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[8px] font-bold w-fit mt-1.5 tracking-wider uppercase">
                        Current Tier: Scholar Plus ⭐
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {achievements.map((item) => (
                        <div key={item.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-left">
                          <div className="flex-1 space-y-1">
                            <h5 className="text-xs font-black text-slate-900 leading-none">{item.title}</h5>
                            <p className="text-[10px] text-slate-400 font-medium leading-tight">{item.desc}</p>
                            <span className="text-[9px] text-red-650 font-black block">{item.reward}</span>
                          </div>

                          {item.status === 'claimed' && (
                            <span className="bg-slate-200 text-slate-400 text-[9px] font-semibold px-2 py-1.5 rounded-xl border border-slate-300/30 flex items-center gap-1 pointer-events-none uppercase">
                              <Check size={11} /> Claimed
                            </span>
                          )}

                          {item.status === 'claimable' && (
                            <button
                              onClick={() => handleClaimReward(item.id, item.title, item.reward)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-[9px] font-black px-2.5 py-1.5 rounded-xl border border-yellow-500/20 shadow-sm flex items-center gap-1 cursor-pointer transition uppercase text-center"
                            >
                              <Sparkles size={11} className="text-slate-800 rotate-12" /> Claim
                            </button>
                          )}

                          {item.status === 'locked' && (
                            <span className="bg-slate-100 text-slate-400 text-[9px] font-semibold px-2 py-1.5 rounded-xl border border-slate-200 select-none uppercase">
                              Locked
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. MY ACTIVITY DRAWER CONTENT */}
                {activeSection === 'activity' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 text-left">
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-black block">Accuracy</span>
                        <p className="text-xl font-black mt-1 text-red-650">84.5%</p>
                        <p className="text-[9px] text-slate-400 font-semibold mt-1">Total correctness score</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 text-left">
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-black block">Hours Spent</span>
                        <p className="text-xl font-black mt-1 text-slate-850">4.8 Hrs</p>
                        <p className="text-[9px] text-slate-400 font-semibold mt-1">Study times logged</p>
                      </div>
                    </div>

                    {/* Simple Custom visual chart block */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3">
                      <h4 className="text-[9px] font-black text-slate-450 uppercase tracking-widest">Dainik Rank Progression (Weekly)</h4>
                      
                      <div className="h-24 flex items-end justify-between px-2 pt-2 gap-1.5 border-b border-slate-200">
                        {[40, 55, 75, 45, 90, 85, 95].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            {/* Hover info tooltip */}
                            <span className="bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded absolute -top-4 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                              {val}%
                            </span>
                            {/* Visual bar graph */}
                            <div 
                              style={{ height: `${val}%` }} 
                              className={`w-4 rounded-t-md transition-all duration-300 ${
                                idx === 6 
                                  ? 'bg-red-650' 
                                  : 'bg-gradient-to-t from-slate-200 to-slate-300 group-hover:from-red-300 group-hover:to-red-400'
                              }`}
                            ></div>
                            <span className="text-[8px] text-slate-400 font-black mt-1 uppercase select-none">
                              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Join Contests History</h4>

                    <div className="space-y-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-800">SSC CGL Mock Contest 01</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5">Attempted: 50 | Correct: 48</p>
                        </div>
                        <span className="bg-green-550 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg select-none">Win ₹1,200</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-800">UPSC Special (History MCQ)</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5">Attempted: 20 | Correct: 18</p>
                        </div>
                        <span className="bg-green-550 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg select-none">Win ₹500</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-800">Railway Group D GS Free Practice</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5">Attempted: 30 | Correct: 25</p>
                        </div>
                        <span className="bg-slate-250 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-lg select-none">Free Practice</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SETTINGS DRAWER CONTENT */}
                {activeSection === 'settings' && (
                  <div className="space-y-4">
                    
                    {/* Language selector selection */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-left">Language Settings / Bhasha</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setCurrentLang('en');
                            alert("English language selection active!");
                          }}
                          className={`py-2 rounded-xl text-xs font-black border transition ${
                            currentLang === 'en'
                              ? 'bg-red-650 border-red-500 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => {
                            setCurrentLang('hi');
                            alert("हिंदी भाषा विकल्प सक्रिय किया गया!");
                          }}
                          className={`py-2 rounded-xl text-xs font-black border transition ${
                            currentLang === 'hi'
                              ? 'bg-red-650 border-red-500 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          हिंदी (Hindi)
                        </button>
                      </div>
                    </div>

                    {/* IOS STYLE TOGGLE SWITCHES */}
                    <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden divide-y divide-slate-100">
                      
                      {/* Switch 1: SOUND */}
                      <div className="p-4 flex justify-between items-center text-left">
                        <div>
                          <h5 className="text-xs font-black text-slate-900">Background Audio / Sound FX</h5>
                          <p className="text-[10px] text-slate-400 leading-none mt-1">Quiz feedback, clicks aur claims sound</p>
                        </div>
                        <button
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            soundEnabled ? 'bg-red-650' : 'bg-slate-250'
                          }`}
                        >
                          <span 
                            className={`w-4 h-4 bg-white rounded-full absolute shadow transition-all duration-200 ${
                              soundEnabled ? 'left-6' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Switch 2: HAPTICS */}
                      <div className="p-4 flex justify-between items-center text-left">
                        <div>
                          <h5 className="text-xs font-black text-slate-900">Vibrations & Feedbacks</h5>
                          <p className="text-[10px] text-slate-400 leading-none mt-1">Dainik events click screen vibrations</p>
                        </div>
                        <button
                          onClick={() => setVibeEnabled(!vibeEnabled)}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            vibeEnabled ? 'bg-red-650' : 'bg-slate-250'
                          }`}
                        >
                          <span 
                            className={`w-4 h-4 bg-white rounded-full absolute shadow transition-all duration-200 ${
                              vibeEnabled ? 'left-6' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Switch 3: NOTIFICATIONS */}
                      <div className="p-4 flex justify-between items-center text-left">
                        <div>
                          <h5 className="text-xs font-black text-slate-900">Push App Tickers (FCM Alert)</h5>
                          <p className="text-[10px] text-slate-400 leading-none mt-1">Naye live contests notifications update</p>
                        </div>
                        <button
                          onClick={() => setRemindersEnabled(!remindersEnabled)}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            remindersEnabled ? 'bg-red-650' : 'bg-slate-250'
                          }`}
                        >
                          <span 
                            className={`w-4 h-4 bg-white rounded-full absolute shadow transition-all duration-200 ${
                              remindersEnabled ? 'left-6' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Switch 4: SMS Reminders */}
                      <div className="p-4 flex justify-between items-center text-left">
                        <div>
                          <h5 className="text-xs font-black text-slate-900">SMS / OTP Reminder Updates</h5>
                          <p className="text-[10px] text-slate-400 leading-none mt-1">Withdrawals confirmation updates instant text</p>
                        </div>
                        <button
                          onClick={() => setSmsEnabled(!smsEnabled)}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            smsEnabled ? 'bg-red-650' : 'bg-slate-250'
                          }`}
                        >
                          <span 
                            className={`w-4 h-4 bg-white rounded-full absolute shadow transition-all duration-200 ${
                              smsEnabled ? 'left-6' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* 5. SUPPORT CHAT DRAWER CONTENT */}
                {activeSection === 'chat' && (
                  <div className="flex flex-col h-[52vh] text-left">
                    {/* Chat Messages flow log */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs text-left relative ${
                            msg.sender === 'user'
                              ? 'bg-red-650 text-white rounded-tr-none ml-auto'
                              : 'bg-slate-100 text-slate-800 rounded-tl-none mr-auto border border-slate-250/20'
                          }`}
                        >
                          <p className="leading-snug select-all whitespace-pre-wrap">{msg.text}</p>
                          <span className={`text-[8.5px] mt-1.5 block opacity-60 text-right font-medium`}>
                            {msg.time}
                          </span>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-3 text-xs w-20 flex items-center justify-center space-x-1.5 animate-pulse border border-slate-200">
                          <CircleDot size={9} className="animate-bounce" />
                          <span className="font-bold">Typing...</span>
                        </div>
                      )}

                      <div ref={chatBottomRef}></div>
                    </div>

                    {/* Pre-configured Fast Tap doubts triggers */}
                    <div className="py-2.5 flex gap-2 overflow-x-auto shrink-0 scrollbar-none select-none">
                      {[
                        "Refund policy?",
                        "Withdrawal pending limit?",
                        "Razorpay issues?",
                        "Gemini generation issue?"
                      ].map((hint, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(hint)}
                          className="bg-red-50 hover:bg-red-100 text-red-650 text-[10px] font-black py-1 px-3 rounded-full border border-red-200/40 transition shrink-0 whitespace-nowrap cursor-pointer"
                        >
                          ❓ {hint}
                        </button>
                      ))}
                    </div>

                    {/* Input send slot */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage(typedMessage);
                      }}
                      className="border-t border-slate-100 pt-3 flex gap-2 shrink-0 items-center"
                    >
                      <input
                        type="text"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        placeholder="Hindi ya English me likhein..."
                        className="flex-1 bg-slate-50 border border-slate-200 focus:border-red-500 rounded-2xl px-4 py-3 text-xs outline-none transition font-medium"
                      />
                      <button 
                        type="submit"
                        disabled={!typedMessage.trim()}
                        className="p-3 bg-red-650 hover:bg-rose-700 disabled:opacity-45 text-white rounded-2xl transition cursor-pointer"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>
                )}

                {/* 6. FAQs / ACCORDIONS HELP LIST */}
                {activeSection === 'help' && (
                  <div className="space-y-4 text-left">
                    <p className="text-[10px] text-slate-500 bg-red-50/50 p-3 rounded-2xl border border-red-200/20">
                      💡 <strong>Instant Support:</strong> Niche diye prashno pr tap kar ke instantaneous answers payein. Agar koi additional doubt hai, toh chat expert counter try karein.
                    </p>

                    <div className="space-y-2">
                      {faqData.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-50 rounded-2xl border border-slate-150 overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => setFaqExpanded(faqExpanded === idx ? null : idx)}
                            className="w-full p-4 flex justify-between items-center text-xs font-black text-slate-800 text-left outline-none cursor-pointer hover:bg-slate-100/50"
                          >
                            <span>🇮🇳 {item.q}</span>
                            {faqExpanded === idx ? <ChevronUp size={14} className="text-red-600" /> : <ChevronDown size={14} className="text-slate-400" />}
                          </button>

                          <AnimatePresence>
                            {faqExpanded === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-200/50"
                              >
                                <p className="p-4 text-[10.5px] text-slate-500 bg-white leading-relaxed whitespace-pre-line select-all">
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. LOGOUT WARNING CONFIRM SHIELDS */}
                {activeSection === 'logout' && (
                  <div className="space-y-5 py-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2 border border-red-200/40">
                      <LogOut size={28} className="text-red-650 animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-slate-900">Are you sure you want to log out?</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        OTP based credential session ko log out karne par aapki dynamic activity and cash matches summary safe backup ho jayenge.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <button
                        onClick={() => setActiveSection(null)}
                        className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-2xl transition cursor-pointer"
                      >
                        Bilkul Nahi / Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (onLogout) {
                            onLogout();
                          } else {
                            alert("👋 Logged out from temporary session successfully! Game state resetting.");
                            window.location.reload();
                          }
                        }}
                        className="py-3.5 bg-red-650 hover:bg-red-750 text-white text-xs font-black rounded-2xl transition cursor-pointer border border-red-500/20 shadow-md"
                      >
                        Haan, session end karein
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
