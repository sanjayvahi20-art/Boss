import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, BookOpen, Cpu, ToggleLeft, ToggleRight, Play, Pause, RefreshCw, 
  Wallet, Gift, ShieldCheck, Megaphone, Radio, LayoutDashboard, Search, PlusCircle, 
  Trash2, Edit, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft, FileText, Download,
  Sliders, UserCheck, Shield, Eye, Send, Sparkles, MessageSquare, AlertTriangle, Languages, Upload,
  ShoppingBag, GraduationCap, Coins
} from 'lucide-react';

interface AdminPanelProps {
  onShowToast: (msg: string) => void;
  walletBalance: number;
}

export default function AdminPanel({ onShowToast }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [contests, setContests] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any>({
    referralBonus: 500,
    dailyReward: 25,
    promoCodes: [],
    moderatorRole: 'Super Admin',
    liveChatLocked: false,
    bannerAdsEnabled: true,
    videoAdsEnabled: false
  });
  const [liveQuiz, setLiveQuiz] = useState<any>({
    contestId: 'ssc_mega',
    isPaused: false,
    activeQuestionIndex: 2,
    timerRemaining: 45,
    totalJoined: 1245
  });
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 145020,
    totalContests: 0,
    liveMatches: 0,
    withdrawRequests: 0,
    aiGeneratedQuestionsCount: 120,
    manualQuestionsCount: 450
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Dynamic Services Hub (Marketplace, Admission, Course, Loan) state
  const [servicesData, setServicesData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('udan_services_data');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      marketplace: {
        link: "https://example.com/shop",
        items: [
          { id: 'm1', name: "SSC GK Booster Book 2026", price: "₹149", description: "Compiled by dynamic Udan League teachers. 1500+ solved objective questions." },
          { id: 'm2', name: "UPSC General Studies Hand-written Notes", price: "₹299", description: "Full prelims & mains core points with revision mindmaps." }
        ]
      },
      admission: {
        link: "https://example.com/admission-form",
        items: [
          { id: 'a1', name: "Delhi Physical coaching center admission", price: "₹9,999", description: "Offline physical training for Delhi Police Constable under top coaches." },
          { id: 'a2', name: "Super 30 batch scholarship test registration", price: "⭐ Free Entrance", description: "Apply online for classroom dynamic preparation. Entrance test scheduled for coming Sunday." }
        ]
      },
      course: {
        link: "https://example.com/free-course-sample",
        items: [
          { id: 'c1', name: "Complete SSC CGL Quantitative Aptitude Series", price: "₹499", description: "65 hours high definition videos + concept notes + previous year solved formulas." },
          { id: 'c2', name: "Daily Static GK Quick Bullet Course", price: "₹99", description: "1 year access to bullet cards showing dynamic General Knowledge briefs." }
        ]
      },
      loan: {
        link: "https://example.com/scholarship-loan-info",
        items: [
          { id: 'l1', name: "Zero Interest Student Exam Fee Loan", price: "💰 0% Interest", description: "Get up to ₹20,000 instantly for national exam registration form fee and study guides." }
        ]
      }
    };
  });

  const [selectedSubService, setSelectedSubService] = useState<'marketplace' | 'admission' | 'course' | 'loan'>('marketplace');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceCustomLink, setNewServiceCustomLink] = useState('');
  const [redirectLinkInput, setRedirectLinkInput] = useState('');

  // Sync state changes back to standard localStorage
  useEffect(() => {
    localStorage.setItem('udan_services_data', JSON.stringify(servicesData));
  }, [servicesData]);

  // Handle setting active sub-service and prefilled link input
  useEffect(() => {
    if (servicesData && servicesData[selectedSubService]) {
      setRedirectLinkInput(servicesData[selectedSubService].link || '');
    }
  }, [selectedSubService, servicesData]);

  // Search filter terms
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [contestFilterTab, setContestFilterTab] = useState<'live' | 'upcoming' | 'completed' | 'all'>('all');
  const [questionCategory, setQuestionCategory] = useState<string>('All');

  // AI Question Generator form inputs
  const [aiSubject, setAiSubject] = useState<string>('Indian Polity');
  const [aiTopic, setAiTopic] = useState<string>('Fundamental Rights');
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [aiCount, setAiCount] = useState<number>(3);
  const [aiCategory, setAiCategory] = useState<string>('UPSC');
  const [aiGeneratedItems, setAiGeneratedItems] = useState<any[]>([]);
  const [selectedAiQuestionIndex, setSelectedAiQuestionIndex] = useState<number | null>(null);

  // Manual Question form inputs
  const [mqQuestion, setMqQuestion] = useState<string>('');
  const [mqHindi, setMqHindi] = useState<string>('');
  const [mqCategory, setMqCategory] = useState<string>('SSC');
  const [mqOptions, setMqOptions] = useState<string[]>(['', '', '', '']);
  const [mqCorrectIndex, setMqCorrectIndex] = useState<number>(0);
  const [mqExplanation, setMqExplanation] = useState<string>('');

  // New Contest Form
  const [newContest, setNewContest] = useState({
    title: '',
    subject: '',
    category: 'SSC',
    status: 'upcoming',
    entryFee: 19,
    totalPrize: 10000,
    totalSlots: 1000,
    durationMinutes: 45,
    totalQuestions: 20
  });

  // Wallet user balance modifier
  const [selectedUserForWallet, setSelectedUserForWallet] = useState<any | null>(null);
  const [walletModifyAmount, setWalletModifyAmount] = useState<string>('');

  // Push notifications panel
  const [notifTarget, setNotifTarget] = useState<'all' | 'premium' | 'inactive'>('all');
  const [notifTitle, setNotifTitle] = useState<string>('🏆 Big Announcement from Udhan Exam League!');
  const [notifBody, setNotifBody] = useState<string>('Sign up for the upcoming SSC mock exam model test paper & win cashback! Direct cash out via UPI.');
  
  // Abusive user monitoring live chats
  const [abusiveUsers, setAbusiveUsers] = useState<string[]>(['Rakesh99', 'Vikram10']);
  const [newAbusiveUser, setNewAbusiveUser] = useState<string>('');
  
  // Custom interactive mock telemetry logs
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'System: Security system initialized securely with role-based restrictions',
    'System: Firestore replica nodes connected in 0.0.0.0:3000',
    'System: Chat moderation active on general exam chatroom channels'
  ]);

  // Loading database parameters on load
  const loadDatabase = async () => {
    try {
      setLoading(true);
      const resStats = await fetch('/api/dashboard-stats');
      if (resStats.ok) setStats(await resStats.json());

      const resUsers = await fetch('/api/users');
      if (resUsers.ok) setUsers(await resUsers.json());

      const resContests = await fetch('/api/contests');
      if (resContests.ok) setContests(await resContests.json());

      const resQuestions = await fetch('/api/questions');
      if (resQuestions.ok) setQuestions(await resQuestions.json());

      const resWithdrawals = await fetch('/api/withdrawals');
      if (resWithdrawals.ok) setWithdrawals(await resWithdrawals.json());

      const resConfigs = await fetch('/api/configs');
      if (resConfigs.ok) setConfigs(await resConfigs.json());

      const resLive = await fetch('/api/live-status');
      if (resLive.ok) setLiveQuiz(await resLive.json());

    } catch (e) {
      console.error(e);
      onShowToast("⚠️ Backend API unreachable! Offline client mode active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Update backend config helper
  const saveConfigs = async (updated: any) => {
    try {
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const payload = await res.json();
        setConfigs(payload);
        onShowToast("✔️ Config changed and updated successfully!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // BAN / UNBAN User
  const handleToggleUserBan = async (user: any) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        onShowToast(`User ${user.name} is now ${newStatus.toUpperCase()}`);
        setTelemetryLogs(prev => [`Audit: User ${user.name} was ${newStatus} by admin`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // WALLET Edits
  const handleModifyUserWallet = async () => {
    if (!selectedUserForWallet) return;
    const amount = parseFloat(walletModifyAmount);
    if (isNaN(amount)) {
      onShowToast("❌ Error: Invalid amount entered.");
      return;
    }

    const newBalance = Math.max(0, selectedUserForWallet.walletBalance + amount);
    try {
      const res = await fetch(`/api/users/${selectedUserForWallet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletBalance: newBalance })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u.id === selectedUserForWallet.id ? updatedUser : u));
        setSelectedUserForWallet(null);
        setWalletModifyAmount('');
        onShowToast(`Updated ${updatedUser.name}'s balance to ₹${newBalance}`);
        setTelemetryLogs(prev => [`Audit: Adjusted ₹${amount} for ${updatedUser.name}`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // APPROVE / REJECT Withdrawals
  const handleWithdrawalAudit = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/withdrawals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setWithdrawals(prev => prev.map(w => w.id === id ? updated : w));
        onShowToast(`Withdrawal request marked is: ${newStatus}`);
        setTelemetryLogs(prev => [`Audit: Withdrawal requestId ${id} status ${newStatus}`, ...prev]);
        // Refresh users since balances update
        const resUsers = await fetch('/api/users');
        if (resUsers.ok) setUsers(await resUsers.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CREATE Contest
  const handleCreateContest = async (e: FormEvent) => {
    e.preventDefault();
    if (!newContest.title || !newContest.subject) {
      onShowToast("❌ Contest title/subject are required.");
      return;
    }
    try {
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContest)
      });
      if (res.ok) {
        const created = await res.json();
        setContests(prev => [created, ...prev]);
        onShowToast(`🎉 Contest '${created.title}' created successfully.`);
        setNewContest({
          title: '',
          subject: '',
          category: 'SSC',
          status: 'upcoming',
          entryFee: 19,
          totalPrize: 10000,
          totalSlots: 1000,
          durationMinutes: 45,
          totalQuestions: 20
        });
        setTelemetryLogs(prev => [`Contest: Added dynamic series [${created.title}] in category ${created.category}`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // DELETE Contest
  const handleDeleteContest = async (id: string) => {
    try {
      const res = await fetch(`/api/contests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContests(prev => prev.filter(c => c.id !== id));
        onShowToast("🗑️ Contest deleted safely.");
        setTelemetryLogs(prev => [`Contest: Removed contest id [${id}]`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // TRIGGER REAL-TIME GEMINI MCQ GENERATION
  const handleGenerateAIQuestions = async () => {
    try {
      setLoading(true);
      onShowToast(`🤖 Connecting with Gemini 3.5-flash to write standard ${aiCategory} exam MCQs...`);
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: aiCategory,
          subject: aiSubject,
          topic: aiTopic,
          difficulty: aiDifficulty,
          count: aiCount
        })
      });
      if (response.ok) {
        const payload = await response.json();
        setAiGeneratedItems(payload.questions);
        setSelectedAiQuestionIndex(0);
        onShowToast(`⭐ Successfully drafted ${payload.questions.length} questions using Gemini!`);
        
        // Refresh questions list
        const resQuestions = await fetch('/api/questions');
        if (resQuestions.ok) setQuestions(await resQuestions.json());
      } else {
        onShowToast("⚠️ AI Question generation module failed.");
      }
    } catch (err) {
      console.error(err);
      onShowToast("❌ Error calling server-side API.");
    } finally {
      setLoading(false);
    }
  };

  // SAVE MANUAL MCQ
  const handleSaveManualQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!mqQuestion || !mqOptions[0]) {
      onShowToast("❌ Fill the Question and at least first Option.");
      return;
    }
    const fullQuest = mqHindi ? `${mqQuestion} \n\n(${mqHindi})` : mqQuestion;
    const body = {
      category: mqCategory,
      question: fullQuest,
      options: mqOptions,
      correctIndex: mqCorrectIndex,
      explanation: mqExplanation || "Standard answer key verification verified by Udhan Team."
    };
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const saved = await res.json();
        setQuestions(prev => [saved, ...prev]);
        onShowToast("✔️ Manual Question indexed into standard bank.");
        setMqQuestion('');
        setMqHindi('');
        setMqExplanation('');
        setMqOptions(['', '', '', '']);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // LIVE QUIZ CONTROL TRIGGERS
  const updateLiveState = async (updates: any) => {
    try {
      const res = await fetch('/api/live-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const l = await res.json();
        setLiveQuiz(l);
        onShowToast("⚡ Live State Broadcast updated on player devices!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // EXPORT REPORT TO EXCEL CSV (SIMULATED)
  const triggerCsvDownloader = (type: string, dataArray: any[]) => {
    if (dataArray.length === 0) {
      onShowToast("❌ Error: No dataset available to save.");
      return;
    }
    const headers = Object.keys(dataArray[0]).join(",");
    const rows = dataArray.map(obj => 
      Object.values(obj).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Udhan_${type}_Report_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`📥 Downloaded ${dataArray.length} records in Excel CSV format.`);
  };

  // PRINT CURRENT SCREEN / EXPORT DYNAMIC WINDOW
  const printWindow = () => {
    window.print();
  };

  // Mock User reference search filtering
  const filteredUsers = users.filter(u => {
    const term = userSearchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.upiId.toLowerCase().includes(term);
  });

  // Mock Contests filter tabs
  const filteredContests = contests.filter(c => {
    if (contestFilterTab === 'all') return true;
    return c.status === contestFilterTab;
  });

  // Mock Questions Category filter
  const filteredQuestions = questions.filter(q => {
    if (questionCategory === 'All') return true;
    return q.category === questionCategory;
  });

  return (
    <div className="bg-slate-900 border border-slate-750/80 rounded-2xl overflow-hidden min-h-[550px] w-full flex flex-col font-sans text-slate-100 shadow-3xl text-left bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      
      {/* ADMIN TITLE RIBBON */}
      <div className="bg-gradient-to-r from-red-700 to-black px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-red-900/40">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-md shrink-0">
            <span className="text-red-700 font-black tracking-tight text-sm">UEL</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Udhan Exam League Admin Panel
              <span className="bg-red-600/30 text-red-400 border border-red-500/30 text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full">
                Dream11 Concept Workspace
              </span>
            </h1>
            <p className="text-[11px] text-slate-300">Fast-loading full-stack interactive administrator controls</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Real Cloud Link Indicator */}
          <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/25 px-2.5 py-1 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            LIVE SERVER CONNECTED
          </span>

          <button 
            onClick={loadDatabase} 
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-white/15 text-slate-300 hover:text-white rounded-lg transition"
            title="Refresh database state"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* WORKSPACE DIVIDER */}
      <div className="flex flex-1 flex-col md:flex-row min-h-0 bg-slate-950/40">
        
        {/* COLLAPSIBLE SIDEBAR */}
        <aside className={`${sidebarOpen ? "w-full md:w-64" : "w-full md:w-16"} bg-slate-950 border-r border-slate-800/80 transition-all duration-300 shrink-0 flex flex-col select-none`}>
          
          <div className="p-3 border-b border-slate-800 flex justify-between items-center">
            {sidebarOpen && <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-2">SYSTEM CONTROLS</span>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition hidden md:block ml-auto"
            >
              📊
            </button>
          </div>

          <nav className="p-2 space-y-1 overflow-y-auto flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'contests', label: 'Quiz Contest Coach', icon: BookOpen },
              { id: 'questions', label: 'Questions & AI Writer', icon: Cpu },
              { id: 'services', label: 'Services Hub (4 Sections)', icon: ShoppingBag },
              { id: 'live', label: 'Live Quiz Controller', icon: Radio },
              { id: 'payments', label: 'Wallet & UPI Gateways', icon: Wallet },
              { id: 'referrals', label: 'Referral & Rewards', icon: Gift },
              { id: 'notifications', label: 'Broadcast / Alerts', icon: Megaphone },
              { id: 'security', label: 'Access Roles Auth', icon: ShieldCheck },
              { id: 'deployment', label: 'Production Deployment Hub', icon: Sliders }
            ].map((menu) => {
              const IconComp = menu.icon;
              const isSelected = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveTab(menu.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-red-750 to-red-650 text-white font-bold shadow-lg shadow-red-950/40 border-l-4 border-red-500' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <IconComp size={16} className={isSelected ? 'text-white' : 'text-slate-400'} />
                  {sidebarOpen && <span className="truncate">{menu.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Quick System specs */}
          {sidebarOpen && (
            <div className="p-3 bg-slate-900/30 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
              <div>Engine: Node.js 22</div>
              <div>Model: Gemini 3.5 Flash</div>
              <div>Database: Memory Cache</div>
            </div>
          )}
        </aside>

        {/* WORK BENCH CONTAINER */}
        <main className="flex-1 p-6 overflow-y-auto max-w-full">
          
          {loading && (
            <div className="mb-4 bg-red-600/10 border border-red-500/20 text-red-300 text-xs py-2 px-4 rounded-xl flex items-center gap-2 animate-pulse">
              <RefreshCw size={12} className="animate-spin" />
              <span>Database syncing transaction records in progress...</span>
            </div>
          )}

          {/* SCREEN CONTEXTS CHANGER */}
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* TOP STAT GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {[
                  { name: 'Total Users Registered', val: stats.totalUsers || 7, sub: 'Active database rows', color: 'border-l-blue-500', icon: Users },
                  { name: 'Live Fee Revenue', val: `₹${(stats.totalRevenue || 145020).toLocaleString()}`, sub: 'UPI Payment simulations', color: 'border-l-green-500', icon: BarChart3 },
                  { name: 'Active Quiz contests', val: stats.totalContests || 4, sub: 'Live + Upcoming', color: 'border-l-red-500', icon: BookOpen },
                  { name: 'Withdraw Requests', val: stats.withdrawRequests || 0, sub: 'Requires admin audit', color: 'border-l-yellow-500', icon: Wallet },
                  { name: 'AI Gen. MCQs Count', val: stats.aiGeneratedQuestionsCount || 120, sub: 'Gemini generated', color: 'border-l-purple-500', icon: Cpu },
                  { name: 'Manual Questions Index', val: stats.manualQuestionsCount || 450, sub: 'Staff uploaded', color: 'border-l-indigo-500', icon: Sliders },
                  { name: 'Joined Students Tracker', val: '1,245 Slots', sub: 'In SSC CGL Tier-1 Mock', color: 'border-l-teal-500', icon: ArrowUpRight },
                  { name: 'Active Chat Channels', val: '2 Active', sub: 'Spam filters operational', color: 'border-l-pink-500', icon: MessageSquare }
                ].map((st, i) => {
                  const CompIcon = st.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border-l-4 ${st.color} border border-slate-800 shadow-md`}>
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[11px] text-slate-400 font-semibold leading-tight">{st.name}</span>
                        <CompIcon size={14} className="text-slate-500" />
                      </div>
                      <div className="text-lg md:text-xl font-bold font-mono text-white mt-1.5">{st.val}</div>
                      <span className="text-[9px] text-slate-500">{st.sub}</span>
                    </div>
                  );
                })}

              </div>

              {/* INTERACTIVE DATA CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Custom SVG line Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue & Live Registrations</h3>
                      <p className="text-[10px] text-slate-500">Weekly tracking mock (Daily update loop)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Revenue (₹k)
                      </span>
                      <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span> Signups (x10)
                      </span>
                    </div>
                  </div>

                  {/* Responsive SVG Grid */}
                  <div className="h-44 w-full relative pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
                      <line x1="0" y1="80" x2="100" y2="80" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />

                      {/* Area Fill for Revenue */}
                      <path 
                        d="M 0,90 Q 20,40 40,30 T 80,10 T 100,20 L 100,90 L 0,90 Z" 
                        fill="url(#gradient-red)" 
                        opacity="0.1" 
                      />

                      {/* Line Chart Revenue */}
                      <path 
                        d="M 0,90 Q 20,40 40,30 T 80,10 T 100,20" 
                        fill="none" 
                        stroke="#dc2626" 
                        strokeWidth="2" 
                      />

                      {/* Line Chart Registrations */}
                      <path 
                        d="M 0,85 Q 15,65  35,45 T 75,20 T 100,40" 
                        fill="none" 
                        stroke="#60a5fa" 
                        strokeWidth="1.5" 
                        strokeDasharray="1"
                      />

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Labels */}
                    <div className="absolute left-0 right-0 bottom-[-15px] flex justify-between text-[8px] text-slate-500 font-mono px-1">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Highest signup load peaked: <strong>Friday 08:30 PM</strong></span>
                    <button 
                      onClick={() => triggerCsvDownloader('Revenue_Stats', [
                        { Day: "Mon", RevenueK: 12, SignupsText: "120" },
                        { Day: "Tue", RevenueK: 25, SignupsText: "320" },
                        { Day: "Wed", RevenueK: 35, SignupsText: "500" },
                        { Day: "Thu", RevenueK: 42, SignupsText: "820" },
                        { Day: "Fri", RevenueK: 58, SignupsText: "1245" },
                        { Day: "Sat", RevenueK: 64, SignupsText: "1350" },
                        { Day: "Sun", RevenueK: 70, SignupsText: "1480" }
                      ])}
                      className="text-red-400 hover:text-white flex items-center gap-1 transition font-semibold"
                    >
                      <Download size={12} /> Export CSV
                    </button>
                  </div>

                </div>

                {/* Live Channel feeds */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live Activity Stream</h3>
                    
                    <div className="space-y-2.5 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
                      {telemetryLogs.map((log, index) => (
                        <div key={index} className="text-[10px] font-mono leading-relaxed bg-slate-950 p-2 border border-slate-800/60 rounded-md">
                          <span className="text-red-500 mr-1.5">●</span> {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setTelemetryLogs(p => [`Audit: Forced clear on log traces`, ...p]);
                      onShowToast("Audit trail logs reset.");
                    }}
                    className="w-full mt-3 bg-slate-800 text-slate-300 py-1.5 rounded-lg border border-slate-700 hover:text-white text-xs hover:bg-slate-700 transition"
                  >
                    Clear Audio Trace cache
                  </button>
                </div>

              </div>

              {/* RECENT NOTIFICATIONS / BROADCAST HIGHLIGHT */}
              <div className="bg-gradient-to-r from-red-950 to-slate-950 border border-red-950/50 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="bg-red-650 text-white font-bold text-[9px] uppercase px-2.5 py-0.5 rounded-full inline-block tracking-wider">
                    BROADCAST ADAPTER
                  </span>
                  <h4 className="text-white text-sm font-semibold">{notifTitle}</h4>
                  <p className="text-[11px] text-slate-300">{notifBody}</p>
                </div>
                <button 
                  onClick={() => onShowToast(`📢 Resending: ${notifTitle}`)}
                  className="bg-red-650 hover:bg-red-750 text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow-md shrink-0 border border-red-500/25"
                >
                  Send Push Ticker
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">

              {/* Toolbar search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-850">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="text"
                    placeholder="Search name, UPI or referral..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => triggerCsvDownloader('Users', filteredUsers)} 
                    className="bg-slate-800 hover:bg-slate-750 hover:text-white px-3 py-1.5 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold scroll-smooth transition flex items-center gap-1.5"
                  >
                    <Download size={13} /> Export Excel CSV
                  </button>
                  <button 
                    onClick={printWindow} 
                    className="bg-slate-800 hover:bg-slate-750 hover:text-white px-3 py-1.5 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold scroll-smooth transition flex items-center gap-1.5"
                  >
                    <FileText size={13} /> Print List
                  </button>
                </div>
              </div>

              {/* Wallet Modify Dialogue Box */}
              {selectedUserForWallet && (
                <div className="bg-slate-900 border-2 border-red-900/50 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider">Adjustment Wallet Balance: {selectedUserForWallet.name}</h4>
                      <p className="text-[10px] text-slate-400">Current Balance: ₹{selectedUserForWallet.walletBalance.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setSelectedUserForWallet(null)} className="text-slate-500 hover:text-white">✕</button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 500 for deposit, -300 for deduction"
                      value={walletModifyAmount}
                      onChange={(e) => setWalletModifyAmount(e.target.value)}
                      className="flex-1 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono"
                    />
                    <button 
                      onClick={handleModifyUserWallet}
                      className="bg-red-650 hover:bg-red-750 text-white text-xs py-2 px-6 rounded-lg font-bold"
                    >
                      Update Wallet Ledger
                    </button>
                  </div>
                </div>
              )}

              {/* MAIN USERS LIST */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-850">
                      <th className="p-4">Student Name / Email</th>
                      <th className="p-4">UPI Identifier</th>
                      <th className="p-4 font-mono">Wallet</th>
                      <th className="p-4">Exams Joined</th>
                      <th className="p-4">Level (XP)</th>
                      <th className="p-4">State</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-xs text-slate-500">No student records match search fields.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-850/20 text-xs">
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <span className="w-8 h-8 rounded-full bg-slate-820 flex items-center justify-center font-bold text-white text-[11px] border border-red-600/30">
                                {user.avatarText}
                              </span>
                              <div>
                                <div className="text-white font-bold leading-tight">{user.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-slate-400">{user.upiId}</td>
                          <td className="p-4 text-white font-mono font-bold">₹{user.walletBalance.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-slate-400">
                              <span className="text-white font-bold">{user.quizzesPlayed}</span>
                              <span className="text-slate-500">/ ({user.contestsWon} Won)</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-800 text-slate-350 px-2 py-0.5 rounded-full text-[10px] font-mono leading-none border border-slate-700/55">
                              Lvl {user.level}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider inline-block ${
                              user.status === 'active' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/25' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/25'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedUserForWallet(user)}
                              className="text-yellow-550 hover:bg-yellow-500/10 px-2 py-1 rounded transition text-[10px] font-semibold border border-yellow-500/25"
                            >
                              ₹ Adjust Wallet
                            </button>
                            <button
                              onClick={() => handleToggleUserBan(user)}
                              className={`${
                                user.status === 'banned' 
                                  ? 'text-green-400 hover:bg-green-500/10 border-green-500/25' 
                                  : 'text-red-400 hover:bg-red-500/10 border-red-500/25'
                              } px-2 py-1 rounded transition text-[10px] font-semibold border`}
                            >
                              {user.status === 'banned' ? 'Activate' : 'Ban User'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: QUIZ CONTEST MANAGEMENT */}
          {activeTab === 'contests' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Create Contest Input Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
                    <PlusCircle size={16} className="text-red-500" /> Create New Exam Match
                  </h3>

                  <form onSubmit={handleCreateContest} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contest Title</label>
                      <input
                        type="text"
                        placeholder="e.g SSC Mock Paper General History"
                        value={newContest.title}
                        onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-red-650"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Category</label>
                        <select
                          value={newContest.category}
                          onChange={(e) => setNewContest({ ...newContest, category: e.target.value })}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none"
                        >
                          <option value="SSC">SSC</option>
                          <option value="UPSC">UPSC</option>
                          <option value="Railway">Railway</option>
                          <option value="UP Police">Police Exam</option>
                          <option value="BPSC">BPSC</option>
                          <option value="Banking">Banking</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Initial Status</label>
                        <select
                          value={newContest.status}
                          onChange={(e) => setNewContest({ ...newContest, status: e.target.value as any })}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none"
                        >
                          <option value="live">Live Now</option>
                          <option value="upcoming">Upcoming Tab</option>
                          <option value="free">Free League</option>
                          <option value="completed">Completed Tab</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Subtext Guidelines</label>
                      <input
                        type="text"
                        placeholder="e.g. 50 questions • 30 Mins • All topics mock"
                        value={newContest.subject}
                        onChange={(e) => setNewContest({ ...newContest, subject: e.target.value })}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-red-650"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Entry Fee (₹)</label>
                        <input
                          type="number"
                          value={newContest.entryFee}
                          onChange={(e) => setNewContest({ ...newContest, entryFee: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono font-bold text-emerald-400">Prize Pool (₹)</label>
                        <input
                          type="number"
                          value={newContest.totalPrize}
                          onChange={(e) => setNewContest({ ...newContest, totalPrize: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 px-1">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase">Slots count</label>
                        <input
                          type="number"
                          value={newContest.totalSlots}
                          onChange={(e) => setNewContest({ ...newContest, totalSlots: parseInt(e.target.value) || 1 })}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-1.5 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase">Duration (mins)</label>
                        <input
                          type="number"
                          value={newContest.durationMinutes}
                          onChange={(e) => setNewContest({ ...newContest, durationMinutes: parseInt(e.target.value) || 1 })}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-1.5 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase">Questions #</label>
                        <input
                          type="number"
                          value={newContest.totalQuestions}
                          onChange={(e) => setNewContest({ ...newContest, totalQuestions: parseInt(e.target.value) || 1 })}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-1.5 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-750 to-red-650 hover:from-red-650 hover:to-red-550 text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-lg transition"
                    >
                      Publish Contest Board
                    </button>
                  </form>
                </div>

                {/* Filterable Contests Board */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-white text-xs font-bold uppercase tracking-wider">Active Board Contests</h3>
                      <p className="text-[10px] text-slate-500">Filters live on student screens in real time</p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex bg-slate-950 p-1 border border-slate-820 rounded-lg">
                      {['all', 'live', 'upcoming', 'completed'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setContestFilterTab(tab as any)}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md transition ${
                            contestFilterTab === tab 
                              ? 'bg-red-650 text-white' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feed container */}
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {filteredContests.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 font-mono text-xs">No contests for selected status criteria.</div>
                    ) : (
                      filteredContests.map((con) => {
                        const spotPercentage = con.totalSlots > 0 ? (con.registeredSlots / con.totalSlots) * 100 : 0;
                        return (
                          <div key={con.id} className="bg-slate-950/60 hover:bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4 transition">
                            <div className="space-y-1.5 flex-1 select-none">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                  con.status === 'live' 
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/25 animate-pulse'
                                    : con.status === 'upcoming'
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {con.status}
                                </span>
                                <span className="bg-slate-850 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                  {con.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">Entry: <strong className="text-white font-mono">₹{con.entryFee}</strong></span>
                                <span className="text-[10px] text-emerald-400 font-bold ml-1.5">Prize: <strong className="font-mono">₹{con.totalPrize.toLocaleString()}</strong></span>
                              </div>

                              <h4 className="text-white font-bold text-xs">{con.title}</h4>
                              <p className="text-[10px] text-slate-500">{con.subject}</p>

                              {/* Progress parameters Slots progress bar */}
                              <div className="w-full sm:max-w-xs pt-1.5 space-y-1">
                                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                  <span>{con.registeredSlots} registered slots filled</span>
                                  <span>{con.totalSlots} total</span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-red-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, spotPercentage)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDeleteContest(con.id)}
                              className="text-slate-500 hover:text-red-500 border border-slate-800 hover:border-red-950 p-2 rounded-lg hover:bg-red-950/10 transition shrink-0"
                              title="Delete Contest Module"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 4: QUESTION BANK & AI GENERATOR */}
          {activeTab === 'questions' && (
            <div className="space-y-6">

              {/* TWO PANEL SPLIT FOR AI vs MANUAL */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* AI Question generator */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <div className="p-1.5 bg-red-650 rounded-lg text-white">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-white text-xs uppercase font-extrabold tracking-wider">AI MCQ Question Generator</h3>
                      <p className="text-[10px] text-slate-500">Powered by server-side Gemini 3.5-flash with JSON schema logic</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Exam Type</label>
                        <select
                          value={aiCategory}
                          onChange={(e) => setAiCategory(e.target.value)}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none"
                        >
                          <option value="SSC">SSC (CGL, CHSL)</option>
                          <option value="UPSC">UPSC Civil Services</option>
                          <option value="Railway">Railway Recruitment</option>
                          <option value="Police">UP Police Exams</option>
                          <option value="BPSC">BPSC Bihar Special</option>
                          <option value="Banking">Banking (IBPS, SBI)</option>
                          <option value="State Exams">State level exams</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Difficulty Complexity</label>
                        <select
                          value={aiDifficulty}
                          onChange={(e) => setAiDifficulty(e.target.value as any)}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none"
                        >
                          <option value="Easy">Easy Level</option>
                          <option value="Medium">Medium General</option>
                          <option value="Hard">Hard Level</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Exam Subject Area</label>
                        <input
                          type="text"
                          value={aiSubject}
                          onChange={(e) => setAiSubject(e.target.value)}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Count (1-10)</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={aiCount}
                          onChange={(e) => setAiCount(parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Topic details</label>
                      <input
                        type="text"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                        placeholder="e.g. Mughal Architecture, Vedic culture, speed-time"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleGenerateAIQuestions}
                      className="w-full bg-gradient-to-r from-red-750 to-red-650 hover:from-red-650 hover:to-red-550 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          Running AI Generator...
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          Generate MCQs using Gemini
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Generated Question outputs display */}
                  {aiGeneratedItems.length > 0 && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mt-4">
                      <div className="flex justify-between items-center text-[10px] font-bold text-red-400">
                        <span>GENERATED DRAFT SAMPLES</span>
                        <span>{aiGeneratedItems.length} Draft MCQs</span>
                      </div>

                      {/* Draft item slider review */}
                      <div className="max-h-56 overflow-y-auto no-scrollbar space-y-3">
                        {aiGeneratedItems.map((q, idx) => (
                          <div key={idx} className="bg-slate-900 p-3 border border-slate-820 rounded-lg space-y-2 text-xs">
                            <p className="font-semibold text-slate-200">Q.{idx+1}: {q.question}</p>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pl-2">
                              {q.options?.map((opt: string, oi: number) => (
                                <div key={oi} className={oi === q.correctIndex ? "text-emerald-400 font-bold" : ""}>
                                  {oi+1}. {opt}
                                </div>
                              ))}
                            </div>
                            <div className="text-[9px] text-slate-500 bg-slate-950 p-2 border border-slate-850 rounded">
                              <span className="font-bold text-red-500">Explanation:</span> {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAiGeneratedItems([]);
                          onShowToast("Generated mock items mapped successfully!");
                        }}
                        className="w-full text-center bg-emerald-580/10 border border-emerald-500/20 text-emerald-400 py-1.5 rounded text-[10px] font-semibold transition hover:bg-emerald-500/25"
                      >
                        Accept All Drafts & Clean Workspace
                      </button>
                    </div>
                  )}

                </div>

                {/* MANUAL QUESTION WRITER */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <div className="p-1.5 bg-slate-800 rounded-lg text-white">
                      <Sliders size={16} />
                    </div>
                    <div>
                      <h3 className="text-white text-xs uppercase font-extrabold tracking-wider">Manual Question Editor</h3>
                      <p className="text-[10px] text-slate-500">Type questions with multi-language Devanagari Hindi support & explanations</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveManualQuestion} className="space-y-3 font-medium">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Category</label>
                        <select
                          value={mqCategory}
                          onChange={(e) => setMqCategory(e.target.value)}
                          className="w-full bg-slate-950 text-white text-[11px] border border-slate-800 rounded-lg p-2 focus:outline-none"
                        >
                          <option value="SSC">SSC Syllabus</option>
                          <option value="UPSC">UPSC Civils</option>
                          <option value="Railway">Railway Tech</option>
                          <option value="UP Police">Police Syllabus</option>
                          <option value="BPSC">BPSC Special</option>
                          <option value="Banking">Banking GS</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Correct Option (1-4)</label>
                        <select
                          value={mqCorrectIndex}
                          onChange={(e) => setMqCorrectIndex(parseInt(e.target.value))}
                          className="w-full bg-slate-950 text-white text-[11px] border border-slate-800 rounded-lg p-2 focus:outline-none font-mono"
                        >
                          <option value="0">Option 1 is correct</option>
                          <option value="1">Option 2 is correct</option>
                          <option value="2">Option 3 is correct</option>
                          <option value="3">Option 4 is correct</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5 flex gap-1.5 items-center">
                        <Languages size={10} className="text-red-400" /> Question (English)
                      </label>
                      <input
                        type="text"
                        placeholder="What is the chemical symbol of Gold?"
                        value={mqQuestion}
                        onChange={(e) => setMqQuestion(e.target.value)}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Question translation (Hindi - Optional)</label>
                      <input
                        type="text"
                        placeholder="सोने (Gold) का रासायनिक प्रतीक क्या है?"
                        value={mqHindi}
                        onChange={(e) => setMqHindi(e.target.value)}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none font-sans"
                      />
                    </div>

                    {/* Options grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {mqOptions.map((opt, oIdx) => (
                        <div key={oIdx}>
                          <label className="block text-[8px] text-slate-500 font-bold uppercase">Option {oIdx+1}</label>
                          <input
                            type="text"
                            placeholder={`Choice ${oIdx+1}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...mqOptions];
                              updated[oIdx] = e.target.value;
                              setMqOptions(updated);
                            }}
                            className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-1.5 focus:outline-none font-medium"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Detailed Explanation Answer Key</label>
                      <textarea
                        placeholder="Explain why choice correct. e.g. Au stands for Aurum which is latin of Gold."
                        rows={2}
                        value={mqExplanation}
                        onChange={(e) => setMqExplanation(e.target.value)}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          // Simulating CSV upload trigger
                          onShowToast("📤 Upload bulk question templates CSV / Excel (.XLS)");
                        }}
                        className="bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-350 text-[10px] px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition"
                      >
                        <Upload size={12} /> CSV Upload
                      </button>

                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-750 to-red-650 hover:from-red-650 hover:to-red-550 text-white font-bold text-xs py-2 rounded-xl text-center shadow-md transition"
                      >
                        Index manual question
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              {/* CURRENT INDEXED QUESTIONS LIST */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">Udhan Exam Category Question Bank</h3>
                    <p className="text-[10px] text-slate-500">Live indexed MCQs used inside dynamic player tests matching exam rules</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 select-none">Filter category:</span>
                    <select
                      value={questionCategory}
                      onChange={(e) => setQuestionCategory(e.target.value)}
                      className="bg-slate-950 text-white text-[11px] border border-slate-800 rounded px-2.5 py-1 focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="SSC">SSC</option>
                      <option value="UPSC">UPSC</option>
                      <option value="Railway">Railway</option>
                      <option value="Police">UP Police</option>
                      <option value="Banking">Banking</option>
                      <option value="BPSC">BPSC</option>
                      <option value="Other">Other</option>
                    </select>

                    <button 
                      onClick={() => triggerCsvDownloader('QuestionBank', questions)}
                      className="text-red-400 hover:text-white text-[10px] pl-2 font-bold transition flex items-center gap-1"
                    >
                      <Download size={11} /> Export CSV
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-800 max-h-[300px] overflow-y-auto pr-1">
                  {filteredQuestions.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-mono text-xs">No questions loaded for selected category filter.</div>
                  ) : (
                    filteredQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="py-4.5 space-y-2 select-none group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex gap-2">
                            <span className="bg-red-950 text-red-450 border border-red-900 text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shrink-0">
                              {q.category}
                            </span>
                            <h4 className="text-white text-xs font-semibold leading-relaxed font-sans">{q.question}</h4>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => {
                              setQuestions(prev => prev.filter(item => item.id !== q.id));
                              onShowToast("Question deleted from system storage.");
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition px-2"
                            title="Delete question permanently"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Options block */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pl-4 text-[10px]">
                          {q.options?.map((opt: string, optIi: number) => (
                            <div key={optIi} className={`p-1.5 rounded border ${
                              optIi === q.correctIndex 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20 font-bold' 
                                : 'bg-slate-950/40 text-slate-400 border-slate-850'
                            }`}>
                              Option {optIi+1}: {opt}
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] text-slate-450 pl-4 border-l-2 border-red-900/60 leading-relaxed italic">
                          <strong className="text-red-400 font-semibold not-italic">Keys & Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: LIVE QUIZ CONTROLLER */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Simulator layout controls */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-5 lg:col-span-2">
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center border-b border-slate-805 pb-3">
                    <div>
                      <h3 className="text-white text-xs uppercase font-extrabold tracking-wider">Live Battle Ground Control Room</h3>
                      <p className="text-[10px] text-slate-450">Synchronize countdown sequences, timers, and prompt transition loops on participant devices</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-red-400 font-mono font-bold bg-slate-950 px-3 py-1 border border-slate-800 rounded">
                      MATCH ID: {liveQuiz.contestId || 'ssc_mega'}
                    </span>
                  </div>

                  {/* Status telemetry block */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850 select-none">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Engine status</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${liveQuiz.isPaused ? 'bg-yellow-500' : 'bg-red-650 animate-ping'}`}></span>
                        <strong className="text-white text-xs uppercase font-extrabold">{liveQuiz.isPaused ? 'PAUSED' : 'BROADCASTING'}</strong>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Active MCQ index</span>
                      <div className="text-white text-sm font-bold font-mono">Question {liveQuiz.activeQuestionIndex} of 10</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Live joined</span>
                      <div className="text-white text-sm font-bold font-mono">{liveQuiz.totalJoined} verified slots</div>
                    </div>
                  </div>

                  {/* Operational manual parameters controls */}
                  <div className="space-y-3">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wide">Manual Control overrides</h4>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => updateLiveState({ isPaused: false })}
                        className="bg-red-650 hover:bg-red-750 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition"
                      >
                        <Play size={14} /> Resume Broadcast
                      </button>
                      <button
                        onClick={() => updateLiveState({ isPaused: true })}
                        className="bg-yellow-500 hover:bg-yellow-650 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition"
                      >
                        <Pause size={14} /> Pause Contest
                      </button>
                      <button
                        onClick={() => {
                          const nextIdx = Math.min(10, liveQuiz.activeQuestionIndex + 1);
                          updateLiveState({ activeQuestionIndex: nextIdx, timerRemaining: 45 });
                          onShowToast(`Moving live quiz to Question #${nextIdx}!`);
                        }}
                        className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition flex items-center gap-1"
                      >
                        Next question ➜
                      </button>
                      <button
                        onClick={() => {
                          updateLiveState({ activeQuestionIndex: 1, timerRemaining: 45, totalJoined: 1510 });
                          onShowToast("System live quiz variables reset.");
                        }}
                        className="bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-350 text-xs px-4 py-2 rounded-xl transition"
                      >
                        Reset Match
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-550 leading-relaxed max-w-lg italic">
                      💡 Operational tip: Setting Question Index will immediately push the designated quiz card and start the timer countdown on student phones without requiring app updates.
                    </p>
                  </div>

                </div>

                {/* Simulated Leaderboard update feed */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                  <div>
                    <h3 className="text-white text-xs uppercase font-extrabold tracking-wider">Real-time Rank system</h3>
                    <p className="text-[10px] text-slate-450">Active leader updates simulation</p>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar font-sans text-xs">
                    {[
                      { rank: 1, name: "Rahul Kumar", score: 9500, statusText: "No delays reported" },
                      { rank: 2, name: "Arjun Singh", score: 8700, statusText: "+2.5s network delay" },
                      { rank: 3, name: "Sneha Verma", score: 8500, statusText: "Optimal latency" },
                      { rank: 4, name: "Arjun Raj (Player)", score: 8100, statusText: "Active window focus" }
                    ].map((leader, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 border border-slate-850 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-950 font-bold text-red-500 flex items-center justify-center font-mono">
                            {leader.rank}
                          </span>
                          <div>
                            <span className="text-white font-bold block">{leader.name}</span>
                            <span className="text-[9px] text-slate-550">{leader.statusText}</span>
                          </div>
                        </div>

                        <span className="text-emerald-400 font-mono font-bold">{leader.score} PTS</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onShowToast("🏆 Dispersing reward winnings to Indian user wallets based on rank index...")}
                    className="w-full bg-slate-850 border border-slate-750 hover:bg-slate-800 text-slate-100 text-xs py-2 rounded-xl font-bold transition"
                  >
                    Distribute Contest Prizes
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: WALLET & PAYMENT GATEWAYS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Withdrawal control approval */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-820 pb-3">
                    <div>
                      <h3 className="text-white text-xs uppercase font-extrabold tracking-wider">Pending Withdrawal Audit</h3>
                      <p className="text-[10px] text-slate-450">Review and authorize UPI settlements</p>
                    </div>
                    <button 
                      onClick={() => triggerCsvDownloader('Withdrawals', withdrawals)}
                      className="text-[#60a5fa] hover:text-white text-[10px] pl-2 font-bold transition flex items-center gap-1"
                    >
                      <Download size={11} /> Download CSV Logs
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800 space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {withdrawals.length === 0 ? (
                      <div className="py-8 text-center text-slate-550 text-xs font-mono">No withdrawal transfers indexed in databases cache.</div>
                    ) : (
                      withdrawals.map((item) => (
                        <div key={item.id} className="pt-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-xs">{item.name}</span>
                              <span className="bg-slate-800 text-slate-400 p-0.5 px-1.5 rounded text-[9px] font-bold font-mono">
                                {item.gateway || 'Razorpay'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-450 font-mono">UPI: {item.upiId} • Posted: {item.timestamp}</div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                            <span className="text-white text-sm font-black font-mono">₹{item.amount.toLocaleString()}</span>
                            
                            {item.status === 'pending' ? (
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleWithdrawalAudit(item.id, 'approved')}
                                  className="bg-emerald-600/20 text-emerald-400 p-1 px-2.5 rounded text-[10px] font-bold tracking-wide uppercase border border-emerald-500/25 hover:bg-emerald-555/30 transition"
                                >
                                  Approve UPI
                                </button>
                                <button
                                  onClick={() => handleWithdrawalAudit(item.id, 'rejected')}
                                  className="bg-red-650/20 text-red-400 p-1 px-2.5 rounded text-[10px] font-bold tracking-wide uppercase border border-red-500/25 hover:bg-red-500/30 transition"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-widest ${
                                item.status === 'approved' 
                                  ? 'bg-green-500/10 text-green-400 border border-green-500/25' 
                                  : 'bg-red-500/10 text-red-400 border border-red-500/25'
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Razorpay Gateway parameters */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                  <h3 className="text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-820 pb-3">Gateway Integrations</h3>

                  <div className="space-y-4 font-medium text-xs">
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white">UPI UPI direct deposits</span>
                        <input type="checkbox" defaultChecked className="accent-red-650 shrink-0 cursor-pointer" />
                      </div>
                      <p className="text-[9px] text-slate-550 leading-tight">Enable students to instantly transfer funds to wallet balances via customized BHIM code payloads</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-white">Razorpay API endpoints</span>
                        <input type="checkbox" defaultChecked className="accent-red-650 shrink-0 cursor-pointer" />
                      </div>
                      <p className="text-[9px] text-slate-550 leading-tight">Automatic verification webhooks connected under mock key triggers</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-white">Cashfree Payout transfers</span>
                        <input type="checkbox" defaultChecked className="accent-red-650 shrink-0 cursor-pointer" />
                      </div>
                      <p className="text-[9px] text-slate-550 leading-tight">Allows automated disbursements directly towards target Devanagari Bank accounts</p>
                    </div>

                    <button
                      onClick={() => onShowToast("✔️ Payment gateway parameters saved successfully!")}
                      className="w-full mt-2 bg-gradient-to-r from-red-750 to-red-650 text-white font-bold text-xs py-2 rounded-xl transition shadow-md"
                    >
                      Save Payment Configurations
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: REFERRALS & REWARDS */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Rewards Settings */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                  <h3 className="text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-820 pb-2.5">
                    Referral & Reward Configurations
                  </h3>

                  <div className="space-y-4 font-medium">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Referral Signup Bonus (₹)</label>
                      <input
                        type="number"
                        value={configs.referralBonus}
                        onChange={(e) => saveConfigs({ ...configs, referralBonus: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-3 py-2 focus:outline-none font-mono"
                      />
                      <p className="text-[9px] text-slate-500 mt-1">Both referee and referrer gets cash reward split on mobile screen</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Daily Attendance reward (₹/Day)</label>
                      <input
                        type="number"
                        value={configs.dailyReward}
                        onChange={(e) => saveConfigs({ ...configs, dailyReward: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 text-white text-xs border border-slate-800 rounded-lg px-3 py-2 focus:outline-none font-mono"
                      />
                    </div>

                    <p className="text-[10px] text-slate-400 italic">
                      ℹ️ Daily attendance records resets at 12:00 AM Indian Standard Time. System automatically deposits the incentive once claimed.
                    </p>
                  </div>
                </div>

                {/* Promo Code Management */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                  <h3 className="text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-800 pb-2.5">Promo Code Management</h3>
                  
                  <div className="space-y-3 font-mono text-xs">
                    {[
                      { code: "UDAN500", discount: "₹500 Bonus Split", type: "Active" },
                      { code: "FREEENTRY", discount: "₹30 Contest entry off", type: "Active" },
                      { code: "WELCOME80", discount: "80% Instant cash deposit match", type: "Disabled" }
                    ].map((promo, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 border border-slate-800/60 rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="text-red-400 text-xs block">{promo.code}</strong>
                          <span className="text-[9px] text-slate-500">{promo.discount}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-widest ${
                          promo.type === 'Active' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/25' 
                            : 'bg-slate-800 text-slate-450 border border-slate-750'
                        }`}>
                          {promo.type}
                        </span>
                      </div>
                    ))}

                    <button
                      onClick={() => onShowToast("🆕 Creating code builder framework...")}
                      className="w-full bg-slate-850 border border-slate-750 hover:bg-slate-800 text-white text-xs py-2 rounded-xl text-center font-bold font-sans transition"
                    >
                      + Register Promo Code
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 8: NOTIFICATION BROADCASTS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl max-w-xl mx-auto space-y-4">
                <h3 className="text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-820 pb-2.5 flex items-center gap-1.5">
                  <Megaphone size={16} className="text-red-500" /> Push notification broadcast transmitter
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); onShowToast("📢 Push Ticker Broadcast sent to Indian user screens!"); }} className="space-y-3 font-semibold text-xs text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Segment Audience</label>
                    <select
                      value={notifTarget}
                      onChange={(e) => setNotifTarget(e.target.value as any)}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="all">Send to ALL Registered Devices (Broadcast)</option>
                      <option value="premium">Level 10+ High Winners tier</option>
                      <option value="inactive">User accounts inactive for 7 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Notification Title</label>
                    <input
                      type="text"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alert Body Copywriting</label>
                    <textarea
                      rows={3}
                      value={notifBody}
                      onChange={(e) => setNotifBody(e.target.value)}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-750 to-red-650 hover:from-red-650 hover:to-red-550 text-white font-bold py-2.5 rounded-xl transition shadow"
                  >
                    Broadcast instant payload alerts
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 9: SECURITY & ROLES-BASED AUTH */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Access roles settings */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl lg:col-span-2 space-y-4">
                  <h3 className="text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-820 pb-2.5">
                    Role-based Administrator Console
                  </h3>

                  <div className="space-y-3.5 font-medium text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Assign admin role access privileges</label>
                      <select 
                        value={configs.moderatorRole}
                        onChange={(e) => saveConfigs({ ...configs, moderatorRole: e.target.value })}
                        className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none"
                      >
                        <option value="Super Admin">Super Admin (All writes and deletion permissions unlocked)</option>
                        <option value="Contest Moderator">Quiz Moderator (Allowed contest writes + question generator only)</option>
                        <option value="Financial Editor">Financial Supervisor (Authorized to approve withdrawal checks only)</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-955/40 border border-slate-802 rounded-xl text-slate-400 leading-relaxed space-y-2">
                      <h4 className="text-white font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                        <Shield className="text-red-500" size={12} /> SECURE API PROTECTION LOGS
                      </h4>
                      <p className="text-[10px]">
                        The database operates on standard roles security rule structures compiled on Google Firestore blueprints. API access keys utilized inside Gemini client connections are safely kept under environment parameters in compliance with security guidelines.
                      </p>
                    </div>

                    <button
                      onClick={() => onShowToast("✔️ Roles privilege locks updated.")}
                      className="bg-red-650 hover:bg-red-750 text-white font-bold text-xs py-2 px-6 rounded-xl transition"
                    >
                      Update Security Privileges
                    </button>
                  </div>
                </div>

                {/* Audit Logs actions */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                  <h3 className="text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-820 pb-2.5">
                    Audit Activity Logs
                  </h3>

                  <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-[9px] text-slate-400">
                    <div>[06:27:12] Admin: role privileges updated to Super Admin</div>
                    <div>[05:14:02] API: Server initiated handshake correctly with database cache</div>
                    <div>[04:30:10] Sync: Fetched stats overview parameters for student widgets</div>
                    <div>[03:15:20] Security: Denied unauthorized payload modification attempts</div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-red-950 to-slate-950 border border-red-900/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="bg-red-650 text-white font-bold text-[9px] uppercase px-2.5 py-0.5 rounded-full inline-block tracking-wider mb-2">
                    DEPLOYMENT CONTROL CENTER
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Full-Stack Cloud Configuration & Prompt Generator</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Get production-ready system instructions, setups, credentials schema, and copy-ready prompts for Vercel, Render, Firebase, Razorpay, FCM, and Gemini.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(configs, null, 2));
                    onShowToast("📋 Copied local admin config JSON to clipboard!");
                  }}
                  className="bg-red-650 hover:bg-red-750 text-white text-xs font-bold py-2.5 px-5 rounded-xl border border-red-500/20 transition shrink-0"
                >
                  Copy System Config
                </button>
              </div>

              {/* GRID OF INSTRUCTIONS CATEGORIES */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* STACK OVERVIEW OR FLOW CHART */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active System Architecture Flow</h3>
                  
                  {/* ASCII Mapping diagram */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-red-100 overflow-x-auto space-y-1 select-all scrollbar-thin">
                    <div>┌─────────────────────────┐     ┌────────────────────────┐</div>
                    <div>│    Vercel (Frontend)    │ ──&gt; │ Render Express (Server)│</div>
                    <div>│    - Mobile Responsive  │     │ - Live Quiz Contests   │</div>
                    <div>│    - Static Assets      │     │ - Realtime Leaderboards│</div>
                    <div>└─────────────────────────┘     └────────────────────────┘</div>
                    <div>             │                               │</div>
                    <div>             ▼                               ▼</div>
                    <div>┌─────────────────────────┐     ┌────────────────────────┐</div>
                    <div>│   Firebase Database     │     │ Razorpay / FCM Alerts  │</div>
                    <div>│   - Firestore & Auth    │     │ - Entry Payment Fees   │</div>
                    <div>│   - OTP / Gmail Auth    │     │ - Push Tickers Hub     │</div>
                    <div>└─────────────────────────┘     └────────────────────────┘</div>
                    <div>                                            │</div>
                    <div>                                            ▼</div>
                    <div>                                ┌────────────────────────┐</div>
                    <div>                                │   Google Gemini API    │</div>
                    <div>                                │   - AI MCQ Ques Creator │</div>
                    <div>                                └────────────────────────┘</div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 font-medium text-xs">
                    <h4 className="text-white uppercase font-extrabold text-[11px] tracking-wider flex items-center gap-1.5 text-red-550">
                      ⚡ PRE-CONFIGURED STACK VALUES
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-350 text-left">
                      <div>
                        <strong className="text-white block mb-0.5">Hosting Profiles:</strong>
                        • Vercel (Front-end SPA with Auto-build)<br />
                        • Render Server (Web Services Node.js + Websockets)
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Databases & Logins:</strong>
                        • Cloud Firebase Firestore v1<br />
                        • Firebase Mobile OTP + Email auth
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Interactive Integrations:</strong>
                        • Razorpay Standard Checkout SDK v3<br />
                        • Firebase Cloud Messaging (FCM) v1
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">AI Questions engine:</strong>
                        • Google Gemini 3.5-Flash AI (Model)<br />
                        • Auto-generation under 6 subjects and modes
                      </div>
                    </div>
                  </div>
                </div>

                {/* COPYABLE VARIABLE ENV TEMPLATE */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <h3 className="font-bold text-slate-400 uppercase tracking-widest">Environment Env Registry</h3>
                    <button 
                      onClick={() => {
                        const envTxt = `## FRONTEND ENV VALUES (Vercel)\nVITE_RAZORPAY_KEY_ID=rzp_live_...\nVITE_FIREBASE_API_KEY=...\nVITE_FIREBASE_AUTH_DOMAIN=...\nVITE_FIREBASE_PROJECT_ID=...\n\n## BACKEND ENV VALUES (Render)\nPORT=3000\nGEMINI_API_KEY=AIzaSy...\nFIREBASE_SERVICE_ACCOUNT_JSON=...\nRAZORPAY_KEY_SECRET=...\nFCM_SERVER_KEY=...`;
                        navigator.clipboard.writeText(envTxt);
                        onShowToast("📋 Copied Env config registry template to clipboard!");
                      }}
                      className="text-red-450 hover:text-white font-bold tracking-wide transition uppercase"
                    >
                      Copy File
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[9px] text-slate-400 space-y-1 overflow-x-auto max-h-64 select-all scrollbar-thin text-left">
                    <div className="text-red-400 italic font-sans font-bold select-none"># Vercel Configuration</div>
                    <div>VITE_RAZORPAY_KEY_ID=your_key_id</div>
                    <div>VITE_FIREBASE_API_KEY=api_key</div>
                    <div>VITE_FIREBASE_AUTH=domain_auth</div>
                    <div>VITE_FIREBASE_PROJECT_ID=project_id</div>
                    <div className="h-2"></div>
                    <div className="text-red-400 italic font-sans font-bold select-none"># Render Configuration</div>
                    <div>PORT=3000</div>
                    <div>NODE_ENV=production</div>
                    <div>GEMINI_API_KEY=your_gemini_key</div>
                    <div>RAZORPAY_KEY_SECRET=razorpay_secret</div>
                    <div>FIREBASE_SERVICE_ACCOUNT=service_key</div>
                    <div>FCM_SERVER_KEY=fcm_server_token</div>
                  </div>

                  <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-[10px] text-slate-300 leading-snug">
                    🔒 <strong className="text-red-400">Security Warning:</strong> Never upload these secret keys directly inside GitHub repositories. Provide them securely inside Vercel Dashboard and Render Web Service Environment settings instead.
                  </div>
                </div>

              </div>

              {/* MASTER PROMPT GENERATOR DRAWER */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-white text-md font-bold uppercase tracking-wide">Developer Master setup Prompt</h3>
                    <p className="text-[11px] text-slate-400">Copy this complete optimized prompt to easily initialize modern cloud resources</p>
                  </div>

                  <button 
                    onClick={() => {
                      const finalPrompt = `I want to deploy a full-stack Dream11-style exam league app called "Udhan Exam League" with Vercel, Render, Firebase Firestore DB, Firebase Auth (OTP + Google + Email), Razorpay, FCM notifications, and Google Gemini API. Please follow these setup coordinates for a production-ready system:\n\n1. FRONTEND HOSTING (Vercel):\n- Connect GitHub repository for continuous integration (CI/CD) auto deployments.\n- Optimize for mobile-first views.\n- Configure Razorpay Checkout frame and client credentials.\n\n2. BACKEND HOSTING (Render):\n- Deploy Node.js + Express backend service from the subfolder.\n- Bind server on PORT 3000.\n- Mount Websockets support for instant, real-time leaderboard states.\n\n3. DATABASE & LOGIN (Firebase):\n- Provision Firebase Firestore database in secure lock mode.\n- Enable Email, Google Sign-In, and Phone Number OTP login.\n- Create a collection index for users, contests, wallet, and questions.\n\n4. GATEWAYS & SERVICES:\n- Connect Razorpay checkout for wallet add/recharge, online fees entries, and withdraw requests.\n- Push automatic user signals and live alarms using Firebase Cloud Messaging (FCM).\n- Connect Gemini API to generate instant standard MCQs for SSC, UPSC, Banking, UP State Police, and Railway tests.\n\nProvide clean codebase separation, secure CORS controls, structured environments, and fast loading parameters.`;
                      navigator.clipboard.writeText(finalPrompt);
                      onShowToast("📋 Developer Master System Prompt copied to clipboard!");
                    }}
                    className="bg-red-650 hover:bg-red-750 text-white text-xs font-bold py-2 px-5 rounded-lg border border-red-500/10 transition shrink-0"
                  >
                    Copy Master Prompt
                  </button>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4 max-h-[350px] overflow-y-auto select-all text-slate-200 text-xs leading-relaxed font-sans scrollbar-thin text-left">
                  <div className="text-red-500 font-extrabold uppercase text-[10px] tracking-wider select-none border-b border-slate-800 pb-1.5 mb-2 flex items-center gap-1.5">
                    📂 COPYABLE MASTER SYSTEM PROMPT
                  </div>
                  <p className="font-medium text-slate-300">
                    Copy the custom system deploy specifications below to use as a blueprint parameters guide for secondary orchestrators or deployment systems:
                  </p>
                  
                  <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-lg space-y-3 font-semibold text-slate-100">
                    <p>
                      <strong>System Setup Command Parameters Guide:</strong>
                    </p>
                    <p className="text-slate-350 bg-slate-950 p-3 rounded font-mono text-[10px] break-words whitespace-pre-wrap select-all">
{`Deploy a full-stack Dream11-style exam league app called "Udhan Exam League" with Vercel (Frontend), Render (Backup API), Firebase (Firestore and Auth), Razorpay (Payments Checkout), FCM (Alerts Notifications), and Google Gemini API (AI MCQ Generator). 

Follow these production-ready parameters:
1. Frontend Setup: Host React App on Vercel under auto-CI/CD. Ensure VITE_ environment variables are registered for Firebase Web SDK and Razorpay Client Keys.
2. Backend Deployment: Spin Node.js Express service on Render. Set active Environment keys: GEMINI_API_KEY, RAZORPAY_KEY_SECRET, and FIREBASE_SERVICE_ACCOUNT. Keep server active on port 3000 with CORS and Socket.io endpoints.
3. Database Setup: Provision Firebase Firestore Database. Enforce strict auth rules on collections: /users/{id}, /contests/{id}, and /wallet_transactions/{id}. Enable Phone OTP, Email, and Google login.
4. Services Configuration: Use Gemini 3.5 Flash for MCQ generator under subject modules. Standardize Razorpay payouts webhook receiver verification.`}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 11: SERVICES HUB (MARKETPLACE, ADMISSION, COURSE, LOAN) */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              
              {/* Header block with elegant description */}
              <div className="bg-gradient-to-r from-red-950 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <span className="bg-amber-600/35 text-amber-300 border border-amber-500/30 text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1.5 font-mono">
                      LIVE DRAWER SERVICES EDITOR
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">Active Drawer Services & Product Link Hub</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Configure custom target web redirection links or add real active products, admission registers, courses series and scholarship loans for target users here.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('udan_services_data');
                      window.location.reload();
                    }}
                    className="text-xs text-slate-400 hover:text-white bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
                  >
                    Reset to Default Data
                  </button>
                </div>
              </div>

              {/* SECTION SUB NAVIGATION CONTROL GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'marketplace', label: '🏪 Marketplace', desc: 'Notes, books & mock papers' },
                  { id: 'admission', label: '🎓 Admission Portal', desc: 'Online registration linkages' },
                  { id: 'course', label: '📚 Courses & Videos', desc: 'General chapters, test prep series' },
                  { id: 'loan', label: '💸 Education Loan', desc: 'Incentives & fees loans' }
                ].map((sec) => {
                  const isSecSelected = selectedSubService === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSubService(sec.id as any)}
                      className={`p-4 rounded-xl text-left transition select-none cursor-pointer border ${
                        isSecSelected 
                          ? 'bg-slate-900 border-red-650 shadow-md shadow-red-955' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-900/50 hover:border-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{sec.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{sec.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* CORE EDITORS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-medium text-xs">
                
                {/* 1. PASTE TARGET LINKS EDITOR (Left 1 col) */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                      🔗 Base Redirection Link
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Paste the fallback web redirect url target. If users click the category from their drawer, they will be redirected to this link.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Target Action Redirect Link</label>
                      <input
                        type="url"
                        placeholder="e.g. https://forms.gle/... or external portal link"
                        value={redirectLinkInput}
                        onChange={(e) => setRedirectLinkInput(e.target.value)}
                        className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-red-650"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setServicesData((prev: any) => ({
                          ...prev,
                          [selectedSubService]: {
                            ...prev[selectedSubService],
                            link: redirectLinkInput
                          }
                        }));
                        onShowToast(`✔️ Updated ${selectedSubService.toUpperCase()} redirection link safely.`);
                      }}
                      className="w-full bg-red-650 hover:bg-red-750 text-white font-bold text-xs py-2 rounded-xl transition shadow-md"
                    >
                      Save Redirect URL Link
                    </button>
                  </div>

                  {/* Quick Preview Tips */}
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-[10px] text-slate-400 leading-snug">
                    <span className="text-amber-400 font-bold block uppercase tracking-wider text-[8px] font-mono">🔥 Integration Preview Tip:</span>
                    When aspirants tap on {selectedSubService.toUpperCase()} in their side navigation drawer, the app will offer custom products or redirect them instantly!
                  </div>
                </div>

                {/* 2. ADD PRODUCTS & BENEFITS FORM (Middle col) */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 lg:col-span-2">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                      ➕ Add Product / Benefit Item Card
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Add a new item to offer inside this section. This will appear inside the interactive services dialog view for aspirants.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Item/Product Title</label>
                        <input
                          type="text"
                          placeholder="e.g. History Mock Test Series Guide"
                          value={newServiceName}
                          onChange={(e) => setNewServiceName(e.target.value)}
                          className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-650"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Price Badge / Special Tag</label>
                        <input
                          type="text"
                          placeholder="e.g. ₹199, FREE, or 0% APR"
                          value={newServicePrice}
                          onChange={(e) => setNewServicePrice(e.target.value)}
                          className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-650 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Item Description Brief</label>
                        <textarea
                          rows={2}
                          placeholder="Give a short bullet layout of benefits, syllabus, features..."
                          value={newServiceDesc}
                          onChange={(e) => setNewServiceDesc(e.target.value)}
                          className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-650"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Specific Item Action URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="Redirect specific buy/apply button link"
                          value={newServiceCustomLink}
                          onChange={(e) => setNewServiceCustomLink(e.target.value)}
                          className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-red-650"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newServiceName) {
                        onShowToast("❌ Error: Item Title cannot be blank!");
                        return;
                      }
                      const newItem = {
                        id: 'srv_' + Date.now(),
                        name: newServiceName,
                        price: newServicePrice || 'FREE',
                        description: newServiceDesc || 'Check online for features & details of eligibility.',
                        customLink: newServiceCustomLink || ''
                      };
                      setServicesData((prev: any) => ({
                        ...prev,
                        [selectedSubService]: {
                          ...prev[selectedSubService],
                          items: [...(prev[selectedSubService].items || []), newItem]
                        }
                      }));
                      setNewServiceName('');
                      setNewServicePrice('');
                      setNewServiceDesc('');
                      setNewServiceCustomLink('');
                      onShowToast(`🎉 Added "${newServiceName}" to ${selectedSubService.toUpperCase()}`);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition"
                  >
                    + Add New Service Item to Catalog
                  </button>
                </div>

              </div>

              {/* 3. CURRENT LIVE ITEMS LIST (Full Row width) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs font-medium">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      📑 Current Active Items in {selectedSubService.toUpperCase()}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      A total of {(servicesData[selectedSubService]?.items || []).length} items are registered live.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(servicesData[selectedSubService]?.items || []).length === 0 ? (
                    <div className="col-span-full py-8 text-center text-slate-400 text-xs font-mono bg-slate-950 rounded-xl border border-slate-850">
                      No products/items listed yet. Add items above to make them live.
                    </div>
                  ) : (
                    (servicesData[selectedSubService]?.items || []).map((item: any) => (
                      <div key={item.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between space-y-3 relative overflow-hidden group">
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-white font-bold text-xs leading-tight line-clamp-2">{item.name}</h5>
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-mono text-[9px] font-black shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">{item.description}</p>
                          {item.customLink && (
                            <div className="text-[9px] text-slate-500 font-mono truncate mt-1 bg-slate-900/40 p-1 rounded">
                              🔗 {item.customLink}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-850/60">
                          <span className="text-[9px] text-slate-400 font-mono">ID: {item.id}</span>
                          <button
                            onClick={() => {
                              setServicesData((prev: any) => ({
                                ...prev,
                                [selectedSubService]: {
                                  ...prev[selectedSubService],
                                  items: prev[selectedSubService].items.filter((it: any) => it.id !== item.id)
                                }
                              }));
                              onShowToast(`🗑️ Removed item from ${selectedSubService.toUpperCase()}`);
                            }}
                            className="text-red-450 hover:text-white p-1 rounded hover:bg-red-500/10 transition"
                            title="Remove from Catalog"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
