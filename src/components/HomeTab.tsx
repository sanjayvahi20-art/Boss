import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Play, Award, ChevronRight, GraduationCap, ShieldAlert, Train, Gamepad, 
  Wallet, UserCheck, Flame, Coins, BookOpen, Sparkles, Trophy, Brain, Zap, Clock, ArrowRight 
} from 'lucide-react';
import { Contest } from '../types';

interface HomeTabProps {
  onSwitchTab: (tab: 'home' | 'contests' | 'wallet' | 'leaderboard' | 'profile') => void;
  onOpenModal: (modal: 'addMoney' | 'withdraw' | 'friendBattle' | 'teamBattle' | 'referEarn' | 'shareScore' | 'editProfile') => void;
  featuredContest: Contest;
  contests: Contest[];
  onEnrollContest: (contestId: string) => void;
  onLaunchQuiz: (contest: Contest) => void;
}

export default function HomeTab({ onSwitchTab, onOpenModal, featuredContest, contests, onEnrollContest, onLaunchQuiz }: HomeTabProps) {
  const [slideIdx, setSlideIdx] = useState(0);

  // Auto scroll slider every 5 seconds (Exactly as requested)
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx((prev) => (prev === 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5">
      
      {/* Hero Carousels (Sliders) */}
      <div className="relative overflow-hidden rounded-2xl shadow-md border border-gray-150">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${slideIdx * 100}%)`,
            width: '100%',
          }}
        >
          {/* Slide 1: Play & Win Banner */}
          <div className="w-full flex-shrink-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-3 text-white relative h-40 flex items-center justify-between overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -left-6 -top-6 w-32 h-32 bg-red-500 rounded-full opacity-15 blur-xl"></div>
            
            {/* Left Mascot: Student Boy */}
            <div className="flex flex-col items-center justify-center shrink-0 z-10 mr-1">
              <div className="w-12 h-12 rounded-full border-2 border-blue-400 overflow-hidden bg-slate-800 p-0.5 shadow-md relative">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop" 
                  alt="Student Boy" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[7px] font-bold text-blue-300 mt-1 uppercase tracking-widest bg-blue-950/80 px-1 py-0.5 rounded border border-blue-800/40">
                Topper Boy
              </span>
            </div>

            {/* Middle Content: Focus on India's First Exam Battle Arena */}
            <div className="flex-1 flex flex-col justify-between h-full py-1 text-center px-1 z-10">
              <div>
                <span className="bg-gradient-to-r from-red-600 to-yellow-500 text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  🔥 India's #1 Exam Battle Arena
                </span>
                <h2 className="text-sm md:text-base font-black mt-2 leading-tight">
                  LEARN, EARN & WIN <br />
                  <span className="text-yellow-400">REAL CASH PRIZES</span>
                </h2>
                <p className="text-[9px] text-gray-300 mt-0.5 max-w-[200px] mx-auto leading-tight">
                  Learn, Earn and Win! Apni taiyari ko aazmayein aur har roz bada inaam jeetein!
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <button
                  onClick={() => onSwitchTab('contests')}
                  className="bg-gradient-to-r from-red-650 to-yellow-500 hover:from-red-550 hover:to-yellow-450 text-white text-[9px] font-black px-4 py-1 rounded-lg shadow-md hover:scale-105 transform transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  Enroll Now <Play size={8} className="fill-white animate-bounce" />
                </button>
              </div>
            </div>

            {/* Right Mascot: Student Girl */}
            <div className="flex flex-col items-center justify-center shrink-0 z-10 ml-1">
              <div className="w-12 h-12 rounded-full border-2 border-pink-400 overflow-hidden bg-slate-800 p-0.5 shadow-md relative">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop" 
                  alt="Student Girl" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[7px] font-bold text-pink-300 mt-1 uppercase tracking-widest bg-pink-950/80 px-1 py-0.5 rounded border border-pink-800/40">
                Topper Girl
              </span>
            </div>
          </div>

          {/* Slide 2: Gyan aur Samriddhi Circular Logo Mascot Banner */}
          <div className="w-full flex-shrink-0 bg-gradient-to-br from-red-950 via-rose-950 to-slate-900 p-4 text-white relative h-40 flex items-center space-x-3.5">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-500 rounded-full opacity-15 blur-xl"></div>
            {/* Real circular mascot emblem drawing mockup */}
            <div className="w-20 h-20 shrink-0 bg-white rounded-full p-1 flex items-center justify-center shadow-2xl border-2 border-yellow-400 relative">
              <div className="absolute -inset-0.5 bg-yellow-400 rounded-full opacity-30 animate-ping" />
              {/* High Quality book emblem represent Gyan Samriddhi mascot */}
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop"
                alt="Gyan Mascot"
                className="w-full h-full object-cover rounded-full bg-slate-50 border border-slate-200"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full py-1">
              <div>
                <h4 className="text-xs font-black text-yellow-400 tracking-wide">
                  ज्ञान और समृद्धि <br />
                  <span className="text-[10px] font-bold text-white uppercase block mt-0.5">Books & Prosperity</span>
                </h4>
                <p className="text-[9px] text-gray-300 mt-1 leading-snug">
                  "Padho aur Kamao" movement ka hissa banein aur rewards earn karein daily.
                </p>
              </div>
              <button
                onClick={() => onSwitchTab('contests')}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-[10px] font-black px-3 py-1 rounded-lg self-start shadow transform transition"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>

        {/* Carousel slide indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
          <button
            onClick={() => setSlideIdx(0)}
            className={`w-2 h-2 rounded-full transition-all ${slideIdx === 0 ? 'bg-white w-4' : 'bg-white/50'}`}
          />
          <button
            onClick={() => setSlideIdx(1)}
            className={`w-2 h-2 rounded-full transition-all ${slideIdx === 1 ? 'bg-white w-4' : 'bg-white/50'}`}
          />
        </div>
      </div>

      {/* Top Winners Slider (No border-frame style, perfectly integrated) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-extrabold text-slate-800 text-xs tracking-wide flex items-center gap-1.5">
            <span className="text-yellow-500 text-base">🏆</span> Top Winners
          </h3>
          <button
            onClick={() => onSwitchTab('leaderboard')}
            className="text-[11px] text-slate-500 hover:text-red-600 font-extrabold flex items-center gap-0.5 transition"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>

        {/* Carousel Winners list */}
        <div className="flex space-x-2.5 overflow-x-auto no-scrollbar py-1 px-1">
          {/* Winner 1 */}
          <div className="flex-shrink-0 bg-white border border-slate-100 rounded-xl py-1.5 px-3 flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-500 hover:scale-105 transition flex items-center justify-center border border-white font-black text-xs text-white">R</div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-800 leading-tight">Rohit</p>
              <p className="text-[10px] font-black text-amber-500">₹12,500</p>
            </div>
          </div>
          {/* Winner 2 */}
          <div className="flex-shrink-0 bg-white border border-slate-100 rounded-xl py-1.5 px-3 flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-500 hover:scale-105 transition flex items-center justify-center border border-white font-black text-xs text-white">P</div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-800 leading-tight">Priya</p>
              <p className="text-[10px] font-black text-amber-500">₹9,800</p>
            </div>
          </div>
          {/* Winner 3 */}
          <div className="flex-shrink-0 bg-white border border-slate-100 rounded-xl py-1.5 px-3 flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-500 hover:scale-105 transition flex items-center justify-center border border-white font-black text-xs text-white">A</div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-800 leading-tight">Amit</p>
              <p className="text-[10px] font-black text-amber-500">₹7,600</p>
            </div>
          </div>
          {/* Winner 4 */}
          <div className="flex-shrink-0 bg-white border border-slate-100 rounded-xl py-1.5 px-3 flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-500 hover:scale-105 transition flex items-center justify-center border border-white font-black text-xs text-white">S</div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-800 leading-tight">Sandeep</p>
              <p className="text-[10px] font-black text-amber-500">₹5,400</p>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Your Exam / Category Selection cards with real stock background images */}
      <div>
        <h3 className="font-extrabold text-slate-800 text-xs mb-3 px-1 tracking-wide flex items-center gap-1.5">
          <span>📚</span> Choose Your Exam / परीक्षा चुनें
        </h3>
        <div className="grid grid-cols-3 gap-3">
          
          {/* SSC Category */}
          <div
            onClick={() => onSwitchTab('contests')}
            className="relative h-28 rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-150 transition-all hover:shadow-md hover:scale-[1.02]"
          >
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop"
              alt="SSC Prep Desk Books"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
            <div className="absolute inset-0 z-20 p-2 flex flex-col justify-between items-center text-center">
              <div className="w-8 h-8 rounded-full bg-red-600/90 border border-white/20 flex items-center justify-center mt-2 shadow-sm">
                <GraduationCap size={14} className="text-white" />
              </div>
              <div className="mb-1 leading-none">
                <p className="text-white text-[11px] font-extrabold uppercase tracking-wider">SSC</p>
                <p className="text-[9px] text-gray-300">एसएससी</p>
              </div>
            </div>
          </div>

          {/* UPSC Category */}
          <div
            onClick={() => onSwitchTab('contests')}
            className="relative h-28 rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-150 transition-all hover:shadow-md hover:scale-[1.02]"
          >
            <img
              src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=200&auto=format&fit=crop"
              alt="UPSC Constitution Study library"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
            <div className="absolute inset-0 z-20 p-2 flex flex-col justify-between items-center text-center">
              <div className="w-8 h-8 rounded-full bg-yellow-550/95 border border-white/20 flex items-center justify-center mt-2 shadow-sm">
                <Award size={14} className="text-white" />
              </div>
              <div className="mb-1 leading-none">
                <p className="text-white text-[11px] font-extrabold uppercase tracking-wider">UPSC</p>
                <p className="text-[9px] text-gray-300">यूपीएससी</p>
              </div>
            </div>
          </div>

          {/* Railways Category */}
          <div
            onClick={() => onSwitchTab('contests')}
            className="relative h-28 rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-150 transition-all hover:shadow-md hover:scale-[1.02]"
          >
            <img
              src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&auto=format&fit=crop"
              alt="Railway Indian station abstraction"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
            <div className="absolute inset-0 z-20 p-2 flex flex-col justify-between items-center text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600/90 border border-white/20 flex items-center justify-center mt-2 shadow-sm">
                <Train size={14} className="text-white" />
              </div>
              <div className="mb-1 leading-none">
                <p className="text-white text-[11px] font-extrabold uppercase tracking-wider">Railway</p>
                <p className="text-[9px] text-gray-300">रेलवे</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Navigation Panel */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Navigation</h4>
        <div className="grid grid-cols-4 gap-1 text-center">
          <button
            onClick={() => onSwitchTab('contests')}
            className="flex flex-col items-center p-1.5 rounded-xl hover:bg-red-50/50 transition duration-150 group"
          >
            <div className="w-10 h-10 bg-red-150 text-red-650 rounded-full flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition">
              <Gamepad size={16} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">Contests</span>
          </button>

          <button
            onClick={() => onSwitchTab('wallet')}
            className="flex flex-col items-center p-1.5 rounded-xl hover:bg-yellow-50/50 transition duration-150 group"
          >
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition">
              <Wallet size={16} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">Add Money</span>
          </button>

          <button
            onClick={() => onSwitchTab('leaderboard')}
            className="flex flex-col items-center p-1.5 rounded-xl hover:bg-blue-50/50 transition duration-150 group"
          >
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition">
              <Award size={16} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">Rankings</span>
          </button>

          <button
            onClick={() => onOpenModal('friendBattle')}
            className="flex flex-col items-center p-1.5 rounded-xl hover:bg-purple-50/50 transition duration-150 group"
          >
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition">
              <Users size={16} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">1v1 Battle</span>
          </button>
        </div>
      </div>

      {/* Live & Upcoming Contests List styled with premium 4-side red-to-pink border */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-slate-800 text-xs tracking-wide flex items-center gap-1.5">
            <span className="text-[#ff2040] text-base">🔥</span> Live & Upcoming Contests / लाइव और आगामी प्रतियोगिताएं
          </h3>
          <button
            onClick={() => onSwitchTab('contests')}
            className="text-[11px] text-[#ff2040] hover:text-[#e01030] font-extrabold flex items-center gap-0.5 transition"
          >
            See All <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-4">
          {contests.filter(c => c.status === 'live' || c.status === 'upcoming').map((contest, idx) => {
            const isLive = contest.status === 'live';
            const isUpcoming = contest.status === 'upcoming';
            const isCompleted = contest.status === 'completed';

            // Helper to format slot counts into elegant shorthand counters (e.g. 1.2K / 2K) matching the image
            const formatSlots = (num: number) => {
              if (num >= 1000) {
                return (num / 1000).toFixed(1).replace('.0', '') + 'K';
              }
              return num.toLocaleString();
            };

            // Dynamic presentation variables for each type of mock theme matching the card screenshot
            let accentRing = 'from-rose-500 via-red-500 to-pink-500';
            let ringGlow = 'rgba(239, 68, 68, 0.12)';
            let iconColor = 'text-red-500';
            let defaultIcon = <Brain className="w-6 h-6 stroke-[2]" />;
            let contestThemeBar = 'bg-red-500';
            let timerBadgeBg = 'bg-red-50/75 text-red-600 border-red-100';
            let timerLabelText = '01:20:45 Left';
            let statusBadge = (
              <span className="text-[9px] font-black bg-[#ff2040] text-white px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0">
                FEATURED
              </span>
            );

            // Determine presentation states based on the specific content index or entry fees
            if (contest.entryFee === 0) {
              accentRing = 'from-violet-500 via-purple-500 to-indigo-500';
              ringGlow = 'rgba(139, 92, 246, 0.12)';
              iconColor = 'text-purple-600';
              defaultIcon = <GraduationCap className="w-6 h-6 stroke-[2]" />;
              contestThemeBar = 'bg-purple-600';
              timerBadgeBg = 'bg-red-50/70 text-red-600 border-red-100';
              timerLabelText = '00:45:12 Left';
              statusBadge = (
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0">
                  FREE
                </span>
              );
            } else if (idx % 2 === 1) {
              accentRing = 'from-amber-400 via-orange-500 to-yellow-500';
              ringGlow = 'rgba(245, 158, 11, 0.12)';
              iconColor = 'text-amber-500';
              defaultIcon = <Zap className="w-6 h-6 stroke-[2]" />;
              contestThemeBar = 'bg-amber-500';
              timerBadgeBg = 'bg-red-50/70 text-red-600 border-red-100';
              timerLabelText = '02:15:30 Left';
              statusBadge = (
                <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0 flex items-center gap-1">
                  👑 PREMIUM
                </span>
              );
            } else {
              accentRing = 'from-blue-400 via-cyan-500 to-indigo-500';
              ringGlow = 'rgba(59, 130, 246, 0.12)';
              iconColor = 'text-blue-500';
              defaultIcon = <Award className="w-6 h-6 stroke-[2]" />;
              contestThemeBar = 'bg-blue-600';
              timerBadgeBg = 'bg-slate-50 text-slate-500 border-slate-100';
              timerLabelText = isCompleted ? 'Concluded' : '03:10:00 Left';
              statusBadge = (
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0">
                  SPEED LEAGUE
                </span>
              );
            }

            return (
              <div
                key={contest.id}
                className="p-[3px] bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-[28px] shadow-[0_6px_20px_rgba(239,68,68,0.12)] hover:shadow-[0_8px_32px_rgba(239,68,68,0.2)] transition-all duration-300 hover:scale-[1.008]"
              >
                <div className="bg-white rounded-[25px] p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 w-full h-full">
                  {/* Visual Circle & Title & Stats Container */}
                  <div className="flex flex-1 items-center gap-4 min-w-0">
                    <div className="relative shrink-0 flex items-center justify-center">
                      <div 
                        className={`w-[68px] h-[68px] rounded-full bg-gradient-to-tr ${accentRing} p-[3px] flex items-center justify-center`}
                        style={{ boxShadow: `0 4px 14px ${ringGlow}` }}
                      >
                        <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center">
                          <span className={iconColor}>{defaultIcon}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h3 className="text-sm font-black text-slate-850 truncate tracking-tight uppercase leading-tight">
                          {contest.title}
                        </h3>
                        {statusBadge}
                      </div>

                      <div className="grid grid-cols-3 gap-2 max-w-sm pt-0.5">
                        <div>
                          <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase block mb-0.5">Prize Pool</span>
                          <span className="text-[13px] font-black text-slate-800 leading-none">
                            ₹{contest.totalPrize.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase block mb-0.5">Entry Fee</span>
                          <span className="text-[13px] font-black text-slate-800 leading-none">
                            {contest.entryFee === 0 ? <span className="text-green-600 font-extrabold">FREE</span> : `₹${contest.entryFee}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase block mb-0.5">Spots</span>
                          <span className="text-[13px] font-black text-slate-800 leading-none">
                            {formatSlots(contest.registeredSlots)} / {formatSlots(contest.totalSlots)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1.5">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-sm">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${contestThemeBar}`}
                            style={{ width: `${(contest.registeredSlots / contest.totalSlots) * 100}%` }}
                          />
                        </div>
                        
                        <p className="text-[10px] font-black tracking-tight text-slate-500/90 flex items-center gap-1">
                          {contest.status === 'live' ? (
                            <>
                              <span className="text-[#ff2040]">🔥</span> 
                              <span>Only {contest.totalSlots - contest.registeredSlots} spots left!</span>
                            </>
                          ) : contest.status === 'upcoming' ? (
                            <>
                              <span className="text-amber-500">⚡</span> 
                              <span>Almost Full!</span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-500">🔥</span> 
                              <span>Hurry, Few spots left!</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Column */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t border-slate-55 md:border-0 w-full md:w-auto">
                    <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 ${timerBadgeBg} text-[10px] font-black shadow-xs shrink-0 tracking-wide uppercase`}>
                      <Clock size={11} className="stroke-[2.5]" />
                      <span>{timerLabelText}</span>
                    </div>

                    <div className="w-auto md:w-full">
                      {contest.isTaken ? (
                        <span className="inline-block bg-slate-50 text-slate-400 text-[11px] font-black py-2.5 px-5 rounded-[18px] border border-slate-150 tracking-wider text-center min-w-[100px]">
                          Submitted ✓
                        </span>
                      ) : contest.hasRegistered ? (
                        <button
                          type="button"
                          onClick={() => onLaunchQuiz(contest)}
                          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-[1.01] text-white text-[11px] font-black py-2.5 px-5 rounded-[18px] shadow-sm uppercase tracking-wider animate-pulse flex items-center justify-center gap-1 cursor-pointer min-w-[100px]"
                        >
                          Start <ArrowRight size={11} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEnrollContest(contest.id)}
                          className="bg-[#ff2040] hover:bg-[#e01030] text-white text-[11px] font-black py-2.5 px-6 rounded-[18px] shadow-md hover:shadow-lg transition-all active:scale-[0.97] duration-150 uppercase tracking-wider block text-center min-w-[110px] cursor-pointer"
                        >
                          Join Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
