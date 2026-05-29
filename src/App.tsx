import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, X, AlertCircle } from 'lucide-react';

import { ActiveTab, Contest, Transaction, LeaderboardPlayer, UserProfile } from './types';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomeTab from './components/HomeTab';
import ContestsTab from './components/ContestsTab';
import WalletTab from './components/WalletTab';
import LeaderboardTab from './components/LeaderboardTab';
import ProfileTab from './components/ProfileTab';
import QuizModal from './components/QuizModal';
import InteractiveModals from './components/InteractiveModals';
import AdminPanel from './components/AdminPanel';
import AuthScreen from './components/AuthScreen';
import NavigationDrawer from './components/NavigationDrawer';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('admin') === 'true';
    } catch (_) {
      return false;
    }
  });
  const [viewMode, setViewMode] = useState<'user' | 'admin'>('user');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fallback passcode unlock option for author/admin
  const handleLogoMultiTap = () => {
    const code = prompt('🔐 Enter Admin Authentication Code to access Admin Panel:');
    if (code === 'admin99' || code === 'admin123') {
      setIsAdminAuthorized(true);
      setViewMode('admin');
      triggerToast('💻 Admin access authorized! Mode switched.');
    } else if (code !== null) {
      alert('❌ Invalid admin authentication code!');
    }
  };
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeModal, setActiveModal] = useState<'addMoney' | 'withdraw' | 'friendBattle' | 'teamBattle' | 'referEarn' | 'shareScore' | 'editProfile' | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Contest | null>(null);
  
  // Custom interactive system-wide alerts/Toasts state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // 1. Balance state: Starts at 1250.50 exactly matching the mockup header
  const [walletBalance, setWalletBalance] = useState<number>(1250.50);

  // 2. Profile state: Starts with AR (Arjun Raj) Level 12, matching the 61.25% XP calculation (2450/4000)
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Arjun Raj',
    level: 12,
    avatarText: 'AR',
    xp: 2450,
    maxXp: 4000,
    quizzesPlayed: 245,
    contestsWon: 78,
    totalWinnings: 12550,
    upiId: 'arjunraj@upi',
    referralCode: 'UDAN500',
    avatarUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop',
  });

  // 3. Mock Exams list state
  const [contests, setContests] = useState<Contest[]>([
    {
      id: 'ssc_mega',
      title: 'SSC CGL Tier-1 Mega Mock',
      subject: '100 Questions • 60 Mins • General SSC Syllabus',
      category: 'SSC',
      status: 'live',
      entryFee: 29,
      totalPrize: 50000,
      totalSlots: 5000,
      registeredSlots: 1245,
      durationMinutes: 60,
      totalQuestions: 100,
      hasRegistered: false,
      isTaken: false,
    },
    {
      id: 'railway_grp_d',
      title: 'Railway Group D Special 🚆',
      subject: '80 questions • 45 Mins • Technical Mock math',
      category: 'Railway',
      status: 'upcoming',
      entryFee: 19,
      totalPrize: 25000,
      totalSlots: 2000,
      registeredSlots: 856,
      durationMinutes: 45,
      totalQuestions: 80,
      hasRegistered: false,
      isTaken: false,
    },
    {
      id: 'up_police_const',
      title: 'UP Police Constable Battle 👮',
      subject: '60 Questions • 30 Mins • Practice GS/Civics mock',
      category: 'UP Police',
      status: 'upcoming',
      entryFee: 0,
      totalPrize: 10000,
      totalSlots: 2000,
      registeredSlots: 312,
      durationMinutes: 30,
      totalQuestions: 60,
      hasRegistered: false,
      isTaken: false,
    },
    {
      id: 'gk_history',
      title: 'GS History practice quiz 📖',
      subject: '50 Questions • 30 Mins • Ancient/Medieval History',
      category: 'Other',
      status: 'completed',
      entryFee: 10,
      totalPrize: 1000,
      totalSlots: 100,
      registeredSlots: 100,
      durationMinutes: 30,
      totalQuestions: 50,
      hasRegistered: true,
      isTaken: true,
      score: 4,
      rewards: 'Won ₹100',
    }
  ]);

  // 4. Passbook transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn_1',
      title: 'Added Money via UPI Payload',
      amount: 500.00,
      type: 'deposit',
      timestamp: 'Today, 10:30 AM',
      status: 'completed',
    },
    {
      id: 'txn_2',
      title: 'Contest Entry: SSC CGL Mega',
      amount: 29.00,
      type: 'contest_entry',
      timestamp: 'Yesterday, 04:15 PM',
      status: 'completed',
    },
    {
      id: 'txn_3',
      title: 'Rewards Won: GS History League',
      amount: 100.00,
      type: 'winnings',
      timestamp: '24 May 2026, 06:12 PM',
      status: 'completed',
    }
  ]);

  // 5. Dynamic leaderboard list state
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([
    { rank: 1, name: 'Rahul Kumar', avatarText: 'RK', score: 5105, winnings: '₹15,000', badge: '👑 Winner', correctAnswers: 5, timeSpentSeconds: 15 },
    { rank: 2, name: 'Arjun Singh', avatarText: 'AS', score: 5096, winnings: '₹10,000', badge: 'Challenger', correctAnswers: 5, timeSpentSeconds: 24 },
    { rank: 3, name: 'Sneha Verma', avatarText: 'SV', score: 4108, winnings: '₹5,000', badge: 'Star Player', correctAnswers: 4, timeSpentSeconds: 12 },
    { rank: 4, name: 'Arjun Raj', avatarText: 'AR', score: 4100, winnings: '₹2,000', badge: 'Super Master', isCurrentUser: true, correctAnswers: 4, timeSpentSeconds: 20 },
    { rank: 5, name: 'Priya Sharma', avatarText: 'PS', score: 3102, winnings: '₹1,500', correctAnswers: 3, timeSpentSeconds: 18 },
    { rank: 6, name: 'Vikash Jha', avatarText: 'VJ', score: 2106, winnings: '₹1,000', correctAnswers: 2, timeSpentSeconds: 14 },
    { rank: 7, name: 'Neha Patel', avatarText: 'NP', score: 1110, winnings: '₹800', correctAnswers: 1, timeSpentSeconds: 10 },
  ]);

  // Action: Enroll in a contest
  const handleEnrollContest = (contestId: string) => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return;

    if (contest.entryFee > walletBalance) {
      triggerToast(`⚠️ Wallet main paryapt balance nahi hai! SSC Mega admission ke liye ₹${contest.entryFee} chahiye.`);
      setActiveModal('addMoney');
      return;
    }

    // Deduct and register
    setWalletBalance((prev) => prev - contest.entryFee);
    setContests((prev) =>
      prev.map((c) =>
        c.id === contestId
          ? { ...c, hasRegistered: true, registeredSlots: c.registeredSlots + 1 }
          : c
      )
    );

    // Create transaction entry
    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      title: `Contest Entry: ${contest.title}`,
      amount: contest.entryFee,
      type: 'contest_entry',
      timestamp: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [newTxn, ...prev]);

    triggerToast(`🎉 Registered! Ab aap click karke mock exam shuru kar sakte hain.`);
  };

  // Action: Collect score and awards from live quiz modal
  const handleFinishQuiz = (score: number, rewardEarned: number, timeSpentSeconds: number) => {
    if (!activeQuiz) return;

    // Reset quiz modal
    const targetQuizId = activeQuiz.id;
    setActiveQuiz(null);

    // Update contest status to taken
    setContests((prev) =>
      prev.map((c) =>
        c.id === targetQuizId
          ? {
              ...c,
              isTaken: true,
              score,
              rewards: rewardEarned > 0 ? `Won ₹${rewardEarned} (Time: ${timeSpentSeconds}s)` : `Rank Saved (${timeSpentSeconds}s)`,
            }
          : c
      )
    );

    // Add reward balance
    if (rewardEarned > 0) {
      setWalletBalance((prev) => prev + rewardEarned);
      
      // Transaction entry
      const winTxn: Transaction = {
        id: `txn_${Date.now()}`,
        title: `Winnings: ${activeQuiz.title}`,
        amount: rewardEarned,
        type: 'winnings',
        timestamp: 'Just now',
        status: 'completed',
      };
      setTransactions((prev) => [winTxn, ...prev]);
    }

    // Level up / XP logic: Earn 500 XP per exam taken!
    const earnedXp = 500;
    let nextXp = profile.xp + earnedXp;
    let nextLevel = profile.level;
    if (nextXp >= profile.maxXp) {
      nextXp = nextXp - profile.maxXp;
      nextLevel += 1;
      triggerToast(`🌟 Level UP! Congratulations, aap ab Level ${nextLevel} par pahunch gaye hain!`);
    }

    setProfile((prev) => ({
      ...prev,
      level: nextLevel,
      xp: nextXp,
      quizzesPlayed: prev.quizzesPlayed + 1,
      contestsWon: rewardEarned > 0 ? prev.contestsWon + 1 : prev.contestsWon,
      totalWinnings: prev.totalWinnings + rewardEarned,
    }));

    // Update leaderboard player score for real feedback using Accuracy-plus-Speed formula
    // Score = (Correct Answers * 1000) + (120 - Time Spent Seconds)
    setPlayers((prev) => {
      const updated = prev.map((p) => {
        if (p.isCurrentUser) {
          const computedScore = (score * 1000) + (120 - timeSpentSeconds);
          const oldWinningsVal = parseFloat(p.winnings.replace(/[^\d]/g, '')) || 0;
          return {
            ...p,
            correctAnswers: score,
            timeSpentSeconds,
            score: computedScore,
            winnings: `₹${(oldWinningsVal + rewardEarned).toLocaleString()}`,
          };
        }
        return p;
      });

      // Strict Sorting: 1st priority: highest correct answers (descending). 2nd priority: lowest time spent seconds (ascending).
      const sorted = [...updated].sort((a, b) => {
        const correctA = a.correctAnswers ?? 0;
        const correctB = b.correctAnswers ?? 0;
        if (correctB !== correctA) {
          return correctB - correctA; // More correct answers wins
        }
        const timeA = a.timeSpentSeconds ?? 120;
        const timeB = b.timeSpentSeconds ?? 120;
        return timeA - timeB; // Lower time taken (faster speed) wins
      });

      // Re-assign ranks 1 to N dynamically
      return sorted.map((p, idx) => ({
        ...p,
        rank: idx + 1,
        badge: idx === 0 ? '👑 Winner' : idx === 1 ? 'Challenger' : idx === 2 ? 'Star Player' : p.badge,
      }));
    });

    triggerToast(`🏆 Exam Submitted! Marks: ${score}/5 in ${timeSpentSeconds} seconds. Wallet & Leaderboard updated.`);
    setActiveTab('leaderboard'); // Switch to leaderboard so the user immediately sees the tie-breaking ranks
    setActiveModal('shareScore'); // Auto-trigger customized social media share scorecard modal
  };

  // Action: Add Money (Deposit)
  const handleAddMoney = (amount: number) => {
    setWalletBalance((prev) => prev + amount);

    const depTxn: Transaction = {
      id: `txn_${Date.now()}`,
      title: 'Added Money to Wallet',
      amount,
      type: 'deposit',
      timestamp: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [depTxn, ...prev]);

    triggerToast(`🚀 Success! ₹${amount} aapke wallet balance mein safaltapurvak add ho gaya hai.`);
  };

  // Action: UPI Withdrawal
  const handleWithdraw = (amount: number, upiId: string): boolean => {
    if (amount > walletBalance) {
      alert('Balance insufficient!');
      return false;
    }

    setWalletBalance((prev) => prev - amount);

    const withTxn: Transaction = {
      id: `txn_${Date.now()}`,
      title: `Withdrew via UPI to ${upiId}`,
      amount,
      type: 'withdrawal',
      timestamp: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [withTxn, ...prev]);

    triggerToast(`🏦 Direct Bank Instant Transfer has initiated successfully! Amount ₹${amount} sent to your UPI.`);
    return true;
  };

  // Action: Refer and Earn Reward Simulation
  const handleReferralBonus = (bonusAmount: number) => {
    setWalletBalance((prev) => prev + bonusAmount);
    
    const promoTxn: Transaction = {
      id: `txn_${Date.now()}`,
      title: 'Referral Bonus: Friend Joined',
      amount: bonusAmount,
      type: 'referral',
      timestamp: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [promoTxn, ...prev]);

    triggerToast(`🎁 Referral Reward! Friend registered using UDAN500. ₹${bonusAmount} Bonus added to Winnings.`);
  };

  // Action: 1v1 Battle Game launched
  const handleStart1v1BattleQuiz = (subject: string, fee: number) => {
    // Deduct entry fee
    setWalletBalance((prev) => prev - fee);

    const matchTxn: Transaction = {
      id: `txn_${Date.now()}`,
      title: `1v1 Match Fee: ${subject}`,
      amount: fee,
      type: 'contest_entry',
      timestamp: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [matchTxn, ...prev]);

    // Create custom battle quiz object
    const battleQuiz: Contest = {
      id: `battle_${Date.now()}`,
      title: `1v1 Battle: ${subject} Exam ⚔️`,
      subject: `5 Blitz MCQ Questions • High Speed Battle Arena`,
      category: 'Other',
      status: 'live',
      entryFee: fee,
      totalPrize: Math.round(fee * 1.8),
      totalSlots: 2,
      registeredSlots: 2,
      durationMinutes: 2,
      totalQuestions: 5,
      hasRegistered: true,
      isTaken: false,
    };

    setActiveQuiz(battleQuiz);
  };

  // Change Nickname & Avatar in user profile with real-time propagation
  const handleChangeName = (newName: string, newAvatarUrl?: string) => {
    const trimmed = newName.trim();
    const txt = (trimmed || 'Arjun Raj').substring(0, 2).toUpperCase();
    setProfile((prev) => ({ 
      ...prev, 
      name: trimmed || prev.name, 
      avatarText: txt,
      avatarUrl: newAvatarUrl || prev.avatarUrl 
    }));
    setPlayers((prev) =>
      prev.map((p) => (p.isCurrentUser ? { ...p, name: trimmed || p.name, avatarText: txt } : p))
    );
  };

  // Filter default featured contest
  const sscMockContest = contests.find((c) => c.id === 'ssc_mega') || contests[0];

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col selection:bg-red-250 selection:text-red-900 leading-normal antialiased text-slate-850">
      
      {/* PORTAL CONTROL OVERLAY HEADER */}
      {isAdminAuthorized && (
        <div className="bg-slate-900 border-b border-white/10 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-white text-xs shrink-0 z-55 gap-3">
          <div className="flex items-center gap-2 font-bold text-red-500 uppercase tracking-wider select-none">
            <span className="w-2 h-2 rounded-full bg-red-650 animate-pulse"></span>
            Udhan Exam League Portal Control
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-lg">
            <button 
              onClick={() => setViewMode('admin')} 
              className={`px-4 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'admin' 
                  ? 'bg-red-650 text-white shadow-xl' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💻 FULL ADMIN PORTAL
            </button>
            <button 
              onClick={() => setViewMode('user')} 
              className={`px-4 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'user' 
                  ? 'bg-red-650 text-white shadow-xl' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📱 USER QUIZ MOBILE APP
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 w-full flex justify-center items-stretch bg-slate-950 p-0 md:p-4 overflow-y-auto">
        {viewMode === 'admin' ? (
          <div className="w-full max-w-7xl mx-auto flex flex-col">
            <AdminPanel walletBalance={walletBalance} onShowToast={triggerToast} />
          </div>
        ) : (
          /* Container simulating Centered Mobile Form Layout */
          <div className={`w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative overflow-x-hidden border-x border-slate-200 mx-auto ${isLoggedIn ? 'pb-20' : ''}`}>
            
            {!isLoggedIn ? (
              <AuthScreen
                onLoginSuccess={(userData) => {
                  setProfile((prev) => ({
                    ...prev,
                    name: userData.name,
                    avatarText: userData.name.substring(0, 2).toUpperCase()
                  }));
                  // Also update leaderboard players to display the registered name
                  setPlayers((prev) =>
                    prev.map((p) =>
                      p.isCurrentUser
                        ? { ...p, name: userData.name, avatarText: userData.name.substring(0, 2).toUpperCase() }
                        : p
                    )
                  );
                  setIsLoggedIn(true);
                  triggerToast(`Swagat hai, ${userData.name}! Safaltapurvak login ho chuke hain.`);
                }}
              />
            ) : (
              <>
                {/* TOP BAR HEADER */}
                <Header
                  currentTab={activeTab}
                  onSwitchTab={setActiveTab}
                  walletBalance={walletBalance}
                  onShowToast={triggerToast}
                  onUnlockAdmin={handleLogoMultiTap}
                  onOpenMenu={() => setIsDrawerOpen(true)}
                  profile={profile}
                />

                {/* LIVE TICKER */}
                <div className="bg-yellow-400 text-slate-900 py-2 px-3 border-b border-yellow-500 font-extrabold text-[11px] flex items-center overflow-hidden z-40 shadow-sm shrink-0">
                  <span className="bg-red-650 text-white text-[9px] font-black px-2 py-0.5 rounded mr-2 animate-pulse flex items-center gap-1 shrink-0 shadow-sm">
                    🔥 LIVE UPDATES
                  </span>
                  <div className="ticker-wrap flex-1">
                    <div className="ticker-item text-[10px] font-bold">
                      🚀 SSC CGL mock registration closing in 2 hours! Enroll ASAP | Winner Rohit ne jeeta ₹12,500 Cash! | Next mega contest UPSC Special starts at 3:00 PM! | Apne dosto ko refer karein aur payein ₹500 tak ka instant bonus!
                    </div>
                  </div>
                </div>

                {/* Dynamic dismissable system Alerts/Toast panels */}
                <AnimatePresence>
                  {toastMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-18 left-4 right-4 z-55 bg-slate-900 text-white text-xs font-semibold py-3 px-4 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-yellow-400 shrink-0" />
                        <span className="leading-snug">{toastMessage}</span>
                      </div>
                      <button
                        onClick={() => setToastMessage(null)}
                        className="text-white hover:text-red-200 p-0.5 rounded-full hover:bg-white/10 transition shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* MAIN BODY CONTEXT SECTION */}
                <main className="flex-1 p-4 bg-gray-50/80 overflow-y-auto">
                  {activeTab === 'home' && (
                    <HomeTab
                      onSwitchTab={setActiveTab}
                      onOpenModal={setActiveModal}
                      featuredContest={sscMockContest}
                      contests={contests}
                      onEnrollContest={handleEnrollContest}
                      onLaunchQuiz={setActiveQuiz}
                    />
                  )}

                  {activeTab === 'contests' && (
                    <ContestsTab
                      contests={contests}
                      onEnrollContest={handleEnrollContest}
                      onLaunchQuiz={setActiveQuiz}
                    />
                  )}

                  {activeTab === 'wallet' && (
                    <WalletTab
                      balance={walletBalance}
                      transactions={transactions}
                      onOpenModal={setActiveModal}
                    />
                  )}

                  {activeTab === 'leaderboard' && (
                    <LeaderboardTab players={players} />
                  )}

                  {activeTab === 'profile' && (
                    <ProfileTab
                      profile={profile}
                      onChangeName={handleChangeName}
                      onOpenModal={setActiveModal}
                      onLogout={() => {
                        setIsLoggedIn(false);
                        triggerToast('👋 Safaltapoorvak log out ho chuke hain!');
                      }}
                    />
                  )}
                </main>

                {/* BOTTOM ACCENT BAR NAVIGATION */}
                <BottomNavigation currentTab={activeTab} onSwitchTab={setActiveTab} />

                {/* INTERACTIVE FULL-SCREEN MCQ TEST MAKER OVERLAY */}
                <AnimatePresence>
                  {activeQuiz && (
                    <QuizModal
                      contest={activeQuiz}
                      onClose={() => setActiveQuiz(null)}
                      onFinishQuiz={handleFinishQuiz}
                    />
                  )}
                </AnimatePresence>

                {/* UNIFIED DIALOG POPUPS */}
                <AnimatePresence>
                  {activeModal && (
                    <InteractiveModals
                      activeModal={activeModal}
                      onClose={() => setActiveModal(null)}
                      walletBalance={walletBalance}
                      onAddMoneyAction={handleAddMoney}
                      onWithdrawAction={handleWithdraw}
                      onReferEarnSuccess={handleReferralBonus}
                      referralCode={profile.referralCode}
                      onStart1v1Battle={handleStart1v1BattleQuiz}
                      profile={profile}
                      onUpdateProfile={handleChangeName}
                    />
                  )}
                </AnimatePresence>

                {/* SLIDE-OUT MENU WITH INTERACTIVE CHAT WITH FRIENDS SECTION */}
                <AnimatePresence>
                  {isDrawerOpen && (
                    <NavigationDrawer
                      isOpen={isDrawerOpen}
                      onClose={() => setIsDrawerOpen(false)}
                      currentTab={activeTab}
                      onSwitchTab={setActiveTab}
                      userProfile={profile}
                      friendsList={players}
                      onShowToast={triggerToast}
                    />
                  )}
                </AnimatePresence>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
