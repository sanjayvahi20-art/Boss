import { motion } from 'motion/react';
import { PlusCircle, Landmark, Receipt, Percent, Tag, Plus, Minus, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';

interface WalletTabProps {
  balance: number;
  transactions: Transaction[];
  onOpenModal: (modal: 'addMoney' | 'withdraw' | 'friendBattle' | 'teamBattle' | 'referEarn' | 'shareScore') => void;
}

export default function WalletTab({ balance, transactions, onOpenModal }: WalletTabProps) {
  return (
    <div className="space-y-4">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-red-650 to-rose-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-[10px] text-red-100 uppercase tracking-widest font-black">Total Balance</p>
            <h3 className="text-3xl font-black mt-1 flex items-baseline">
              <span className="text-xl mr-0.5">₹</span>
              <span className="tracking-tight">{balance.toFixed(2)}</span>
            </h3>
          </div>
          <button
            onClick={() => onOpenModal('addMoney')}
            className="bg-white text-red-650 hover:bg-yellow-100 hover:scale-[1.02] active:scale-95 transition-all duration-155 px-4 py-2 rounded-xl text-xs font-black shadow flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Money
          </button>
        </div>

        {/* Split breakdown values */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 mt-4 pt-3.5 text-center relative z-10">
          <div>
            <p className="text-[9px] text-red-200 font-bold uppercase tracking-wide">Winnings</p>
            <p className="text-xs font-black text-white">₹{(balance * 0.75).toFixed(2)}</p>
          </div>
          <div className="border-x border-white/10">
            <p className="text-[9px] text-red-200 font-bold uppercase tracking-wide">Bonus</p>
            <p className="text-xs font-black text-white">₹{(balance * 0.15).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[9px] text-red-200 font-bold uppercase tracking-wide">Cashback</p>
            <p className="text-xs font-black text-white">₹{(balance * 0.1).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div
          onClick={() => onOpenModal('addMoney')}
          className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:bg-red-50/50 transition duration-150 flex flex-col items-center justify-center group"
        >
          <PlusCircle className="text-red-650 group-hover:scale-110 transition duration-150" size={18} />
          <p className="text-[10px] font-black text-slate-700 mt-1.5">Add Cash</p>
        </div>

        <div
          onClick={() => onOpenModal('withdraw')}
          className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:bg-red-50/50 transition duration-150 flex flex-col items-center justify-center group"
        >
          <Landmark className="text-slate-650 group-hover:scale-110 transition duration-150" size={18} />
          <p className="text-[10px] font-black text-slate-700 mt-1.5">Withdraw</p>
        </div>

        <div
          onClick={() => alert('Viewing historical Passbook statement details (All success transitions is cached)...')}
          className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:bg-red-50/50 transition duration-150 flex flex-col items-center justify-center group"
        >
          <Receipt className="text-slate-600 group-hover:scale-110 transition duration-150" size={18} />
          <p className="text-[10px] font-black text-slate-700 mt-1.5">Passbook</p>
        </div>

        <div
          onClick={() => alert('Promo Alert: Active users get ₹50 free on inviting coworkers this session!')}
          className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:bg-red-50/50 transition duration-150 flex flex-col items-center justify-center group"
        >
          <Tag className="text-slate-600 group-hover:scale-110 transition duration-150" size={18} />
          <p className="text-[10px] font-black text-slate-700 mt-1.5">Offers</p>
        </div>
      </div>

      {/* Withdrawal Form Banner row */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-150">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
          Withdraw to Bank / UPI
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs text-slate-600 font-bold">Primary UPI Account</span>
            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
              arjunraj@upi <span className="text-green-600 text-xs font-bold">🟢</span>
            </span>
          </div>

          <button
            onClick={() => onOpenModal('withdraw')}
            className="w-full bg-red-650 hover:bg-red-750 text-white font-extrabold py-3 rounded-xl text-xs shadow-sm transition active:scale-[0.99] uppercase tracking-wide"
          >
            Instant Withdraw (UPI)
          </button>
          <div className="flex justify-center items-center gap-1 text-[10px] text-slate-400 font-semibold">
            <AlertCircle size={12} />
            <span>Minimum withdrawal amount is ₹100 • Transferred in 2 Mins</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions component list */}
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-0.5">
          Recent Transactions
        </h4>
        <div className="space-y-2">
          {transactions.map((txn) => {
            const isAdd = txn.type === 'deposit' || txn.type === 'winnings' || txn.type === 'bonus' || txn.type === 'referral';
            return (
              <div
                key={txn.id}
                className="bg-white p-3 rounded-xl flex justify-between items-center border border-slate-100 shadow-sm transition hover:bg-slate-50/50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isAdd ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isAdd ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800">{txn.title}</h5>
                    <p className="text-[9px] text-slate-400 font-semibold">{txn.timestamp}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black ${isAdd ? 'text-green-600' : 'text-slate-800'}`}>
                    {isAdd ? '+' : '-'}₹{txn.amount.toFixed(2)}
                  </span>
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase block leading-none mt-0.5">
                    {txn.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
