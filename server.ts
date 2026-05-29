import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Seeding standard high-fidelity data in server-side memory
let state = {
  users: [
    { id: "u_1", name: "Rahul Kumar", email: "rahul.kumar@gmail.com", avatarText: "RK", walletBalance: 15430, quizzesPlayed: 320, contestsWon: 98, level: 16, status: "active", referralCode: "RAHUL500", referredBy: "ADMIN100", upiId: "rahul@paytm" },
    { id: "u_2", name: "Arjun Singh", email: "arjun.singh@gmail.com", avatarText: "AS", walletBalance: 10250, quizzesPlayed: 284, contestsWon: 85, level: 15, status: "active", referralCode: "ASINGH", referredBy: "RAHUL500", upiId: "arjun@ybl" },
    { id: "u_3", name: "Sneha Verma", email: "sneha.verma@yahoo.com", avatarText: "SV", walletBalance: 5200, quizzesPlayed: 180, contestsWon: 52, level: 11, status: "active", referralCode: "SNEHA80", referredBy: "RAHUL500", upiId: "sneha@okaxis" },
    { id: "u_4", name: "Arjun Raj", email: "sanjayvahi2.0@gmail.com", avatarText: "AR", walletBalance: 1250.50, quizzesPlayed: 245, contestsWon: 78, level: 12, status: "active", referralCode: "UDAN500", referredBy: "SNEHA80", upiId: "arjunraj@upi" },
    { id: "u_5", name: "Priya Sharma", email: "priya.sharma@outlook.com", avatarText: "PS", walletBalance: 1840, quizzesPlayed: 140, contestsWon: 30, level: 8, status: "active", referralCode: "PRIYA99", referredBy: "ADMIN100", upiId: "priya@sbi" },
    { id: "u_6", name: "Vikash Jha", email: "vikash.jha@gmail.com", avatarText: "VJ", walletBalance: 1120, quizzesPlayed: 90, contestsWon: 20, level: 7, status: "active", referralCode: "VIKASH", referredBy: "UDAN500", upiId: "vikash@okicici" },
    { id: "u_7", name: "Neha Patel", email: "neha.patel@rediff.com", avatarText: "NP", walletBalance: 800, quizzesPlayed: 64, contestsWon: 12, level: 5, status: "banned", referralCode: "NEHA10", referredBy: "", upiId: "neha@upi" },
  ],
  contests: [
    {
      id: "ssc_mega",
      title: "SSC CGL Tier-1 Mega Mock",
      subject: "100 Questions • 60 Mins • General SSC Syllabus",
      category: "SSC",
      status: "live",
      entryFee: 29,
      totalPrize: 50000,
      totalSlots: 5000,
      registeredSlots: 1245,
      durationMinutes: 60,
      totalQuestions: 10,
      hasRegistered: false,
      isTaken: false,
      timerSeconds: 1200,
      activeParticipants: 412
    },
    {
      id: "railway_grp_d",
      title: "Railway Group D Special 🚆",
      subject: "80 questions • 45 Mins • Technical Mock math",
      category: "Railway",
      status: "upcoming",
      entryFee: 19,
      totalPrize: 25000,
      totalSlots: 2000,
      registeredSlots: 856,
      durationMinutes: 45,
      totalQuestions: 80,
      hasRegistered: false,
      isTaken: false,
      timerSeconds: 0,
      activeParticipants: 0
    },
    {
      id: "up_police_const",
      title: "UP Police Constable Battle 👮",
      subject: "60 Questions • 30 Mins • Practice GS/Civics mock",
      category: "UP Police",
      status: "upcoming",
      entryFee: 0,
      totalPrize: 10000,
      totalSlots: 2000,
      registeredSlots: 312,
      durationMinutes: 30,
      totalQuestions: 60,
      hasRegistered: false,
      isTaken: false,
      timerSeconds: 0,
      activeParticipants: 0
    },
    {
      id: "gk_history",
      title: "GS History practice quiz 📖",
      subject: "50 Questions • 30 Mins • Ancient/Medieval History",
      category: "Other",
      status: "completed",
      entryFee: 10,
      totalPrize: 1000,
      totalSlots: 100,
      registeredSlots: 100,
      durationMinutes: 30,
      totalQuestions: 50,
      hasRegistered: true,
      isTaken: true,
      score: 4,
      rewards: "Won ₹100",
      timerSeconds: 0,
      activeParticipants: 0
    }
  ],
  questions: [
    {
      id: "q_1",
      category: "SSC",
      question: "Which Emperor founded the city of Fatehpur Sikri?",
      options: ["Akbar", "Shah Jahan", "Jahangir", "Humayun"],
      correctIndex: 0,
      explanation: "Akbar founded Fatehpur Sikri in 1571 to serve as the capital of the Mughal Empire in honor of Sufi saint Salim Chishti."
    },
    {
      id: "q_2",
      category: "UPSC",
      question: "Under which article of the Indian Constitution is the Union Budget presented?",
      options: ["Article 110", "Article 112", "Article 114", "Article 120"],
      correctIndex: 1,
      explanation: "Article 112 of the Indian Constitution refers to the Union Budget as the 'Annual Financial Statement'."
    },
    {
      id: "q_3",
      category: "Railway",
      question: "What is the speed of sound in dry air at 20 degrees Celsius?",
      options: ["299 m/s", "343 m/s", "412 m/s", "1500 m/s"],
      correctIndex: 1,
      explanation: "At 20 degrees Celsius, sound waves travel through air at approximately 343 meters per second."
    }
  ],
  withdrawals: [
    { id: "wd_1", name: "Rahul Kumar", amount: 4500, upiId: "rahul@paytm", timestamp: "May 25, 2026 11:30 AM", status: "pending", gateway: "Razorpay" },
    { id: "wd_2", name: "Sneha Verma", amount: 1500, upiId: "sneha@okaxis", timestamp: "May 24, 2026 09:12 PM", status: "approved", gateway: "Cashfree" },
    { id: "wd_3", name: "Arjun Singh", amount: 3000, upiId: "arjun@ybl", timestamp: "May 23, 2026 04:30 PM", status: "rejected", gateway: "Razorpay" }
  ],
  configs: {
    referralBonus: 500,
    dailyReward: 25,
    promoCodes: [
      { code: "UDAN500", bonus: 500, type: "bonus", active: true },
      { code: "FREEENTRY", bonus: 30, type: "cashback", active: true }
    ],
    moderatorRole: "Super Admin",
    liveChatLocked: false,
    bannerAdsEnabled: true,
    videoAdsEnabled: false
  },
  liveQuizStatus: {
    contestId: "ssc_mega",
    isPaused: false,
    activeQuestionIndex: 2,
    timerRemaining: 45,
    totalJoined: 1245
  }
};

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      geminiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
  }
  return geminiClient;
}

