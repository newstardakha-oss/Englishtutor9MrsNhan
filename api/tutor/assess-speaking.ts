import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeGeminiWithModelFallback } from './_pool.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { targetSentence, recognizedText, unitId } = req.body;

    const prompt = `
Bạn là chuyên gia đánh giá phát âm Tiếng Anh cho học sinh Lớp 9 Việt Nam.

CÂU MẪU CẦN ĐỌC: "${targetSentence}"
HỌC SINH ĐÃ ĐỌC (nhận diện từ mic): "${recognizedText}"
${unitId ? `Bối cảnh: Unit ${unitId} SGK Global Success 9` : ''}

Hãy phân tích và đánh giá phát âm theo JSON:
{
  "accuracyScore": number (0-100, phần trăm đọc đúng),
  "overallFeedback": "Nhận xét tổng quan ngắn gọn, động viên",
  "wordByWordAnalysis": [
    {
      "targetWord": "từ trong câu mẫu",
      "spokenWord": "từ học sinh đọc (hoặc null nếu bỏ sót)",
      "isCorrect": boolean,
      "ipa": "phiên âm IPA chuẩn",
      "issue": "Mô tả lỗi phát âm cụ thể (nếu có)" | null,
      "tip": "Mẹo sửa phát âm" | null
    }
  ],
  "commonMistakes": ["Lỗi phát âm phổ biến của học sinh VN liên quan"],
  "practiceRecommendation": "Gợi ý luyện tập tiếp theo",
  "encouragement": "Lời động viên phù hợp với điểm số"
}
`;

    const clientApiKey = (req.headers['x-gemini-api-key'] as string) || undefined;
    const clientModel = (req.headers['x-gemini-model'] as string) || undefined;
    const parsedJson = await executeGeminiWithModelFallback(async (ai, model) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });
      return JSON.parse(response.text || '{}');
    }, clientModel || 'gemini-2.5-flash', clientApiKey);

    return res.status(200).json(parsedJson);
  } catch (error: any) {
    const msg = typeof error?.message === 'string' ? error.message : 'Không thể đánh giá phát âm.';
    console.error('Error in /api/tutor/assess-speaking:', msg);
    return res.status(500).json({ error: msg });
  }
}
