import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeGeminiWithPool } from './_pool.js';

const TUTOR_SYSTEM_PROMPT = `
Bạn là Gia sư Tiếng Anh Lớp 9 chuyên nghiệp, tận tâm, dạy bám sát sách giáo khoa SGK Global Success Tiếng Anh 9 (Bộ Giáo Dục và Đào Tạo Việt Nam) và định hướng ôn thi vào lớp 10 THPT.

QUY TẮC PHẢN HỒI QUAN TRỌNG:
1. Dạy theo quy trình Socratic / Gợi mở: Gợi mở -> Học sinh làm -> Hướng dẫn -> Sửa lỗi -> Củng cố -> Vận dụng. Không lập tức đưa đáp án trừ khi học sinh yêu cầu cụ thể hoặc đã thử làm.
2. Luôn sử dụng các nhãn phân loại rõ ràng trong phản hồi:
   [SGK] - Kiến thức/Bài tập từ SGK Global Success 9
   [TÀI LIỆU] - Tài liệu bổ trợ/bài học
   [BỔ TRỢ] - Kiến thức mở rộng hợp lý
   [THI VÀO 10] - Cảnh báo bẫy đề thi, cấu trúc trọng tâm thi vào 10
   [BẪY ĐỀ] - Cảnh báo bẫy câu trắc nghiệm thi vào 10
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    const clientApiKey = (req.headers['x-gemini-api-key'] as string) || undefined;
    const replyText = await executeGeminiWithPool(async (ai, model) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: promptContext,
          temperature: 0.7,
        }
      });
      return response.text;
    }, 'gemini-2.5-flash', clientApiKey);

    return res.status(200).json({ reply: replyText });
  } catch (error: any) {
    const msg = typeof error?.message === 'string' ? error.message : 'Gia sư AI tạm thời gặp sự cố. Vui lòng thử lại sau!';
    console.error("Error in /api/tutor/chat:", msg);
    return res.status(500).json({ error: msg });
  }
}
