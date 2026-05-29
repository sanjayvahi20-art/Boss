import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Zap, Clock, Users, Gift, ShieldCheck, Sparkles, Brain, GraduationCap, Award } from 'lucide-react';
import { Contest } from '../types';

interface ContestsTabProps {
  contests: Contest[];
  onEnrollContest: (id: string) => void;
  onLaunchQuiz: (contest: Contest) => void;
}

type ContestFilter = 'all' | 'live' | 'upcoming' | 'free' | 'completed';

export default function ContestsTab({ contests, onEnrollContest, onLaunchQuiz }: ContestsTabProps) {
  const [filter, setFilter] = useState<ContestFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter contests based on active selector tabs & category badges
  const filteredContests = contests.filter((c) => {
    const matchesStatus = filter === 'all' || c.status === filter;
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const categories = ['All', 'SSC', 'UPSC', 'Railway', 'UP Police'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-slate-800">Contest Arena</h2>
        <span className="text-[10px] font-black bg-red-100 text-red-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Active Leagues
        </span>
      </div>

      {/* Categories Badge Rows */}
      <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition ${
                isActive
                  ? 'bg-red-650 text-white shadow-sm'
                  : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sub-Navigation Tabs: Live, Upcoming, Free, Completed */}
      <div className="grid grid-cols-5 gap-1 bg-slate-200 p-1 rounded-xl">
        {(['all', 'live', 'upcoming', 'free', 'completed'] as ContestFilter[]).map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg text-[10px] uppercase tracking-wider font-extrabold py-2 text-center transition ${
                isActive
                  ? 'bg-white text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-850'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* CONTEST CARDS CONTAINER (Dynamic unique frames matching user's image) */}
      <div className="space-y-4 pt-1">
        {filteredContests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-slate-200 text-slate-400 font-medium animate-fade-in">
            No active contests found under this selection.
          </div>
        ) : (
          filteredContests.map((contest, idx) => {
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
              // Free challenge style
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
              // Golden Premium challenge matches style #3 "Rapid Fire"
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
              // Fallback style for other content rows
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
                    {/* Left Side: Circular accent ring housing vector symbol */}
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

                    {/* Middle Column: Title Row, Stats grid, progress line, & live status tags */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Title + category indicator Row */}
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h3 className="text-sm font-black text-slate-850 truncate tracking-tight uppercase leading-tight">
                          {contest.title}
                        </h3>
                        {statusBadge}
                      </div>

                      {/* Highly clean grid of 3 Columns matching the table exactly */}
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

                      {/* Progress slider bar & Only slots alert */}
                      <div className="space-y-1 pt-1.5">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-sm">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${contestThemeBar}`}
                            style={{ width: `${(contest.registeredSlots / contest.totalSlots) * 100}%` }}
                          />
                        </div>
                        
                        {/* Interactive alert status text below progress track */}
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
                          ) : isCompleted ? (
                            <>
                              <span className="text-slate-400">✓</span> 
                              <span>Concluded cleanly</span>
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

                  {/* Right Side Column: Timer display & "Join Now" Action Button */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t border-slate-55 md:border-0 w-full md:w-auto">
                    {/* Timer capsule with soft border and clocks icon */}
                    <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 ${timerBadgeBg} text-[10px] font-black shadow-xs shrink-0 tracking-wide uppercase`}>
                      <Clock size={11} className="stroke-[2.5]" />
                      <span>{timerLabelText}</span>
                    </div>

                    {/* Red/Amber Pill Button triggering action flow */}
                    <div className="w-auto md:w-full">
                      {isCompleted ? (
                        <button
                          type="button"
                          onClick={() => alert(`This contest concluded with secure results. Score was logged as ${contest.score || 4}/5.`)}
                          className="bg-slate-100 text-slate-600 text-[11px] font-black py-2.5 px-5 rounded-[18px] transition cursor-pointer hover:bg-slate-200 block text-center min-w-[100px]"
                        >
                          Details
                        </button>
                      ) : contest.isTaken ? (
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
          })
        )}
      </div>
    </div>
  );
}
