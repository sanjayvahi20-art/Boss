import { useState } from 'react';
import { Trophy, Medal, Star, Shield, Play } from 'lucide-react';
import { LeaderboardPlayer } from '../types';

interface LeaderboardTabProps {
  players: LeaderboardPlayer[];
}

export default function LeaderboardTab({ players }: LeaderboardTabProps) {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('daily');

  // Top podium contenders
  const firstPlace = players.find((p) => p.rank === 1);
  const secondPlace = players.find((p) => p.rank === 2);
  const thirdPlace = players.find((p) => p.rank === 3);

  // Table contenders (ranks 4 and onwards)
  const tablePlayers = players.filter((p) => p.rank > 3);

  return (
    <div className="space-y-4">
      {/* Standings Filter switchboard */}
      <div className="grid grid-cols-4 gap-1 bg-slate-200 p-1 rounded-xl text-center">
        {(['daily', 'weekly', 'monthly', 'alltime'] as const).map((type) => {
          const isActive = filter === type;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-lg uppercase text-[9px] font-black py-2 tracking-wide transition ${
                isActive
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Podium Platform structure */}
      <div className="bg-gradient-to-t from-slate-950 to-slate-900 rounded-2xl p-4 text-white text-center shadow-lg border border-yellow-500/10 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-radial from-red-650/10 to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-end pt-5 pb-1 relative z-10">
          {/* Rank 2 (Left) */}
          {secondPlace && (
            <div className="w-1/3 flex flex-col items-center">
              <div className="relative">
                <div className="w-11 h-11 rounded-full border-2 border-slate-300 overflow-hidden bg-slate-800 flex items-center justify-center shadow-md relative">
                  <span className="text-xs font-black text-slate-300">{secondPlace.avatarText}</span>
                </div>
                <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-slate-300 text-slate-950 text-[9px] px-2 py-0.5 rounded-full font-black shadow-sm">
                  2
                </span>
              </div>
              <p className="text-[11px] font-black mt-2 truncate max-w-full text-slate-100">{secondPlace.name}</p>
              <p className="text-[10px] text-yellow-400 font-bold">{secondPlace.winnings}</p>
              <span className="text-[8px] text-slate-400 font-semibold">{secondPlace.score} Points</span>
              {secondPlace.correctAnswers !== undefined && (
                <span className="text-[8px] text-slate-300 font-extrabold block">{secondPlace.correctAnswers}/5 Ans ({secondPlace.timeSpentSeconds}s)</span>
              )}
            </div>
          )}

          {/* Rank 1 (Center) */}
          {firstPlace && (
            <div className="w-1/3 flex flex-col items-center">
              <div className="relative -top-3">
                <div className="w-14 h-14 rounded-full border-4 border-yellow-400 overflow-hidden bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 relative flex items-center justify-center shadow-xl">
                  <div className="w-full h-full bg-slate-900/90 rounded-full flex items-center justify-center">
                    <span className="text-base font-black text-yellow-300">{firstPlace.avatarText}</span>
                  </div>
                </div>
                <span className="absolute -top-4.5 right-1/2 translate-x-1/2 bg-yellow-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce shadow-md">
                  👑 1
                </span>
              </div>
              <p className="text-xs font-black truncate max-w-full text-yellow-300 relative -top-2">{firstPlace.name}</p>
              <p className="text-xs text-yellow-400 font-black relative -top-2">{firstPlace.winnings}</p>
              <span className="text-[9px] text-slate-300 font-extrabold relative -top-2">{firstPlace.score} Points</span>
              {firstPlace.correctAnswers !== undefined && (
                <span className="text-[8px] text-yellow-300 font-extrabold block relative -top-2">{firstPlace.correctAnswers}/5 Ans ({firstPlace.timeSpentSeconds}s)</span>
              )}
            </div>
          )}

          {/* Rank 3 (Right) */}
          {thirdPlace && (
            <div className="w-1/3 flex flex-col items-center">
              <div className="relative">
                <div className="w-11 h-11 rounded-full border-2 border-amber-600 overflow-hidden bg-purple-950 flex items-center justify-center shadow-md relative">
                  <span className="text-xs font-black text-amber-500">{thirdPlace.avatarText}</span>
                </div>
                <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-amber-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black shadow-sm">
                  3
                </span>
              </div>
              <p className="text-[11px] font-black mt-2 truncate max-w-full text-slate-100">{thirdPlace.name}</p>
              <p className="text-[10px] text-yellow-400 font-bold">{thirdPlace.winnings}</p>
              <span className="text-[8px] text-slate-400 font-semibold">{thirdPlace.score} Points</span>
              {thirdPlace.correctAnswers !== undefined && (
                <span className="text-[8px] text-slate-300 font-extrabold block">{thirdPlace.correctAnswers}/5 Ans ({thirdPlace.timeSpentSeconds}s)</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Standings list */}
      <div className="space-y-2">
        {/* Header markers */}
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">
          <span>Rank & Player</span>
          <div className="flex space-x-12">
            <span>Score</span>
            <span>Winnings</span>
          </div>
        </div>

        {tablePlayers.map((player) => {
          const isMe = player.isCurrentUser;
          return (
            <div
              key={player.rank}
              className={`p-3 rounded-2xl flex justify-between items-center shadow-sm border transition-all ${
                isMe
                  ? 'bg-red-50/50 border-red-500 ring-1 ring-red-500/20'
                  : 'bg-white border-slate-100 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-extrabold w-4 text-center ${isMe ? 'text-red-650' : 'text-slate-400'}`}>
                  {player.rank}
                </span>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    isMe ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {player.avatarText}
                </div>

                <div>
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    {player.name}
                    {isMe && <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-wider">YOU</span>}
                  </span>
                  {player.correctAnswers !== undefined && player.timeSpentSeconds !== undefined ? (
                    <span className="text-[9.5px] text-slate-500 font-bold block mt-0.5">
                      🎖️ {player.correctAnswers}/5 Correct in <span className="text-red-750 font-extrabold">{player.timeSpentSeconds}s</span>
                    </span>
                  ) : (
                    <span className="text-[9.5px] text-slate-500 font-bold block mt-0.5">
                      🎖️ Exam Rank Verified
                    </span>
                  )}
                  {player.badge && (
                    <span className="text-[8px] text-amber-600 bg-amber-50 font-black px-1.5 py-px rounded uppercase block w-max mt-0.5">
                      {player.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-8 items-center text-right font-mono">
                <span className="text-xs font-extrabold text-slate-500 w-12 text-center">
                  {player.score}
                </span>
                <span className={`text-xs font-black w-14 text-right ${isMe ? 'text-red-650' : 'text-slate-800'}`}>
                  {player.winnings}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
