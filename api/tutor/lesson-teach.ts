import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeGeminiWithModelFallback } from './_pool.js';

const LESSON_SYSTEM_PROMPT = `
Bạn là Gia Sư Tiếng Anh Lớp 9 chuyên giảng bài theo từng Unit SGK Global Success 9.
Bạn dạy theo quy trình sư phạm 5 bước:

BƯỚC 1 - WARM-UP (Khởi động):
- Đặt 1-2 câu hỏi gợi mở về chủ đề của Unit bằng tiếng Việt đơn giản
- Kết nối với đời sống học sinh
- Tạo hứng thú trước khi vào bài

BƯỚC 2 - VOCABULARY (Từ vựng trọng tâm):
- Giới thiệu 8-10 từ vựng quan trọng nhất của Unit
- Mỗi từ: IPA, từ loại, nghĩa, ví dụ SGK, collocations
- Nhấn mạnh các từ hay xuất hiện trong đề thi vào 10
- Kèm 2 câu quiz nhanh kiểm tra

BƯỚC 3 - GRAMMAR (Ngữ pháp chủ đạo):
- Trình bày công thức rõ ràng
- 3 ví dụ từ dễ đến khó
- Cảnh báo bẫy đề thi vào 10
- Lỗi học sinh thường mắc
- 2 câu tập nhanh

BƯỚC 4 - PRACTICE (Luyện tập):
- 5 câu bài tập đa dạng (MCQ, fill-blank, rewrite, word-form, error-finding)
- Mức độ tăng dần
- Chờ học sinh trả lời rồi mới sửa
- Giải thích tại sao đúng/sai

BƯỚC 5 - REVIEW & HOMEWORK (Tổng kết):
- Tóm tắt 3 điểm quan trọng nhất của bài học
- Giao 3 bài tập về nhà
- Động viên, khen ngợi tiến bộ

QUY TẮC:
- Trả lời đúng bước được yêu cầu (step parameter)
- Dùng nhãn [SGK], [THI VÀO 10], [BẪy ĐỀ], [LUYỆN TẬP] tương ứng
- Giữ giọng điệu thân thiện, động viên như giáo viên thật
- Phù hợp học sinh 14-15 tuổi
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { unitId, lessonStep, studentResponses, unitTitle } = req.body;

    let stepInstruction = '';
    switch (lessonStep) {
      case 'warmup':
        stepInstruction = `Hãy thực hiện BƯỚC 1 - WARM-UP cho Unit ${unitId}: "${unitTitle}". Đặt 2 câu hỏi gợi mở liên quan đến chủ đề Unit.`;
        break;
      case 'vocabulary':
        stepInstruction = `Hãy thực hiện BƯỚC 2 - VOCABULARY cho Unit ${unitId}: "${unitTitle}". Giới thiệu 8-10 từ vựng trọng tâm kèm IPA, ví dụ, quiz nhanh.`;
        break;
      case 'grammar':
        stepInstruction = `Hãy thực hiện BƯỚC 3 - GRAMMAR cho Unit ${unitId}: "${unitTitle}". Trình bày ngữ pháp chủ đạo kèm công thức, ví dụ, bẫy đề thi.`;
        break;
      case 'practice':
        stepInstruction = `Hãy thực hiện BƯỚC 4 - PRACTICE cho Unit ${unitId}: "${unitTitle}". Cho 5 câu bài tập đa dạng mức độ tăng dần.`;
        break;
      case 'review':
        stepInstruction = `Hãy thực hiện BƯỚC 5 - REVIEW & HOMEWORK cho Unit ${unitId}: "${unitTitle}". Tóm tắt bài học và giao bài tập về nhà.`;
        break;
      default:
        stepInstruction = `Giới thiệu tổng quan Unit ${unitId}: "${unitTitle}" và hỏi học sinh đã sẵn sàng chưa.`;
    }

    const contents = [];
    if (studentResponses && Array.isArray(studentResponses)) {
      for (const msg of studentResponses) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: stepInstruction }] });

    const clientApiKey = (req.headers['x-gemini-api-key'] as string) || undefined;
    const clientModel = (req.headers['x-gemini-model'] as string) || undefined;
    const replyText = await executeGeminiWithModelFallback(async (ai, model) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: LESSON_SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });
      return response.text;
    }, clientModel || 'gemini-2.5-flash', clientApiKey);

    return res.status(200).json({ reply: replyText });
  } catch (error: any) {
    const msg = typeof error?.message === 'string' ? error.message : 'Gia sư giảng bài tạm thời gặp sự cố.';
    console.error('Error in /api/tutor/lesson-teach:', msg);
    return res.status(500).json({ error: msg });
  }
}
