import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, AlertTriangle, CheckCircle, Award, ArrowRight, X } from 'lucide-react';
import { Contest, QuizQuestion } from '../types';

interface QuizModalProps {
  contest: Contest;
  onClose: () => void;
  onFinishQuiz: (score: number, rewardEarned: number, timeSpentSeconds: number) => void;
}

const GENERAL_KNOWLEDGE_QUESTIONS: QuizQuestion[] = [
  {
    question: "Who is known as the 'Father of the Indian Constitution'?",
    options: ["Dr. B.R. Ambedkar", "Mahatma Gandhi", "Jawaharlal Nehru", "Dr. Rajendra Prasad"],
    correctIndex: 0,
  },
  {
    question: "Which of the following ports is known as the Queen of the Arabian Sea?",
    options: ["Mumbai Port", "Kochi Port", "Kandla Port", "Visakhapatnam Port"],
    correctIndex: 1,
  },
  {
    question: "Who was the first female Governor of an Indian State?",
    options: ["Sarojini Naidu", "Sucheta Kripalani", "Indira Gandhi", "Vijayalakshmi Pandit"],
    correctIndex: 0,
  },
  {
    question: "In which year did the battle of Haldighati take place?",
    options: ["1556", "1576", "1565", "1586"],
    correctIndex: 1,
  },
  {
    question: "Which gland in the human body is commonly nicknamed the 'Master Gland'?",
    options: ["Thyroid Gland", "Adrenal Gland", "Pituitary Gland", "Pancreas"],
    correctIndex: 2,
  },
];

