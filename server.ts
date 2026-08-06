import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// System prompt for Grade 9 English AI Tutor (Bám sát SGK Global Success 9 & Thi vào 10)
const TUTOR_SYSTEM_PROMPT = `
Bạn là Gia sư Tiếng Anh Lớp 9 chuyên nghiệp, tận tâm, dạy bám sát sách giáo khoa SGK Global Success Tiếng Anh 9 (Bộ Giáo Dục và Đào Tạo Việt Nam) và định hướng ôn thi vào lớp 10 THPT.

QUY TẮC PHẢN HỒI QUAN TRỌNG:
1. Dạy theo quy trình Socratic / Gợi mở: Gợi mở -> Học sinh làm -> Hướng dẫn -> Sửa lỗi -> Củng cố -> Vận dụng. Không lập tức đưa đáp án trừ khi học sinh yêu cầu cụ thể hoặc đã thử làm.
2. Luôn sử dụng các nhãn phân loại rõ ràng trong phản hồi:
   [SGK] - Kiến thức/Bài tập từ SGK Global Success 9
   [TÀI LIỆU] - Tài liệu bổ trợ/bài học
   [BỔ TRỢ] - Kiến thức mở rộng hợp lý
   [THI VÀO 10] - Cảnh báo bẫy đề thi, cấu trúc trọng tâm thi vào 10
   [LUYỆN TẬP MỚI] - Bài tập củng cố mới
   [NÂNG CAO] - Câu hỏi vận dụng cao
3. Cấu trúc sửa lỗi bài làm của học sinh (#SUAVIET hoặc chữa câu):
   - Lỗi ở đâu trong câu
   - Vì sao sai (Giải thích bản chất ngữ pháp/từ vựng)
   - Cách sửa chính xác
   - Cách tránh mắc lỗi tương tự ("Bẫy đề thi vào 10")
   - Bài tập củng cố nhanh 1 câu
4. Luôn phân tích từ vựng kèm IPA, Từ loại, Collocations, Word Family (Danh/Động/Tính/Trạng) và Phrasal Verbs.
5. Giữ thái độ động viên, nhiệt tình, thân thiện, súc tích, dễ hiểu với học sinh tuổi 14-15.
6. Xử lý các lệnh nhanh khi học sinh gõ:
   #HOCUNIT [Unit] : Dạy lý thuyết từ vựng & ngữ pháp trọng tâm Unit đó.
   #SUAVIET : Chấm bài viết (đoạn văn/email/câu) chi tiết theo tiêu đề & bảng điểm.
   #LOHONG : Phát hiện lỗ hổng kiến thức và đề xuất bài tập bù đắp.
   #GOIY : Cho gợi ý 3 mức (Mức 1: Nhắc kiến thức -> Mức 2: Chỉ cấu trúc -> Mức 3: Gần đáp án).
   #LUYENDE : Đưa ra câu hỏi luyện đề thi vào 10 kèm phân tích bẫy đề.
`;

// Endpoint 1: General Tutor Interactive Chat
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const { message, conversationHistory, unitContext } = req.body;

    let promptContext = TUTOR_SYSTEM_PROMPT;
    if (unitContext) {
      promptContext += `\n[Bối cảnh bài học hiện tại: Unit ${unitContext}]`;
    }

    const contents = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: promptContext,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in /api/tutor/chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate tutor response." });
  }
});

// Endpoint 2: Specialized Writing Analysis & Grading (#SUAVIET)
app.post("/api/tutor/grade-writing", async (req, res) => {
  try {
    const { topic, studentSubmission, targetWords } = req.body;

    const writingPrompt = `
Hãy chấm và sửa bài viết Tiếng Anh Lớp 9 sau đây theo tiêu chuẩn định hướng Thi vào Lớp 10:

Chủ đề: "${topic || 'Tự do'}"
Bài làm của học sinh:
"""
${studentSubmission}
"""

Yêu cầu đầu ra dạng JSON với cấu trúc chuẩn:
{
  "score": number (Thang điểm 10, ví dụ 8.5),
  "overallComments": "Nhận xét tổng quan ngắn gọn, động viên",
  "strengths": ["Điểm tốt 1", "Điểm tốt 2"],
  "weaknesses": ["Điểm cần cải thiện 1", "Điểm cần cải thiện 2"],
  "criteria": {
    "content": number (/10 - Đủ ý, bám sát đề),
    "structure": number (/10 - Mạch lạc, từ nối),
    "vocabulary": number (/10 - Từ vựng chủ đề lớp 9, collocations),
    "grammar": number (/10 - Ngữ pháp, thì, cấu trúc câu),
    "spelling": number (/10 - Chính tả, viết hoa)
  },
  "sentenceBySentence": [
    {
      "original": "Câu gốc của học sinh",
      "corrected": "Câu đã sửa chuẩn xác",
      "explanation": "Giải thích chi tiết vì sao sửa",
      "issueType": "Ngữ pháp" | "Từ vựng" | "Chính tả" | "Cấu trúc" | "Tự nhiên"
    }
  ],
  "improvedVersion": "Bài viết phiên bản nâng cao hoàn chỉnh (dùng từ vựng & cấu trúc ăn điểm thi vào 10)",
  "recommendedPractice": "1 bài tập nhỏ củng cố lỗi ngữ pháp mắc phải nhiều nhất trong bài"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: writingPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Error in /api/tutor/grade-writing:", error);
    res.status(500).json({ error: error.message || "Failed to grade writing." });
  }
});

// Endpoint 3: Diagnostic Gap Analysis (#LOHONG)
app.post("/api/tutor/diagnostic", async (req, res) => {
  try {
    const { quizResults } = req.body; // array of { questionId, topic, isCorrect, userAns, correctAns }

    const prompt = `
Phân tích kết quả bài kiểm tra chẩn đoán Tiếng Anh Lớp 9 của học sinh:
Dữ liệu kết quả: ${JSON.stringify(quizResults)}

Hãy đưa ra danh sách lỗ hổng kiến thức (#LOHONG) và lộ trình khắc phục dưới dạng JSON:
{
  "gaps": [
    {
      "topic": "Tên chủ điểm (Ví dụ: Nhầm lẫn giữa Past Simple và Present Perfect / Dùng sai Mệnh đề quan hệ)",
      "severity": "Hoàn toàn mất gốc" | "Thường xuyên nhầm" | "Cần luyện thêm",
      "description": "Mô tả nguyên nhân sai lầm cụ thể của học sinh",
      "remedyAction": "Hướng dẫn cụ thể cách ôn tập và mẹo ghi nhớ",
      "recommendedExercises": ["Ví dụ bài tập củng cố 1", "Ví dụ bài tập củng cố 2"]
    }
  ],
  "summaryRoadmap": "Lời khuyên tổng quan định hướng ôn thi vào 10 trong 2-3 tuần tới"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/tutor/diagnostic:", error);
    res.status(500).json({ error: error.message || "Failed to analyze diagnostic gaps." });
  }
});

async function startServer() {
  // Vite middleware in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gia sư Tiếng Anh Lớp 9 Server running on http://localhost:${PORT}`);
  });
}

startServer();
