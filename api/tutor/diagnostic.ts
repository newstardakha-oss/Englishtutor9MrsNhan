import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeGeminiWithModelFallback } from './_pool.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { quizResults } = req.body;

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

    const clientApiKey = (req.headers['x-gemini-api-key'] as string) || undefined;
    const clientModel = (req.headers['x-gemini-model'] as string) || undefined;
    const parsedJson = await executeGeminiWithModelFallback(async (ai, model) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });
      return JSON.parse(response.text || "{}");
    }, clientModel || 'gemini-2.5-flash', clientApiKey);

    return res.status(200).json(parsedJson);
  } catch (error: any) {
    const msg = typeof error?.message === 'string' ? error.message : 'Chẩn đoán tạm thời gặp sự cố.';
    console.error("Error in /api/tutor/diagnostic:", msg);
    return res.status(500).json({ error: msg });
  }
}
