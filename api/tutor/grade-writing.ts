import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeGeminiWithPool } from './_pool.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, studentSubmission } = req.body;

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

    const clientApiKey = (req.headers['x-gemini-api-key'] as string) || undefined;
    const parsedJson = await executeGeminiWithPool(async (ai, model) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: writingPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });
      return JSON.parse(response.text || "{}");
    }, 'gemini-2.5-flash', clientApiKey);

    return res.status(200).json(parsedJson);
  } catch (error: any) {
    const msg = typeof error?.message === 'string' ? error.message : 'Chấm bài viết tạm thời gặp sự cố.';
    console.error("Error in /api/tutor/grade-writing:", msg);
    return res.status(500).json({ error: msg });
  }
}