// REST APIs for Dashboard & State Synchronization

// Get overview analytics counter
app.get("/api/dashboard-stats", (req, res) => {
  const totalWelfareWinnings = state.users.reduce((acc, u) => acc + u.walletBalance, 0);
  const totalRevenue = 145020; // Simulated live fee earnings
  const liveMatches = state.contests.filter(c => c.status === "live").length;
  const pendingWithdrawalCount = state.withdrawals.filter(w => w.status === "pending").length;
  const aiGeneratedQuestionsCount = state.questions.filter((q: any) => q.id && q.id.startsWith("q_ai")).length;
  const manualQuestionsCount = state.questions.filter((q: any) => !q.id || !q.id.startsWith("q_ai")).length;

  res.json({
    totalUsers: state.users.length,
    activeUsers: state.users.filter(u => u.status === "active").length,
    totalRevenue,
    totalContests: state.contests.length,
    liveMatches,
    withdrawRequests: pendingWithdrawalCount,
    aiGeneratedQuestionsCount: aiGeneratedQuestionsCount + 120, // seeded standard questions count
    manualQuestionsCount: manualQuestionsCount + 450,
  });
});

// User Management Actions
app.get("/api/users", (req, res) => {
  res.json(state.users);
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userIndex = state.users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    state.users[userIndex] = { ...state.users[userIndex], ...updates };
    res.json(state.users[userIndex]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Contests API
app.get("/api/contests", (req, res) => {
  res.json(state.contests);
});

app.post("/api/contests", (req, res) => {
  const contest = {
    id: `contest_${Date.now()}`,
    registeredSlots: 0,
    hasRegistered: false,
    isTaken: false,
    timerSeconds: 0,
    activeParticipants: 0,
    ...req.body
  };
  state.contests.push(contest);
  res.status(201).json(contest);
});

app.put("/api/contests/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const idx = state.contests.findIndex(c => c.id === id);
  if (idx !== -1) {
    state.contests[idx] = { ...state.contests[idx], ...updates };
    res.json(state.contests[idx]);
  } else {
    res.status(404).json({ error: "Contest not found" });
  }
});

app.delete("/api/contests/:id", (req, res) => {
  const { id } = req.params;
  state.contests = state.contests.filter(c => c.id !== id);
  res.json({ success: true, deletedId: id });
});

// Questions API
app.get("/api/questions", (req, res) => {
  res.json(state.questions);
});

app.post("/api/questions", (req, res) => {
  const question = {
    id: req.body.id || `q_${Date.now()}`,
    ...req.body
  };
  state.questions.push(question);
  res.status(201).json(question);
});

// AI MCQ generation endpoint via Gemini
app.post("/api/ai/generate-questions", async (req, res) => {
  const { category, subject, topic, difficulty, count = 3 } = req.body;

  const client = getGeminiClient();
  if (!client) {
    // Generate high quality mock fallback in case a valid API key isn't provided
    console.log("No Gemini API key configured. Generating highly realistic local fallback questions.");
    const fallbackList = [
      {
        id: `q_ai_fb_${Date.now()}_1`,
        category: category || "SSC",
        question: `Which of the following topics belongs primarily to '${subject || 'General Studies'}' representing '${topic || 'Basic Syllabus'}'? [Easy Mock Question]`,
        options: [
          "Core Standard Option A",
          "Alternative Contextual Option B",
          "Accurate Answer Choice C",
          "Distractor Choice D"
        ],
        correctIndex: 2,
        explanation: `Choosing answer Choice C is correct as it satisfies standard educational templates for ${subject || 'selected subject'} with ${difficulty || 'medium'} complexity.`
      },
      {
        id: `q_ai_fb_${Date.now()}_2`,
        category: category || "SSC",
        question: `Exam Category ${category || 'General'} practice: Under standard test guidelines, specify the structural relationship of ${topic || 'fundamental concept'}.`,
        options: [
          "Primary Parameter First Option",
          "Correct Answer Option B",
          "Secondary Distracting Option",
          "Alternative False Proposal"
        ],
        correctIndex: 1,
        explanation: "Correct Answer Option B is correct based on competitive mock examinations standards."
      }
    ];
    return res.json({ questions: fallbackList });
  }

  try {
    const prompt = `Generate exactly ${count} quiz multiple choice questions (MCQs) for Indian competitive exams.
Subject Area: ${subject || "General Studies"}
Subtopic: ${topic || "Core Principles"}
Difficulty Level: ${difficulty || "Medium"}
Target Audience Category: ${category || "UPSC"} (e.g. SSC, UPSC, Railway, Police, Banking, BPSC, State Exams).

Include translations where requested or make the tone suitable for Indian students (mixture of Hindi terms and English explanations).
Create distinct correct options and 4 logical choices.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert examiner for Indian competitive mock series (Udhan Exam League). Return absolute valid JSON array adhering strictly to the schema provided.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Clear question written in standard English, highly accurate" },
              questionHindi: { type: Type.STRING, description: "Question written in clear Devanagari Hindi translation" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of exactly 4 strings for Multiple Choices"
              },
              correctIndex: { type: Type.INTEGER, description: "0-based position index of the correct option choice (0 to 3)" },
              explanation: { type: Type.STRING, description: "Beautiful explanation in Hinglish/English explaining why the choice is correct, including logic." }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        },
        temperature: 0.8
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response text from Gemini API");
    }

    const cleanedText = text.trim();
    const questionsArray = JSON.parse(cleanedText);

    // Map and inject IDs
    const formattedQuestions = questionsArray.map((q: any, i: number) => ({
      id: `q_ai_${Date.now()}_${i}`,
      category: category || "SSC",
      question: q.questionHindi ? `${q.question} \n\n(${q.questionHindi})` : q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    }));

    // Optionally save directly to database list
    state.questions.push(...formattedQuestions);

    res.json({ questions: formattedQuestions });

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "Failed to parse or generate questions via Gemini", message: error.message });
  }
});

// Withdrawals API
app.get("/api/withdrawals", (req, res) => {
  res.json(state.withdrawals);
});

app.put("/api/withdrawals/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const idx = state.withdrawals.findIndex(w => w.id === id);
  if (idx !== -1) {
    state.withdrawals[idx].status = status;
    
    // If approved, update user balance in memory too
    if (status === "approved") {
      const user = state.users.find(u => u.name === state.withdrawals[idx].name);
      if (user) {
        user.walletBalance = Math.max(0, user.walletBalance - state.withdrawals[idx].amount);
      }
    }
    res.json(state.withdrawals[idx]);
  } else {
    res.status(404).json({ error: "Withdrawal record not found" });
  }
});

// Configs API
app.get("/api/configs", (req, res) => {
  res.json(state.configs);
});

app.post("/api/configs", (req, res) => {
  state.configs = { ...state.configs, ...req.body };
  res.json(state.configs);
});

// Live Contest Control API
app.get("/api/live-status", (req, res) => {
  res.json(state.liveQuizStatus);
});

app.post("/api/live-status", (req, res) => {
  state.liveQuizStatus = { ...state.liveQuizStatus, ...req.body };
  res.json(state.liveQuizStatus);
});

// Serve frontend build output under production mode (unless on Vercel, where Vercel Edge serves static directly)
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res, next) => {
    // API assets must not go to SPA fallback
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
} else if (process.env.NODE_ENV !== "production") {
  // Integrate Vite dev server middleware in-process
  const setupVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  };
  setupVite();
}

// Export the app as default for Serverless platforms like Vercel
export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully initiated and running on http://0.0.0.0:${PORT}`);
  });
}
