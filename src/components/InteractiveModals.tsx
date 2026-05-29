import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Users, ShieldAlert, Award, Search, Sparkles, Send, Gift, QrCode, Smartphone, CreditCard, Landmark, CheckCircle, RefreshCw, Lock, ArrowLeft, Camera, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface InteractiveModalsProps {
  activeModal: 'addMoney' | 'withdraw' | 'friendBattle' | 'teamBattle' | 'referEarn' | 'shareScore' | 'editProfile' | null;
  onClose: () => void;
  walletBalance: number;
  onAddMoneyAction: (amount: number) => void;
  onWithdrawAction: (amount: number, upiId: string) => boolean;
  onReferEarnSuccess: (bonus: number) => void;
  referralCode: string;
  onStart1v1Battle: (subject: string, fee: number) => void;
  profile?: UserProfile;
  onUpdateProfile?: (name: string, avatarUrl: string) => void;
}

export default function InteractiveModals({
  activeModal,
  onClose,
  walletBalance,
  onAddMoneyAction,
  onWithdrawAction,
  onReferEarnSuccess,
  referralCode,
  onStart1v1Battle,
  profile,
  onUpdateProfile,
}: InteractiveModalsProps) {
  const [depositAmount, setDepositAmount] = useState('200');
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [withdrawalUpi, setWithdrawalUpi] = useState('arjunraj@upi');
  const [copied, setCopied] = useState(false);

  // Edit Profile States & Selectable Avatar Presets
  const AVAILABLE_AVATARS = [
    { id: 'mascot', name: 'Cadet Spec', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop' },
    { id: 'prodigy', name: 'Smart Cadet', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop' },
    { id: 'scholar_lady', name: 'Scholar Topper', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop' },
    { id: 'aspirant_girl', name: 'Aspirant Lady', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop' },
    { id: 'ias', name: 'IAS General', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop' },
    { id: 'warrior', name: 'Champ Warrior', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop' }
  ];

  const [editName, setEditName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  useEffect(() => {
    if (activeModal === 'editProfile' && profile) {
      setEditName(profile.name);
      setEditAvatarUrl(profile.avatarUrl || AVAILABLE_AVATARS[0].url);
    }
  }, [activeModal, profile]);

  // Share scorecard modal state variables
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customShareText, setCustomShareText] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [shareQuizName, setShareQuizName] = useState('SSC CGL Live Battle');
  const [shareScore, setShareScore] = useState('9/10');
  const [shareRank, setShareRank] = useState('#4');
  const [shareWinnings, setShareWinnings] = useState('₹150');

  // Payment gateway state machine variables
  const [paymentStep, setPaymentStep] = useState<'input' | 'gateway' | 'qr' | 'card' | 'processing' | 'success'>('input');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | ''>('');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [qrCounter, setQrCounter] = useState(300);
  const [txnId, setTxnId] = useState('');

  // Auto-generate txn id on gateway entry
  useEffect(() => {
    if (paymentStep === 'gateway' && !txnId) {
      setTxnId('TXN' + Math.floor(100000000 + Math.random() * 900000000).toString());
    }
  }, [paymentStep, txnId]);

  // Keep timer ticks
  useEffect(() => {
    let timerId: any;
    if (paymentStep === 'qr' && qrCounter > 0) {
      timerId = setInterval(() => {
        setQrCounter((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [paymentStep, qrCounter]);

  // Sync the share template default values with chosen tab selection and referral code dynamically
  useEffect(() => {
    if (activeModal === 'shareScore') {
      const liveUrl = typeof window !== 'undefined' ? (window.location.origin || 'https://udan.exam') : 'https://udan.exam';
      const templates = [
        `🏆 Bhai Gazab! Maine Udan Exam League par "${shareQuizName}" khela aur Rank ${shareRank} laakar ${shareWinnings} instantly won kiye! 💸 Mera score ${shareScore} rha! Tum bhi apni taiyari check karo aur live cash rashi jeeto! Use my referral code: ${referralCode} aur abhi join karo! 🚀 Join karke check karo: ${liveUrl}`,
        `क्या आप मुझसे बेहतर स्कोर कर सकते हैं? 🎯 मैंने उड़ान एग्जाम लीग (Udan Exam League) के "${shareQuizName}" में शानदार Rank ${shareRank} हासिल की है और ${shareWinnings} जीता है! मेरा स्कोर ${shareScore} रहा। आओ मुकाबला करें! मेरा कूपन कोड उपयोग करें: ${referralCode} और अभी ज्वाइन करें! ⚔️ लिंक: ${liveUrl}`,
        `Hey! I've been studying on Udan Exam League. Secure national database rankings and test your competitive exam skills with active practice questions under a real-time timer ⏱️ I scored ${shareScore} with Rank ${shareRank} in "${shareQuizName}" and unlocked ${shareWinnings}! Join me using code: ${referralCode} to claim a registration bonus! 🤝 Register: ${liveUrl}`
      ];
      setCustomShareText(templates[selectedTemplate] || templates[0]);
    }
  }, [selectedTemplate, referralCode, activeModal, shareQuizName, shareScore, shareRank, shareWinnings]);

  // Unified reset close handler
  const handleClose = () => {
    setPaymentStep('input');
    setSelectedUpiApp('');
    setCardNo('');
    setCardExpiry('');
    setCardCvv('');
    setCardHolder('');
    setQrCounter(300);
    setTxnId('');
    onClose();
  };
  
  // 1v1 friend battle state
  const [battleSubject, setBattleSubject] = useState('General Studies');
  const [battleFee, setBattleFee] = useState(15);
  const [isSearchingOpponent, setIsSearchingOpponent] = useState(false);
  const [matchedOpponent, setMatchedOpponent] = useState<{ name: string; level: number } | null>(null);

  // Clipboard copy helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitDeposit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(depositAmount);
    if (!isNaN(parsed) && parsed > 0) {
      setPaymentStep('gateway');
    }
  };

  const triggerAppPayment = () => {
    setPaymentStep('processing');
    const parsed = parseFloat(depositAmount);
    setTimeout(() => {
      if (!isNaN(parsed) && parsed > 0) {
        onAddMoneyAction(parsed);
      }
      setPaymentStep('success');
    }, 2000);
  };

  const submitWithdrawal = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(withdrawAmount);
    if (isNaN(parsed) || parsed < 100) {
      alert('Kripya ₹100 ya usse jyada ki rashi bharein.');
      return;
    }
    if (parsed > walletBalance) {
      alert('Aapke wallet mein paryapt balance nahi hai.');
      return;
    }

    const success = onWithdrawAction(parsed, withdrawalUpi);
    if (success) {
      onClose();
    }
  };

  // Refer Friend triggers simulation
  const handleSimulateReferral = () => {
    onReferEarnSuccess(100); // Give ₹100 bonus money!
    alert("🚀 Congratulations! Aapka refer code custom simulate ho gaya hai aur ₹100 Bonus Wallet main add kar diye gaye hain.");
    onClose();
  };

  // Launch find match
  const handleFind1v1Opponent = () => {
    if (walletBalance < battleFee) {
      alert(`1v1 match ke liye entry fee ₹${battleFee} hai. Kripya pehle wallet main cash add karein.`);
      return;
    }
    setIsSearchingOpponent(true);
    setMatchedOpponent(null);

    // Dynamic timeout for finding match
    setTimeout(() => {
      const opponents = [
        { name: 'Sanjay Vahj', level: 14 },
        { name: 'Priya Verma', level: 11 },
        { name: 'Rohan Deshmukh', level: 16 },
        { name: 'Vikash Shukla', level: 13 }
      ];
      const match = opponents[Math.floor(Math.random() * opponents.length)];
      setMatchedOpponent(match);
      setIsSearchingOpponent(false);
    }, 2500);
  };

  const handleStartMatchedGame = () => {
    onClose();
    onStart1v1Battle(battleSubject, battleFee);
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50/50 to-white">
          <div className="flex items-center gap-1.5">
            {activeModal === 'addMoney' && paymentStep !== 'input' && paymentStep !== 'success' && paymentStep !== 'processing' && (
              <button
                type="button"
                onClick={() => {
                  if (paymentStep === 'gateway') setPaymentStep('input');
                  else setPaymentStep('gateway');
                }}
                className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition mr-1 cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {activeModal === 'addMoney' && (
                paymentStep === 'input' ? 'Add Money to Wallet' :
                paymentStep === 'gateway' ? 'Secure Checkout Portal' :
                paymentStep === 'qr' ? 'Scan & Pay UPI QR' :
                paymentStep === 'card' ? 'New Card Payment' :
                paymentStep === 'processing' ? 'Securing Trxn...' :
                'Payment Status'
              )}
              {activeModal === 'withdraw' && 'Instant Withdrawal'}
              {activeModal === 'friendBattle' && '1v1 Live Friend Battle'}
              {activeModal === 'teamBattle' && 'Team Battle Room'}
              {activeModal === 'referEarn' && 'Refer & Earn Credits'}
              {activeModal === 'shareScore' && 'Share Scorecard'}
              {activeModal === 'editProfile' && 'Edit User Profile'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {/* 1. ADD MONEY INTEGRATED GATEWAY FLOW */}
          {activeModal === 'addMoney' && (
            <div className="space-y-4">
              
              {/* STEP A: INPUT AMOUNT AND PRESETS */}
              {paymentStep === 'input' && (
                <form onSubmit={submitDeposit} className="space-y-4">
                  <div className="text-center bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Wallet Balance</span>
                    <p className="text-2xl font-black text-gray-800 mt-1">₹{walletBalance.toFixed(2)}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Enter Amount to Add (₹)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-extrabold focus:outline-none focus:border-red-650"
                      placeholder="Enter cash amount (e.g., 200)"
                      min="10"
                      required
                    />
                  </div>

                  {/* Presets */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {['50', '100', '200', '500'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDepositAmount(val)}
                        className={`py-2 rounded-xl text-xs font-black border transition cursor-pointer ${
                          depositAmount === val
                            ? 'border-red-600 bg-red-50 text-red-700'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>

                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl text-[10px] font-semibold border border-yellow-150 flex items-start gap-1.5">
                    <Sparkles size={14} className="shrink-0 text-yellow-650" />
                    <span>Offers Available: Get 50% extra mock cashback on deposit of ₹200 or more! Auto applied.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-650 hover:bg-rose-700 text-white font-extrabold text-xs py-3.5 rounded-2xl transition shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    Select Payment Method
                  </button>
                </form>
              )}

              {/* STEP B: SECURE PAYMENT GATEWAY CENTRAL PORTAL */}
              {paymentStep === 'gateway' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl relative overflow-hidden text-center">
                    <p className="text-[10px] text-white/60 font-medium tracking-wider uppercase">Order Total Amount</p>
                    <p className="text-3xl font-black text-white mt-1">₹{parseFloat(depositAmount).toFixed(2)}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold bg-white/5 py-1 px-3.5 rounded-full border border-white/5">
                      <Lock size={10} /> PCI-DSS Compliant Gateway
                    </div>
                  </div>

                  {/* Popular Instant UPI Section */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Instant Apps (1-Tap Pay)</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => triggerAppPayment()}
                        className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl text-left transition duration-150 flex items-center gap-2.5 cursor-pointer hover:border-red-500/25 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs shrink-0 select-none shadow-xs group-hover:scale-105 transition">
                          G
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">Google Pay</p>
                          <p className="text-[8px] text-slate-400 font-bold">BHIM UPI</p>
                        </div>
                      </button>

                      <button
                        onClick={() => triggerAppPayment()}
                        className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl text-left transition duration-150 flex items-center gap-2.5 cursor-pointer hover:border-red-500/25 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-black text-purple-600 text-xs shrink-0 select-none shadow-xs group-hover:scale-105 transition">
                          Pe
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">PhonePe</p>
                          <p className="text-[8px] text-slate-400 font-bold">Fast Transfer</p>
                        </div>
                      </button>

                      <button
                        onClick={() => triggerAppPayment()}
                        className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl text-left transition duration-150 flex items-center gap-2.5 cursor-pointer hover:border-red-500/25 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center font-black text-cyan-600 text-xs shrink-0 select-none shadow-xs group-hover:scale-105 transition">
                          Py
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">Paytm Wallet</p>
                          <p className="text-[8px] text-slate-400 font-bold">Direct Cash</p>
                        </div>
                      </button>

                      <button
                        onClick={() => triggerAppPayment()}
                        className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl text-left transition duration-150 flex items-center gap-2.5 cursor-pointer hover:border-red-500/25 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600 text-xs shrink-0 select-none shadow-xs group-hover:scale-105 transition">
                          BH
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">BHIM UPI</p>
                          <p className="text-[8px] text-slate-400 font-bold">Govt Protocol</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* QR Code and Cards Option list */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">More Secure Methods</p>

                    {/* Scan QR Code button */}
                    <button
                      onClick={() => setPaymentStep('qr')}
                      className="w-full p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl text-left transition duration-150 flex items-center justify-between cursor-pointer hover:border-red-500/25 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-xl text-red-650 group-hover:scale-105 transition">
                          <QrCode size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">Scan BHIM UPI QR Code</p>
                          <p className="text-[9px] text-slate-400">Pay on any scanner app via camera</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-red-650 bg-red-50 rounded-lg px-2 py-0.5">Popular</span>
                    </button>

                    {/* Credit Card button */}
                    <button
                      onClick={() => setPaymentStep('card')}
                      className="w-full p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl text-left transition duration-150 flex items-center gap-3 cursor-pointer hover:border-red-500/25 group"
                    >
                      <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-105 transition">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">Credit / Debit Call Card</p>
                        <p className="text-[9px] text-slate-400">Visa, Mastercard, RuPay, Maestro</p>
                      </div>
                    </button>

                    {/* NetBanking Selection list */}
                    <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white/50">
                      <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Net Banking (Popular Indian Banks)</span>
                        <Landmark size={12} className="text-slate-400" />
                      </div>
                      <div className="grid grid-cols-4 divide-x divide-slate-100">
                        {['SBI', 'HDFC', 'ICICI', 'AXIS'].map((bank) => (
                          <button
                            key={bank}
                            onClick={() => triggerAppPayment()}
                            className="py-3 text-[10px] font-bold text-slate-700 hover:bg-slate-50 hover:text-red-650 transition cursor-pointer text-center"
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP C: DYNAMIC SCAN QR CODE */}
              {paymentStep === 'qr' && (
                <div className="text-center space-y-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Deposit Amount</p>
                    <p className="text-xl font-black text-slate-800 mt-0.5">₹{parseFloat(depositAmount).toFixed(2)}</p>
                  </div>

                  {/* High Quality Styled Mock QR Vector Canvas */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm inline-block mx-auto relative group">
                    <svg width="150" height="150" className="mx-auto select-none" viewBox="0 0 100 100">
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="22" height="22" fill="#000" rx="3" />
                      <rect x="9" y="9" width="14" height="14" fill="#fff" rx="2" />
                      <rect x="12" y="12" width="8" height="8" fill="#000" rx="1" />

                      {/* Corner 2 */}
                      <rect x="73" y="5" width="22" height="22" fill="#000" rx="3" />
                      <rect x="77" y="9" width="14" height="14" fill="#fff" rx="2" />
                      <rect x="80" y="12" width="8" height="8" fill="#000" rx="1" />

                      {/* Corner 3 */}
                      <rect x="5" y="73" width="22" height="22" fill="#000" rx="3" />
                      <rect x="9" y="77" width="14" height="14" fill="#fff" rx="2" />
                      <rect x="80" y="80" width="8" height="8" fill="#fff" />
                      <rect x="12" y="80" width="8" height="8" fill="#000" rx="1" />

                      {/* Center custom design element representing secure pay */}
                      <rect x="42" y="42" width="16" height="16" fill="#ff1c45" rx="3" />
                      <path d="M 46,50 H 54 M 50,46 V 54" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Random procedural mock QR code dots */}
                      <rect x="32" y="8" width="8" height="6" fill="#000" />
                      <rect x="45" y="15" width="6" height="10" fill="#000" />
                      <rect x="55" y="6" width="10" height="6" fill="#000" />
                      <rect x="32" y="24" width="6" height="12" fill="#000" />
                      <rect x="42" y="30" width="12" height="6" fill="#000" />
                      <rect x="12" y="35" width="10" height="6" fill="#000" />
                      <rect x="18" y="45" width="6" height="12" fill="#000" />
                      
                      <rect x="70" y="35" width="8" height="8" fill="#000" />
                      <rect x="85" y="30" width="6" height="14" fill="#000" />
                      <rect x="65" y="48" width="12" height="6" fill="#000" />
                      <rect x="80" y="52" width="6" height="12" fill="#000" />

                      <rect x="32" y="70" width="14" height="6" fill="#000" />
                      <rect x="40" y="80" width="6" height="14" fill="#000" />
                      <rect x="50" y="72" width="14" height="6" fill="#000" />
                      
                      <rect x="70" y="70" width="6" height="12" fill="#000" />
                      <rect x="78" y="85" width="14" height="6" fill="#000" />
                      <rect x="88" y="74" width="6" height="8" fill="#000" />
                    </svg>
                    {/* Pulsing red scanline indicator */}
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-red-650 opacity-45 shadow-lg shadow-red-500 animate-bounce"></div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">Scan this QR to Pay</p>
                    <p className="text-[10px] text-slate-400">QR is dynamic and secured with UPI Unified deep linking.</p>
                  </div>

                  {/* QR TIMER STATUS ROW */}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl max-w-xs mx-auto text-xs border border-slate-150 font-mono">
                    <span className="text-slate-400 font-sans font-bold uppercase tracking-wider text-[9px]">Expires In:</span>
                    <span className="text-red-600 font-black animate-pulse">{Math.floor(qrCounter / 60)}:{(qrCounter % 60).toString().padStart(2, '0')}</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => triggerAppPayment()}
                      className="w-full bg-gradient-to-r from-red-650 to-rose-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow transition cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <CheckCircle size={14} /> Simulate Scan & Pay Status
                    </button>
                    <p className="text-[9px] text-slate-400 text-center mt-1.5 font-medium leading-relaxed">
                      Testing link callback is live. Click above to complete full sandbox bank transaction immediately.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP D: CREDIT/DEBIT CARDS PAYMENT PANEL */}
              {paymentStep === 'card' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (cardNo.replace(/\s?/g, '').length < 16) {
                      alert('Kripya complete 16 digit card number entered kijiye.');
                      return;
                    }
                    if (cardExpiry.length < 5) {
                      alert('Valid expiry month/year enter kijiye.');
                      return;
                    }
                    if (cardCvv.length < 3) {
                      alert('Kripya valid CVV bhariye.');
                      return;
                    }
                    triggerAppPayment();
                  }}
                  className="space-y-3.5"
                >
                  {/* Virtual visual representation of credit card inside applet */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4.5 rounded-2xl shadow border border-slate-700 relative overflow-hidden h-36 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 tracking-wider">UDAN VIP LEAGUE CARD</span>
                        <div className="w-7 h-5 bg-amber-400/80 rounded-sm mt-1 border border-amber-300"></div>
                      </div>
                      <span className="text-xs font-black tracking-widest italic text-white/80">VISA / RUPAY</span>
                    </div>

                    <div className="font-mono text-sm tracking-widest text-[#f1f5f9] font-black">
                      {cardNo || '••••  ••••  ••••  ••••'}
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <div>
                        <span className="text-[8px] text-slate-400 block tracking-widest uppercase">Card Holder</span>
                        <p className="truncate w-36 uppercase font-bold text-white">{cardHolder || 'Arjun Raj'}</p>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block tracking-widest uppercase">Expiry</span>
                        <p className="font-bold text-white text-[10px]">{cardExpiry || 'MM/YY'}</p>
                      </div>
                    </div>

                    {/* background accent circles */}
                    <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-red-650/15 rounded-full blur-xl pointer-events-none"></div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Cardholder name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">Card Holder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-red-650"
                        placeholder="e.g. Arjun Raj"
                        required
                      />
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">16-Digit Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNo}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                          setCardNo(formatted);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold focus:outline-none focus:border-red-650"
                        placeholder="4532 9840 1024 4920"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let text = e.target.value.replace(/\D/g, '');
                            if (text.length > 2) {
                              text = text.substring(0, 2) + '/' + text.substring(2, 4);
                            }
                            setCardExpiry(text);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold focus:outline-none focus:border-red-650 text-center"
                          placeholder="MM/YY"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase">Security CVV Code</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold focus:outline-none focus:border-red-650 text-center"
                          placeholder="•••"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Lock size={12} /> Securely Pay ₹{parseFloat(depositAmount).toFixed(2)}
                  </button>
                </form>
              )}

              {/* STEP E: PROCESSING AND BANK CONNECTION CAPTURE */}
              {paymentStep === 'processing' && (
                <div className="text-center py-10 space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
                    <div className="absolute inset-2 bg-red-50 rounded-full flex items-center justify-center shadow-lg border border-red-100">
                      <RefreshCw size={24} className="animate-spin text-red-650" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-800">Verifying With Bank Gateway...</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Please do not close this modal or refresh the applet. PCI secure channel protocol is updating dynamic ledger registries...
                    </p>
                  </div>

                  <div className="bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-150 inline-flex items-center gap-1.5 text-[9px] text-slate-500 font-bold max-w-xs mx-auto">
                    <ShieldAlert size={12} className="text-slate-450 animate-pulse" /> 256-Bit Cryptographic SSL Pipeline Active
                  </div>
                </div>
              )}

              {/* STEP F: TRANSACTION SUCCESS CONFIRMATION SPLASH */}
              {paymentStep === 'success' && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-14 h-14 bg-emerald-550/15 rounded-full flex items-center justify-center mx-auto text-emerald-550 shadow-sm border border-emerald-500/20">
                    <CheckCircle size={32} className="stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-emerald-600">Bhugtan Safal (Success!)</h4>
                    <p className="text-[11px] text-slate-500">Deposit received in Udan Exam Wallet instantly.</p>
                  </div>

                  {/* Receipt Layout wrapper */}
                  <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-150 divide-y divide-slate-200/50 space-y-2.5 text-xs font-semibold relative overflow-hidden">
                    <div className="pt-0 flex justify-between">
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Amount Added:</span>
                      <span className="text-slate-800 font-black">₹{parseFloat(depositAmount).toFixed(2)}</span>
                    </div>

                    <div className="pt-2.5 flex justify-between">
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Trxn Code:</span>
                      <span className="text-slate-850 font-mono text-[10px]">{txnId || 'TXN89230571'}</span>
                    </div>

                    <div className="pt-2.5 flex justify-between">
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Deposited To:</span>
                      <span className="text-slate-800 font-black">Udan Wallet Balance</span>
                    </div>

                    <div className="pt-2.5 flex justify-between text-emerald-600">
                      <span className="font-sans font-bold text-[9px] uppercase tracking-wider">Updated Wallet:</span>
                      <span className="font-extrabold font-mono text-sm leading-none">₹{(walletBalance).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    type="button"
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-black text-xs py-3.5 rounded-2xl transition shadow-md cursor-pointer"
                  >
                    Close Transaction Check
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. WITHDRAW FORM */}
          {activeModal === 'withdraw' && (
            <form onSubmit={submitWithdrawal} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Available Winnings</span>
                <p className="text-2xl font-black text-slate-800 mt-1">₹{walletBalance.toFixed(2)}</p>
                <p className="text-[9px] text-slate-400 font-semibold mt-1">Max withdrawal: ₹{walletBalance.toFixed(2)}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-extrabold focus:outline-none focus:border-red-650"
                  placeholder="Min ₹100"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Enter Your UPI ID</label>
                <input
                  type="text"
                  value={withdrawalUpi}
                  onChange={(e) => setWithdrawalUpi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-red-650"
                  placeholder="e.g. upi_id@ybl, paytm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-3 rounded-2xl transition shadow-md"
              >
                Instant Transfer to UPI
              </button>
            </form>
          )}

          {/* 3. 1V1 FRIEND BATTLE MATCHMAKER */}
          {activeModal === 'friendBattle' && (
            <div className="space-y-4">
              {!isSearchingOpponent && !matchedOpponent ? (
                <>
                  <div className="text-center py-2">
                    <span className="text-3xl">⚔️</span>
                    <h4 className="text-base font-black text-slate-800 mt-2">Dosto Ke Saath Kelein!</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Choose your subject, enter fee, and find competitors online.</p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Select Subject */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Battle Subject</label>
                      <select
                        value={battleSubject}
                        onChange={(e) => setBattleSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none"
                      >
                        <option value="General Studies">General Studies & GK</option>
                        <option value="Mathematics">Quantitative Aptitude</option>
                        <option value="English Grammar">English Comprehension</option>
                        <option value="Reasoning Quiz">Logical Reasoning</option>
                      </select>
                    </div>

                    {/* Entry fee cards selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Choose Battle entry fee</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[15, 29, 50].map((fee) => (
                          <button
                            key={fee}
                            onClick={() => setBattleFee(fee)}
                            className={`py-2 px-1.5 rounded-xl text-center border text-xs font-black transition ${
                              battleFee === fee
                                ? 'bg-red-650 text-white border-red-600 shadow'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            ₹{fee} Entry
                            <span className="block text-[9px] font-semibold opacity-80">Reward: ₹{(fee * 1.8).toFixed(0)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFind1v1Opponent}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-650 text-white text-xs font-extrabold py-3 rounded-2xl transition shadow hover:scale-[1.01]"
                  >
                    Find Opponent Online
                  </button>
                </>
              ) : isSearchingOpponent ? (
                /* Searching state radar animation */
                <div className="text-center py-10 space-y-5">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute inset-2 bg-red-200 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg">
                      <Search size={24} className="animate-spin text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Finding Live Opponent...</h4>
                    <p className="text-[10px] text-slate-400">Matchmaker server is checking online active players for {battleSubject}</p>
                  </div>
                </div>
              ) : (
                /* Match found! */
                <div className="text-center py-4 space-y-5">
                  <div className="flex items-center justify-center space-x-4">
                    {/* You */}
                    <div className="text-center w-1/3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto border-2 border-red-600 flex items-center justify-center font-black text-slate-700 text-sm">
                        YOU
                      </div>
                      <p className="text-xs font-bold mt-1 truncate">Arjun Raj</p>
                      <p className="text-[10px] text-gray-400">Level 12</p>
                    </div>

                    <div className="text-sm font-black bg-slate-900 text-white px-2.5 py-1 rounded shadow transform skew-x-12 shrink-0">
                      VS
                    </div>

                    {/* Rival Opponent */}
                    <div className="text-center w-1/3">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 mx-auto border-2 border-blue-600 flex items-center justify-center font-black text-slate-700 text-sm">
                        {matchedOpponent?.name.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="text-xs font-bold mt-1 truncate">{matchedOpponent?.name}</p>
                      <p className="text-[10px] text-gray-400">Level {matchedOpponent?.level}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 text-green-800 p-3 rounded-2xl text-[11px] font-semibold border border-green-150">
                    🎉 Match Found! Best of 5 quiz questions. Quickest solver gets extra 10 Bonus points.
                  </div>

                  <button
                    onClick={handleStartMatchedGame}
                    className="w-full bg-gradient-to-r from-red-650 to-rose-700 text-white text-xs font-black py-3 rounded-2xl shadow transition"
                  >
                    Start Exam Battle <span className="text-[10px] font-semibold">(Fee: ₹{battleFee})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. TEAM BATTLE */}
          {activeModal === 'teamBattle' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <Users size={32} className="mx-auto text-indigo-600" />
                <h4 className="text-base font-black text-slate-800 mt-2">Team Battle Room</h4>
                <p className="text-[11px] text-slate-500 mt-1">Multiplayer custom lobby. Share the code to play with private friend networks.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest block uppercase">Lobby Code</span>
                <p className="text-lg font-black text-indigo-600 mt-1 tracking-wider">UDAN-9104</p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('UDAN-9104');
                  alert('Lobby Code copied!');
                }}
                className="w-full bg-white text-indigo-600 border border-indigo-200 text-xs font-bold py-2.5 rounded-xl transition hover:bg-indigo-50 flex items-center justify-center gap-1.5"
              >
                <Copy size={14} /> Copy Room Code
              </button>

              <button
                onClick={() => {
                  alert("Lobby is created. Match starting automatically in 15 seconds once friends join...");
                  onClose();
                }}
                className="w-full bg-indigo-600 text-white text-xs font-black py-3 rounded-xl shadow transition hover:bg-indigo-700"
              >
                Launch Private Match Group
              </button>
            </div>
          )}

          {/* 5. REFER & EARN */}
          {activeModal === 'referEarn' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-2">
                  <Gift size={24} />
                </div>
                <h4 className="text-base font-black text-slate-800">Refer Your Friends</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Dono ko milega ₹100 instant bonus registration par!</p>
              </div>

              {/* Promo Code block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest">Your Code</span>
                  <p className="text-sm font-black text-slate-800 tracking-wider font-mono">{referralCode}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-white hover:bg-slate-100 text-slate-650 border border-slate-200'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSimulateReferral}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-extrabold py-3 rounded-2xl transition shadow hover:scale-[1.01]"
                >
                  Simulate Friend Registration (+₹100)
                </button>
              </div>
            </div>
          )}

          {/* 6. SHARE SCORE */}
          {activeModal === 'shareScore' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl animate-bounce inline-block">🎉</span>
                <h4 className="text-sm font-black text-slate-800 mt-1">Direct Social Share</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Apne accomplishments directly templates ke sath share karein dosto ke sath!</p>
              </div>

              {/* Dynamic Scorecard Achievement Configuration Fields */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">✍️ Customize Scorecard Card</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Quiz/Exam Name</label>
                    <input
                      type="text"
                      value={shareQuizName}
                      onChange={(e) => setShareQuizName(e.target.value)}
                      placeholder="SSC CGL Live Battle"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-red-650"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Score Achieved</label>
                    <input
                      type="text"
                      value={shareScore}
                      onChange={(e) => setShareScore(e.target.value)}
                      placeholder="9/10"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-red-650"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Rank Secured</label>
                    <input
                      type="text"
                      value={shareRank}
                      onChange={(e) => setShareRank(e.target.value)}
                      placeholder="#4"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-red-650"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Cash Winnings</label>
                    <input
                      type="text"
                      value={shareWinnings}
                      onChange={(e) => setShareWinnings(e.target.value)}
                      placeholder="₹150"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-red-650"
                    />
                  </div>
                </div>
              </div>

              {/* Template Tabs Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Choose Share Template</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(0)}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black text-center border transition-all cursor-pointer ${
                      selectedTemplate === 0
                        ? 'border-red-650 bg-red-50 text-red-750'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    🏆 Hinglish (Brag)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(1)}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black text-center border transition-all cursor-pointer ${
                      selectedTemplate === 1
                        ? 'border-red-650 bg-red-50 text-red-750'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    🔥 Hindi (Challenge)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(2)}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black text-center border transition-all cursor-pointer ${
                      selectedTemplate === 2
                        ? 'border-red-650 bg-red-50 text-red-750'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    🎯 Eng (Elite)
                  </button>
                </div>
              </div>

              {/* Interactive Edit Area */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customize Message</label>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">{customShareText.length} Chars</span>
                </div>
                <textarea
                  value={customShareText}
                  onChange={(e) => setCustomShareText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-red-650 h-24 resize-none leading-relaxed text-slate-700"
                  placeholder="Type share message..."
                />
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Whatsapp link */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(customShareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-3 rounded-2xl text-[11px] font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                >
                  <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.8 1.45 5.53 0 10.03-4.5 10.03-10.03s-4.5-10.03-10.03-10.03C5.87 .54 1.37 5.04 1.37 10.57c0 1.9.5 3.7 1.5 5.3L1.97 20.3l4.67-1.146z" />
                  </svg>
                  WhatsApp
                </a>

                {/* Telegram link */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? (window.location.origin || 'https://udan.exam') : 'https://udan.exam')}&text=${encodeURIComponent(customShareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0088cc] hover:bg-[#0077b5] text-white py-3 px-3 rounded-2xl text-[11px] font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                >
                  <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.99.54-1.41.53-.46-.01-1.34-.26-1.99-.47-.8-.26-1.44-.4-1.39-.85.03-.23.34-.47.95-.72 3.71-1.61 6.19-2.68 7.43-3.19 3.54-1.46 4.28-1.72 4.76-1.73.1 0 .33.02.48.15.12.1.16.24.18.34.02.13.03.27.02.41z"/>
                  </svg>
                  Telegram
                </a>
              </div>

              {/* Auxiliary Copy Customized Text button */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(customShareText);
                  setCopiedText(true);
                  setTimeout(() => setCopiedText(false), 2000);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  copiedText
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {copiedText ? <Check size={14} className="text-emerald-600" /> : <Copy size={13} />}
                {copiedText ? 'Customized Message Copied!' : 'Copy Customized Message'}
              </button>
            </div>
          )}

          {/* 7. EDIT PROFILE MODAL */}
          {activeModal === 'editProfile' && (
            <div className="space-y-5 text-left animate-fade-in">
              {/* Dynamic Real-time Preview Area */}
              <div className="bg-gradient-to-r from-red-650 to-rose-650 rounded-2xl p-4 text-white flex items-center gap-4 shadow-sm">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 p-0.5 shadow-md flex items-center justify-center relative">
                    <img
                      src={editAvatarUrl}
                      alt="Avatar Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-full">
                      <Camera size={16} className="text-white/80" />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-yellow-300 font-black uppercase tracking-widest bg-yellow-400/20 px-1.5 py-0.5 rounded">REAL-TIME PREVIEW</span>
                  <p className="text-base font-black truncate max-w-[200px] mt-1">{editName || 'Your Name'}</p>
                  <p className="text-[10px] text-red-100 font-bold">Mascot Code: {(editName.substring(0, 2) || 'AR').toUpperCase()}</p>
                </div>
              </div>

              {/* Edit Interactive Input Fields */}
              <div className="space-y-4 font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">✍️ Display Username</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      if (onUpdateProfile) {
                        onUpdateProfile(e.target.value, editAvatarUrl);
                      }
                    }}
                    placeholder="Enter your nickname..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-850 focus:outline-none focus:border-red-650 transition-all font-sans"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">Apna custom online displays naam chunien. Ye pure global leaderboard pr use kiya jayega.</p>
                </div>

                {/* Grid of Avatars to pick */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">🎨 Select Profile Avatar</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_AVATARS.map((avatar) => {
                      const isSelected = editAvatarUrl === avatar.url;
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => {
                            setEditAvatarUrl(avatar.url);
                            if (onUpdateProfile) {
                              onUpdateProfile(editName, avatar.url);
                            }
                          }}
                          className={`p-1.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center gap-1.5 relative ${
                            isSelected
                              ? 'border-red-650 bg-red-50 shadow-sm'
                              : 'border-slate-100 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 relative">
                            <img
                              src={avatar.url}
                              alt={avatar.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                <Check size={14} className="text-white drop-shadow-md stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className={`text-[8.5px] font-black tracking-tight text-center truncate w-full ${
                            isSelected ? 'text-red-750' : 'text-slate-500'
                          }`}>
                            {avatar.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => {
                  if (onUpdateProfile) {
                    onUpdateProfile(editName || 'Udan Student', editAvatarUrl);
                  }
                  handleClose();
                }}
                className="w-full bg-red-650 hover:bg-red-700 text-white rounded-2xl py-3.5 text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
              >
                <UserCheck size={14} />
                Save & Update Details
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
