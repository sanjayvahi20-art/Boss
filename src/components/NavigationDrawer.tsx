import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Circle, 
  Sparkles, 
  Home, 
  Trophy, 
  Wallet, 
  Award, 
  User, 
  ChevronRight,
  Info,
  ShoppingBag,
  GraduationCap,
  BookOpen,
  Coins
} from 'lucide-react';
import { ActiveTab, UserProfile, LeaderboardPlayer } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: ActiveTab;
  onSwitchTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  friendsList: LeaderboardPlayer[];
  onShowToast?: (msg: string) => void;
}

interface Message {
  sender: 'me' | 'friend';
  text: string;
  time: string;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  currentTab,
  onSwitchTab,
  userProfile,
  friendsList,
  onShowToast,
}: NavigationDrawerProps) {
  // Navigation sub-view: 'menu' (main menu options) or 'chat-list' (friends list) or 'chat-room' (individual active chat)
  const [drawerMode, setDrawerMode] = useState<'menu' | 'chat-list' | 'chat-room'>('menu');
  const [selectedFriend, setSelectedFriend] = useState<LeaderboardPlayer | null>(null);
  const [typedMessage, setTypedMessage] = useState('');

  // Selected sub-service dialog view state
  const [activeDialogService, setActiveDialogService] = useState<'marketplace' | 'admission' | 'course' | 'loan' | null>(null);

  // Dynamic retrieve services metadata
  const getServicesData = () => {
    try {
      const saved = localStorage.getItem('udan_services_data');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      marketplace: {
        link: "https://example.com/shop",
        items: [
          { id: 'm1', name: "SSC GK Booster Book 2026", price: "₹149", description: "Compiled by Udan teachers. 1500+ solved objective questions." },
          { id: 'm2', name: "UPSC GS Hand-written core revision notes", price: "₹299", description: "Full prelims & mains core points with revision mindmaps." }
        ]
      },
      admission: {
        link: "https://example.com/admission-form",
        items: [
          { id: 'a1', name: "Delhi Academy Physical coaching center league admission", price: "₹9,999", description: "Offline physical training for Delhi Police Constable under top coaches." },
          { id: 'a2', name: "Super 30 scholarship test online register status", price: "⭐ Free Entrance", description: "Apply online for classroom dynamic preparation. Entrance test scheduled for coming Sunday." }
        ]
      },
      course: {
        link: "https://example.com/free-course-sample",
        items: [
          { id: 'c1', name: "Complete SSC quantitative mathematical formula guide", price: "₹499", description: "65 hours high definition videos + concept notes + previous year solved formulas." },
          { id: 'c2', name: "Daily Static India General Knowledge Bullet Cards", price: "₹99", description: "1 year access to bullet cards showing dynamic General Knowledge briefs." }
        ]
      },
      loan: {
        link: "https://example.com/scholarship-loan-info",
        items: [
          { id: 'l1', name: "Zero Interest Student Exam Registration Fee Loan", price: "💰 0% Interest", description: "Get up to ₹20,000 instantly for national exam registration form fee and study guides." }
        ]
      }
    };
  };

  const servicesData = getServicesData();
  
  // Custom chat history state per friend rank to persist exchanges during study play session
  const [chatHistories, setChatHistories] = useState<Record<number, Message[]>>({
    1: [
      { sender: 'friend', text: 'Bhai! SSC Tier 1 mock check out kiya tune?', time: '09:12 AM' },
      { sender: 'friend', text: 'Kafi high-yield questions the GA section me. Maine 5/5 sahi kiye 15 seconds me! 🚀', time: '09:13 AM' },
    ],
    2: [
      { sender: 'friend', text: 'Bro, rank update dekhi math mock contest ki?', time: '08:45 AM' },
      { sender: 'friend', text: 'Accuracy badhane ke liye standard shortcuts use kiya karo 📐', time: '08:46 AM' },
    ],
    3: [
      { sender: 'friend', text: 'Hi Arjun! My GS history mock took only 12 seconds today! 🌟', time: 'Yesterday' },
      { sender: 'friend', text: 'Let\'s challenge each other in the upcoming 1v1 battle.', time: 'Yesterday' },
    ],
    5: [
      { sender: 'friend', text: 'Kya aapne referral code use kiya registration bonus ke liye? 💰', time: '07:30 AM' },
    ]
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    if (drawerMode === 'chat-room') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [drawerMode, chatHistories, selectedFriend]);

  // Handle closing reset
  const handleCloseDrawer = () => {
    setDrawerMode('menu');
    onClose();
  };

  // Switch tabs from side menu
  const handleMenuTabClick = (tab: ActiveTab) => {
    onSwitchTab(tab);
    handleCloseDrawer();
  };

  // Selecting a friend to open chat room
  const handleOpenFriendChat = (friend: LeaderboardPlayer) => {
    setSelectedFriend(friend);
    // Initialize empty list if none exists for this friend
    if (!chatHistories[friend.rank]) {
      setChatHistories(prev => ({
        ...prev,
        [friend.rank]: [
          { sender: 'friend', text: `Hey, how's your Delhi Police Constable preparation going? Join me on Udan Exam League tests! ⏱️`, time: 'Now' }
        ]
      }));
    }
    setDrawerMode('chat-room');
  };

  // Interactive simulated responses with a natural delay
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedFriend) return;

    const userMsgText = typedMessage.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'me', text: userMsgText, time: nowTime };
    
    // 1. Add user message
    setChatHistories(prev => ({
      ...prev,
      [selectedFriend.rank]: [...(prev[selectedFriend.rank] || []), userMsg]
    }));
    setTypedMessage('');

    // 2. Schedule automated realistic coaching/study peer reply
    setTimeout(() => {
      const friendReplies = [
        "Sahi bola bhai! Humlog roj mocks solve karke speed improve kar sakte hain.",
        `Haan! Aur timing algorithm mast hai. Accuracy with speeds defines our position on leaderboard! ✨`,
        `Maine abhi withdraw kiya rashi instantly paytm upi par credit ho gyi! 💸 Khelte raho.`,
        `Aao milkar general studies syllabus revise karte hain. Mera code dynamic reload ho rha h!`,
        `Chalo next live standard test par direct challenge lagate hain! 👍`,
        `Bilkul. Hum jitna jaldi answers submit karenge, utne jyada bonus ranking points generate hote hain.`
      ];
      // Pick random reply or choose based on question keywords
      let selectedReply = friendReplies[Math.floor(Math.random() * friendReplies.length)];
      if (userMsgText.toLowerCase().includes('hello') || userMsgText.toLowerCase().includes('hi')) {
        selectedReply = `Ram Ram Bhai! Kaisi chal rhi h sarkari naukri exams ki taiyari?`;
      } else if (userMsgText.toLowerCase().includes('withdraw') || userMsgText.toLowerCase().includes('paise')) {
        selectedReply = `Wallet se turant cash out (withdraw) safe mode upi par jaata hai. Maine khud verified kiya h!`;
      }
      
      const responseMsg: Message = {
        sender: 'friend',
        text: selectedReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories(prev => ({
        ...prev,
        [selectedFriend.rank]: [...(prev[selectedFriend.rank] || []), responseMsg]
      }));
    }, 1100);
  };

  if (!isOpen) return null;

  // Filter study friends from leaderboard players state (excluding self)
  const otherFriends = friendsList.filter(p => !p.isCurrentUser);

  return (
    <div className="fixed inset-0 z-100 flex overflow-hidden">
      {/* Background Back-shading Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={handleCloseDrawer}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
      />

      {/* Slide-out Menu Canvas Container */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 23, stiffness: 210 }}
        className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-30 border-r border-slate-100"
      >
        {/* Header Block / User Quick Info */}
        <div className="p-4 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative">
          <button 
            type="button"
            onClick={handleCloseDrawer}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/25 p-1 rounded-full transition"
          >
            <X size={16} />
          </button>

          <div className="flex items-center space-x-3 mt-2">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-750 font-black text-lg shadow-inner ring-4 ring-white/10 overflow-hidden">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="User Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                userProfile.avatarText
              )}
            </div>
            <div>
              <h3 className="font-sans font-black text-sm text-yellow-300 leading-none">{userProfile.name}</h3>
              <p className="text-[10px] text-red-100 font-bold mt-1">📝 Aspirant Profile Level {userProfile.level}</p>
              
              {/* Dynamic XP Progress representation */}
              <div className="w-32 bg-red-950/30 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-yellow-400 h-full rounded-full" 
                  style={{ width: `${(userProfile.xp / userProfile.maxXp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Inner Sidebar Sections */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          
          <AnimatePresence mode="wait">
            {/* SUB-VIEW 1: PRIMARY SIDEBAR MENU SELECTION */}
            {drawerMode === 'menu' && (
              <motion.div
                key="menu-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-3 space-y-4"
              >
                {/* 1. Core Navigation Links */}
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2.5 block mb-1">Services</span>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDialogService('marketplace');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition text-slate-700 hover:bg-slate-100/70 font-bold"
                    >
                      <div className="flex items-center space-x-2.5">
                        <ShoppingBag size={16} className="text-red-650" />
                        <span className="text-xs">Marketplace</span>
                      </div>
                      <span className="text-[9px] bg-red-100 text-red-700 font-mono px-1 rounded font-black">NEW</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDialogService('admission');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition text-slate-700 hover:bg-slate-100/70 font-bold"
                    >
                      <div className="flex items-center space-x-2.5">
                        <GraduationCap size={16} className="text-blue-600" />
                        <span className="text-xs">Admission</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDialogService('course');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition text-slate-700 hover:bg-slate-100/70 font-bold"
                    >
                      <div className="flex items-center space-x-2.5">
                        <BookOpen size={16} className="text-emerald-600" />
                        <span className="text-xs">Course</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDialogService('loan');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition text-slate-700 hover:bg-slate-100/70 font-bold"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Coins size={16} className="text-amber-600" />
                        <span className="text-xs">Loan</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* 2. SPECIFIC REQUESTED FEATURE: "CHAT WITH FRIENDS" BAR SECTION */}
                <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-3.5 border border-amber-500/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-600 shrink-0" />
                      Social Network Features
                    </span>
                    <span className="bg-red-600 text-white font-mono text-[8.5px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                      NEW
                    </span>
                  </div>

                  <h4 className="text-[12.5px] font-black text-slate-800 leading-none">Chat with Friends</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">
                    Interact directly with your live competitive peers! Ask question strategies, share scores or compare live speeds.
                  </p>

                  <button
                    type="button"
                    onClick={() => setDrawerMode('chat-list')}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-2 px-3 rounded-xl text-[11px] transition mt-3 flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:scale-[1.01]"
                  >
                    <MessageSquare size={13} />
                    Open Chat list ({otherFriends.length} Active Friends)
                  </button>
                </div>

                {/* Info Tip block */}
                <div className="bg-slate-100 rounded-xl p-3 flex items-start gap-2 text-slate-500 mt-4 border border-slate-200/50">
                  <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[9.5px] font-medium leading-relaxed">
                    Refer friends to gain level points, or copy your SSC mock card template directly from the scorecard buttons to WhatsApp!
                  </p>
                </div>
              </motion.div>
            )}

            {/* SUB-VIEW 2: FRIENDS LIST DIALOG SELECTOR */}
            {drawerMode === 'chat-list' && (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3"
              >
                {/* Back Link */}
                <button
                  type="button"
                  onClick={() => setDrawerMode('menu')}
                  className="flex items-center gap-1.5 text-xs text-slate-600 font-bold hover:text-red-750 pb-2 mb-2 select-none border-b border-slate-100"
                >
                  <ArrowLeft size={14} />
                  Main Menu Drawer
                </button>

                <div className="flex items-center justify-between my-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Online Study Buddies</span>
                  <span className="text-[9.5px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-extrabold flex items-center gap-1 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 block animate-pulse" />
                    {otherFriends.length} Live
                  </span>
                </div>

                {/* Friend Contacts List scrollable container */}
                <div className="space-y-1.5 mt-2">
                  {otherFriends.map((friend) => (
                    <div
                      key={friend.rank}
                      onClick={() => handleOpenFriendChat(friend)}
                      className="bg-white hover:bg-slate-100/70 hover:shadow-xs p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between cursor-pointer transition select-none"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="relative">
                          <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                            {friend.avatarText}
                          </div>
                          <span className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 leading-none truncate">{friend.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                            🏆 Rank {friend.rank} • {friend.winnings} won
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="bg-amber-100 text-amber-800 font-black text-[8px] px-1 rounded uppercase tracking-wide">
                          {friend.badge || 'PRO'}
                        </span>
                        <span className="text-[9.5px] text-red-600 font-extrabold flex items-center gap-0.5 leading-none">
                          Chat <ChevronRight size={10} className="mt-px" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SUB-VIEW 3: ACTIVE FRIEND INDIVIDUAL CHAT DIALOG */}
            {drawerMode === 'chat-room' && selectedFriend && (
              <motion.div
                key="room-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col min-h-[400px]"
              >
                {/* Back to Friend list panel header banner */}
                <div className="bg-slate-100 p-2.5 flex items-center justify-between border-b border-slate-200 select-none">
                  <button
                    type="button"
                    onClick={() => setDrawerMode('chat-list')}
                    className="flex items-center gap-1 text-xs text-slate-600 font-bold hover:text-red-750"
                  >
                    <ArrowLeft size={13} />
                    Back
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-700 truncate max-w-[120px] uppercase">
                      {selectedFriend.name}
                    </span>
                  </div>

                  <span className="text-[9px] bg-slate-800 text-white font-mono px-1 rounded font-black">
                    Rank #{selectedFriend.rank}
                  </span>
                </div>

                {/* Scrollable messages dialog viewport */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[450px]">
                  {(chatHistories[selectedFriend.rank] || []).map((msg, index) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div
                        key={index}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed font-semibold shadow-xs ${
                            isMe
                              ? 'bg-red-700 text-white rounded-br-none'
                              : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span
                            className={`text-[8.5px] block mt-1 text-right leading-none ${
                              isMe ? 'text-red-200' : 'text-slate-400'
                            }`}
                          >
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Form sending toolbar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-2 border-t border-slate-200 bg-white flex gap-1.5 sticky bottom-0 z-20"
                >
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder={`Write to ${selectedFriend.name.split(' ')[0]}...`}
                    className="flex-1 bg-slate-100 border-none rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-red-600 text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!typedMessage.trim()}
                    className="bg-red-700 hover:bg-red-800 text-white w-9 h-9 rounded-full flex items-center justify-center transition shrink-0 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 hover:scale-[1.03]"
                  >
                    <Send size={13} className="relative left-[1px]" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer info branding line inside drawer */}
        <div className="p-4 bg-slate-900 text-slate-400 text-center text-[9px] font-mono border-t border-slate-800 select-none">
          <p className="text-[10px] font-black text-slate-200 mb-0.5">🚀 UDAN EXAM LEAGUE</p>
          <p>National Competitive Database v1.4</p>
        </div>

        {/* 4. SERVICE ITEMS DETAIL POPUP DIALOG OVERLAY */}
        <AnimatePresence>
          {activeDialogService && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute inset-0 z-50 bg-white flex flex-col h-full font-sans text-slate-800 border-l border-slate-100"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 text-white flex justify-between items-center select-none shadow">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {activeDialogService === 'marketplace' && '🏪'}
                    {activeDialogService === 'admission' && '🎓'}
                    {activeDialogService === 'course' && '📚'}
                    {activeDialogService === 'loan' && '💸'}
                  </span>
                  <div className="text-left">
                    <h4 className="text-xs font-black uppercase tracking-wider text-yellow-400">
                      {activeDialogService === 'marketplace' && 'Marketplace Catalog'}
                      {activeDialogService === 'admission' && 'Admission Desk'}
                      {activeDialogService === 'course' && 'Premium Course Library'}
                      {activeDialogService === 'loan' && 'Education Loan Office'}
                    </h4>
                    <p className="text-[9px] text-slate-300 font-medium leading-none mt-0.5">Udan dynamic student support</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDialogService(null)}
                  className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1 rounded-full transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Scrollable details listing */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-left">
                
                {/* PRIMARY REDIRECT PORTAL BUTTON */}
                {servicesData[activeDialogService]?.link && (
                  <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      🌐 Open Official Web Portal
                    </div>
                    <p className="text-[10px] text-slate-550 font-semibold leading-relaxed">
                      Tap the link below to load external form registrations, direct catalogs, or support contacts.
                    </p>
                    <a
                      href={servicesData[activeDialogService].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1 bg-red-700 hover:bg-red-800 text-white font-extrabold text-[10.5px] py-2 px-3 rounded-lg shadow transition"
                    >
                      Go to Official Link <ArrowLeft size={11} className="rotate-180" />
                    </a>
                  </div>
                )}

                {/* PRODUCTS LIST TITLE */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Available Options & Benefits</span>
                  
                  <div className="space-y-3">
                    {(!servicesData[activeDialogService]?.items || servicesData[activeDialogService].items.length === 0) ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-mono bg-white rounded-xl border border-slate-200">
                        No active products. More options will be updated soon!
                      </div>
                    ) : (
                      servicesData[activeDialogService].items.map((item: any) => (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-2 text-left">
                          <div className="flex justify-between items-start gap-1">
                            <h5 className="font-bold text-xs text-slate-850 leading-tight">{item.name}</h5>
                            <span className="bg-amber-100 text-amber-800 font-mono text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{item.description}</p>
                          
                          <a
                            href={item.customLink || servicesData[activeDialogService].link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center block bg-slate-900 hover:bg-slate-950 text-white font-black text-[9.5px] py-1.5 rounded-lg transition"
                          >
                            {activeDialogService === 'marketplace' && '🛍️ Buy Option Now'}
                            {activeDialogService === 'admission' && '📋 Apply Online Now'}
                            {activeDialogService === 'course' && '🎓 Unlock Lectures'}
                            {activeDialogService === 'loan' && '💰 File Fast Application'}
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
