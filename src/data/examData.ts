import { ExamQuestion } from '../types';

export const MOCK_GRADE_10_QUESTIONS: ExamQuestion[] = [
  // PHONETICS - Pronunciation & Stress
  {
    id: 'e10-p1',
    section: 'phonetics',
    question: 'Choose the word whose underlined part is pronounced differently from the others.',
    options: ['A. preserve', 'B. resident', 'C. basic', 'D. resort'],
    correctAnswer: 'C. basic',
    explanation: 'A, B, D phần "s" được phát âm là /z/ (prɪˈzɜːv, ˈrezɪdənt, rɪˈzɔːt). Trong khi C "basic" phát âm là /s/ (ˈbeɪsɪk).',
    trapWarning: 'Bẫy đề: Học sinh dễ lầm tưởng "basic" đọc thành /z/ do chữ s giữa hai nguyên âm.',
    level: 'Vận dụng cao (Thi vào 10)'
  },
  {
    id: 'e10-p2',
    section: 'phonetics',
    question: 'Choose the word that has a different stress pattern from the others.',
    options: ['A. historic', 'B. official', 'C. bilingual', 'D. heritage'],
    correctAnswer: 'D. heritage',
    explanation: 'A, B, C đều có trọng âm rơi vào âm tiết thứ 2 (hiˈstɒrɪk, əˈfɪʃl, baɪˈlɪŋɡwəl). Riêng D "heritage" có trọng âm 1 (ˈherɪtɪdʒ).',
    trapWarning: 'Đuôi -ic (historic), -ial (official) và bi- (bilingual) tuân theo quy tắc nhấn ngay trước hậu tố.',
    level: 'Vận dụng'
  },

  // VOCABULARY & GRAMMAR
  {
    id: 'e10-vg1',
    section: 'grammar',
    question: 'The more crowded the city becomes, ________ polluted the environment gets.',
    options: ['A. the most', 'B. the more', 'C. more', 'D. the much'],
    correctAnswer: 'B. the more',
    explanation: 'Cấu trúc so sánh kép: The + comparative + S + V, the + comparative + S + V. Vế 1 dùng "The more...", vế 2 cũng phải là "the more...".',
    trapWarning: 'Bẫy đề thiếu từ "THE" ở đáp án C.',
    level: 'Thông hiểu'
  },
  {
    id: 'e10-vg2',
    section: 'grammar',
    question: 'We don’t know ________ to ask for advice on choosing a future career.',
    options: ['A. who', 'B. why', 'C. what', 'D. how'],
    correctAnswer: 'A. who',
    explanation: 'Hỏi về người có thể tư vấn (ask WHO for advice). Cấu trúc Question word + to-infinitive.',
    trapWarning: 'Tuyệt đối KHÔNG bao giờ dùng WHY + to-infinitive.',
    level: 'Thông hiểu'
  },
  {
    id: 'e10-vg3',
    section: 'vocabulary',
    question: 'This craft village is famous for its hand-woven silk, which is ________ down from generation to generation.',
    options: ['A. passed', 'B. handed', 'C. given', 'D. taken'],
    correctAnswer: 'B. handed',
    explanation: 'Cụm động từ "hand down": truyền lại cho thế hệ sau (bị động: be handed down).',
    trapWarning: 'Pass down cũng có nghĩa tương tự nhưng trong SGK 9 Unit 1 trọng tâm học "hand down".',
    level: 'Cơ bản'
  },
  {
    id: 'e10-vg4',
    section: 'grammar',
    question: 'If students ________ enough sleep before the exam, they won’t be able to concentrate well.',
    options: ['A. don’t get', 'B. won’t get', 'C. didn’t get', 'D. haven’t got'],
    correctAnswer: 'A. don’t get',
    explanation: 'Mệnh đề IF trong câu điều kiện loại 1 chia ở thì Hiện tại đơn.',
    trapWarning: 'Bẫy đề: Học sinh hay nhầm dùng "won’t get" ở vế IF.',
    level: 'Cơ bản'
  },
  {
    id: 'e10-vg5',
    section: 'grammar',
    question: 'My sister wishes she ________ a bilingual tour guide in the near future.',
    options: ['A. is', 'B. will be', 'C. were', 'D. can be'],
    correctAnswer: 'C. were',
    explanation: 'Câu ước ở hiện tại/tương lai gần dùng Wish + Past Simple (to-be chọn WERE cho tất cả các ngôi).',
    trapWarning: 'Bẫy đề: Không chọn "will be" hay "can be" sau WISH.',
    level: 'Vận dụng'
  },
  {
    id: 'e10-vg6',
    section: 'grammar',
    question: 'Son Doong, ________ is the largest natural cave in the world, was discovered in 1991.',
    options: ['A. that', 'B. which', 'C. where', 'D. what'],
    correctAnswer: 'B. which',
    explanation: 'Mệnh đề quan hệ không xác định (có dấu phẩy) chỉ vật dùng WHICH. KHÔNG dùng THAT.',
    trapWarning: 'Bẫy đề cực phổ biến: Chọn THAT khi có dấu phẩy là SAI!',
    level: 'Vận dụng cao (Thi vào 10)'
  },
  {
    id: 'e10-vg7',
    section: 'grammar',
    question: 'The tour guide suggested ________ the ancient citadel early in the morning to avoid the heat.',
    options: ['A. to visit', 'B. visiting', 'C. visit', 'D. visited'],
    correctAnswer: 'B. visiting',
    explanation: 'Sau "suggest" dùng V-ing khi không có mệnh đề THAT + chủ ngữ.',
    trapWarning: 'Dễ chọn nhầm "to visit" do thói quen chọn to-infinitive sau các động từ khác.',
    level: 'Thông hiểu'
  },

  // COMMUNICATION
  {
    id: 'e10-c1',
    section: 'communication',
    question: 'Tom: "Could you show me how to open this smart gate, please?" - Nam: "________"',
    options: ['A. Sure, no problem.', 'B. You’re welcome.', 'C. Yes, I do.', 'D. That’s a good idea.'],
    correctAnswer: 'A. Sure, no problem.',
    explanation: 'Đợi người khác hỏi nhờ giúp đỡ (Asking for help): Trả lời lịch sự bằng "Sure, no problem" hoặc "Certainly".',
    trapWarning: '"You’re welcome" chỉ dùng để đáp lại lời cám ơn.',
    level: 'Cơ bản'
  },

  // ERROR FINDING
  {
    id: 'e10-ef1',
    section: 'error-finding',
    question: 'Find the underlined part that needs correction: "The doctor (A) advised that he (B) stays in bed (C) for three days to (D) recover from the flu."',
    options: ['A. advised', 'B. stays', 'C. for', 'D. recover'],
    correctAnswer: 'B. stays',
    explanation: 'Cấu trúc giả định: advise + that + S + (should) + V-bare. "stays" phải sửa thành "stay" hoặc "should stay".',
    trapWarning: 'Mặc dù chủ ngữ là "he", động từ sau THAT vẫn phải ở dạng NGUYÊN THỂ (V-bare)!',
    level: 'Vận dụng cao (Thi vào 10)'
  },

  // READING COMPREHENSION PASSAGE
  {
    id: 'e10-rc1',
    section: 'reading',
    passage: 'Nowadays, more and more teenagers choose self-guided tours over traditional package holidays. A package holiday offers convenience because the travel agency takes care of accommodation, transportation, and itineraries. However, it lacks flexibility. In contrast, self-guided tours allow young travellers to customize their trips according to their own preferences and budget. They can hunt for cheap tickets, stay in local homestays, and explore off-the-beaten-track destinations. To enjoy a smooth self-guided trip, however, teenagers need good digital skills and time management abilities.',
    question: 'What is the main advantage of a package holiday mentioned in the passage?',
    options: ['A. It gives travellers total freedom.', 'B. The travel agency handles all arrangements.', 'C. It is always cheaper than self-guided tours.', 'D. It helps teens practice digital skills.'],
    correctAnswer: 'B. The travel agency handles all arrangements.',
    explanation: 'Trích dẫn trong bài: "A package holiday offers convenience because the travel agency takes care of accommodation, transportation, and itineraries."',
    level: 'Thông hiểu'
  },

  // WRITING - SENTENCE TRANSFORMATION
  {
    id: 'e10-w1',
    section: 'writing-rewrite',
    question: 'Rewrite the sentence: "Because there was a heavy snowstorm, we couldn’t reach the mountain top."',
    options: [
      'A. Because of a heavy snowstorm, we couldn’t reach the mountain top.',
      'B. Although it snowed heavily, we reached the mountain top.',
      'C. We reached the mountain top despite the heavy snowstorm.',
      'D. If there is a heavy snowstorm, we won’t reach the mountain top.'
    ],
    correctAnswer: 'A. Because of a heavy snowstorm, we couldn’t reach the mountain top.',
    explanation: 'Chuyển đổi mệnh đề nguyên nhân (Because + S + V) sang cụm danh từ (Because of + N/NP).',
    trapWarning: 'Dễ chọn nhầm câu C mặc dù mang nghĩa đối lập (despite = mặc dù).',
    level: 'Vận dụng cao (Thi vào 10)'
  }
];