export default function QuizModal({ contest, onClose, onFinishQuiz }: QuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 2); // 2 minutes mock exam timer
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer loop
  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleNext = () => {
    if (selectedOpt !== null) {
      setAnswers({ ...answers, [currentIdx]: selectedOpt });
    }
    setSelectedOpt(null);

    if (currentIdx < GENERAL_KNOWLEDGE_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setSelectedOpt(null);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateResults = () => {
    let score = 0;
    GENERAL_KNOWLEDGE_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    // Save last answer if any
    let finalAnswers = { ...answers };
    if (selectedOpt !== null) {
      finalAnswers[currentIdx] = selectedOpt;
      setAnswers(finalAnswers);
    }

    const taken = 120 - timeLeft;
    setTimeSpent(taken > 0 ? taken : 1);
    setIsSubmitted(true);
  };

  const handleAutoSubmit = () => {
    setTimeSpent(120);
    setIsSubmitted(true);
  };

  const handleCollectWinnings = () => {
    const finalScore = calculateResults();
    // Calculate custom winnings based on score
    // 5 correct = ₹150, 4 correct = ₹80, 3 correct = ₹40, 2 correct = ₹20, anything else = ₹0
    let winnings = 0;
    if (finalScore === 5) winnings = 150;
    else if (finalScore === 4) winnings = 80;
    else if (finalScore === 3) winnings = 40;
    else if (finalScore === 2) winnings = 20;

    // Pass the actual score and the timeSpent in seconds
    onFinishQuiz(finalScore, winnings, timeSpent || (120 - timeLeft) || 15);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current active question number & details
  const activeQuestion = GENERAL_KNOWLEDGE_QUESTIONS[currentIdx];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header containing Banner and timer */}
        <div className="bg-gradient-to-r from-red-650 to-rose-700 p-5 text-white">
          <div className="flex justify-between items-center mb-1">
            <span className="bg-yellow-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              {contest.title}
            </span>
            <button
              onClick={onClose}
              className="text-white hover:text-red-100 p-1 bg-white/10 rounded-full transition"
            >
              <X size={16} />
            </button>
          </div>
          <h3 className="text-sm font-bold opacity-90">{contest.subject}</h3>

          {/* Time & Question Progress indicator */}
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
            <div className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg text-xs font-semibold">
              <Timer size={14} className={timeLeft < 30 ? "text-yellow-300 animate-pulse" : "text-white"} />
              <span className={timeLeft < 30 ? "text-yellow-300" : ""}>{formatTime(timeLeft)}</span>
            </div>
            <div className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg">
              Q: {currentIdx + 1} of {GENERAL_KNOWLEDGE_QUESTIONS.length}
            </div>
          </div>
        </div>

        {/* Quiz State logic container */}
        <div className="p-5 flex-1 overflow-y-auto">
          {!isSubmitted ? (
            <div className="space-y-5">
              {/* Question container text */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">
                  Question {currentIdx + 1}
                </span>
                <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                  {activeQuestion.question}
                </p>
              </div>

              {/* Options lists selection */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((option, oIdx) => {
                  const isCurSelected = selectedOpt === oIdx || answers[currentIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => setSelectedOpt(oIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all duration-150 flex items-center justify-between ${
                        isCurSelected
                          ? 'border-red-600 bg-red-50/50 text-red-700 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{option}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isCurSelected
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isCurSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Warnings */}
              {timeLeft < 30 && (
                <div className="flex items-center space-x-2 bg-yellow-50 text-yellow-800 p-2.5 rounded-xl border border-yellow-200 text-[10px] font-semibold">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>Kam samay bacha hai! Kripya jaldi se jawab dekar submit karein.</span>
                </div>
              )}
            </div>
          ) : (
            // Results & Success Screen
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-white">
                <CheckCircle size={32} />
              </div>

              <div>
                <h4 className="text-base font-black text-slate-800">Test Completed Successfully!</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Apna scorecard neeche dekhein</p>
              </div>

              {/* Score summary panel */}
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-2">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Your Score</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">
                    {calculateResults()} / {GENERAL_KNOWLEDGE_QUESTIONS.length}
                  </p>
                  <p className="text-[9px] text-green-600 font-bold">
                    ({Math.round((calculateResults() / GENERAL_KNOWLEDGE_QUESTIONS.length) * 100)}% Correct)
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-150">
                  <p className="text-[10px] text-amber-600 font-bold uppercase">Cash Reward</p>
                  <p className="text-lg font-black text-amber-600 mt-0.5">
                    ₹{calculateResults() === 5 ? 150 : calculateResults() === 4 ? 80 : calculateResults() === 3 ? 40 : calculateResults() === 2 ? 20 : 0}
                  </p>
                  <p className="text-[9px] text-slate-500 font-semibold uppercase">Instantly Won</p>
                </div>
              </div>

              {/* Speed / Timer analysis panel */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl max-w-xs mx-auto text-left flex items-center justify-between border border-slate-800">
                <div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">⏱️ SPEED / TIMER METRIC</span>
                  <p className="text-xs font-black text-slate-100">Time Taken: <span className="text-yellow-400">{timeSpent || Math.max(1, 120 - timeLeft)} Seconds</span></p>
                  <p className="text-[9px] text-slate-300 font-medium">Avg Class Rank Factor: <span className="text-emerald-400">{( (timeSpent || Math.max(1, 120 - timeLeft)) / 5).toFixed(1)}s / Que</span></p>
                </div>
                <div className="bg-red-650 text-white font-black text-[9px] px-2 py-1 rounded-lg uppercase tracking-wider animate-pulse whitespace-nowrap">
                  {(timeSpent || Math.max(1, 120 - timeLeft)) < 20 ? '🚀 Instant Master' : (timeSpent || Math.max(1, 120 - timeLeft)) < 45 ? '⚡ Lightning Fast' : '⏱️ Steady Speed'}
                </div>
              </div>

              {/* Grade comment */}
              <div className="bg-indigo-50/50 p-3 rounded-2xl text-indigo-950 text-xs font-semibold leading-relaxed max-w-sm mx-auto">
                {calculateResults() >= 4 ? (
                  <span>🏆 Gazab ki taiyari! Aapki SSC strategy kamaal ki hai. Keep it up!</span>
                ) : calculateResults() >= 2 ? (
                  <span>⭐ Badiya koshish! Agle mock contest mein aur achhi rank laane ki koshish karein.</span>
                ) : (
                  <span>📚 Thoda aur abhyas kijiye. App ke dushre free practice exams lein!</span>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer controls for quiz */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-between space-x-3">
          {!isSubmitted ? (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIdx === 0}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
                  currentIdx === 0
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                {currentIdx === GENERAL_KNOWLEDGE_QUESTIONS.length - 1 ? 'Submit Test' : 'Next Question'}
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={handleCollectWinnings}
              className="w-full bg-gradient-to-r from-red-650 to-rose-700 hover:scale-[1.01] text-white text-xs font-extrabold py-3 rounded-xl transition shadow flex items-center justify-center gap-2"
            >
              <Award size={16} />
              Collect Prize & Update Wallet
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
