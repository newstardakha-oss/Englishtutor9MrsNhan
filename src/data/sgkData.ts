import { UnitInfo, VocabularyItem, GrammarTopic, PronunciationTopic, SGKExercise } from '../types';
import { FULL_VOCABULARY_UNIT_1_TO_6 } from './vocabUnit1to6Data';

export const UNITS_DATA: UnitInfo[] = [
  {
    id: 1,
    title: 'LOCAL COMMUNITY',
    theme: 'Cộng đồng địa phương',
    pageRange: 'Trang 8 - 17',
    description: 'Tìm hiểu về các nghề nghiệp giúp đỡ cộng đồng (community helpers), làng nghề truyền thống (craft villages), từ để hỏi đứng trước to-infinitive và phrasal verbs.',
    vocabularyOverview: ['artisan', 'community helper', 'handicraft', 'craft village', 'suburb', 'facilities', 'speciality food'],
    grammarFocus: ['Question words before to-infinitives (how/where/what to do)', 'Phrasal verbs (1): look around, come back, hand down, find out, take care of, get on with'],
    pronunciationFocus: 'Vowel revision: /æ/ (pack), /ɑː/ (park), /e/ (kettle)',
    skillsFocus: {
      reading: 'Đọc về đặc sản địa phương (Cốm Vòng, Đồ gốm Denby Pottery)',
      speaking: 'Thuyết trình ngắn về đặc sản hoặc nơi yêu thích',
      listening: 'Nghe bài nói về người giúp đỡ cộng đồng (lao công/nhân viên thu gom rác)',
      writing: 'Viết đoạn văn ~100 từ mô tả người giúp đỡ cộng đồng yêu thích'
    }
  },
  {
    id: 2,
    title: 'CITY LIFE',
    theme: 'Cuộc sống đô thị',
    pageRange: 'Trang 18 - 27',
    description: 'Tìm hiểu cuộc sống thành thị, giao thông, ô nhiễm, dịch vụ công cộng, so sánh kép (double comparatives) và cụm động từ phrasal verbs.',
    vocabularyOverview: ['downtown', 'concrete jungle', 'metro', 'sky train', 'public amenities', 'congested', 'construction site'],
    grammarFocus: ['Double comparatives (The + comparative + S + V, the + comparative + S + V)', 'Phrasal verbs (2): get around, carry out, come down with, hang out with, cut down on'],
    pronunciationFocus: 'Diphthongs: /aʊ/ (town), /əʊ/ (go), /eə/ (square)',
    skillsFocus: {
      reading: 'Đọc về cuộc thi Teenovator giải quyết vấn đề thành phố',
      speaking: 'Thảo luận các vấn đề thành phố và giải pháp',
      listening: 'Nghe phỏng vấn thanh thiếu niên về cuộc sống đô thị',
      writing: 'Viết đoạn văn ~100 từ nêu điểm thích/không thích về sống ở thành phố'
    }
  },
  {
    id: 3,
    title: 'HEALTHY LIVING FOR TEENS',
    theme: 'Lối sống lành mạnh cho tuổi teen',
    pageRange: 'Trang 28 - 37',
    description: 'Sức khỏe thể chất và tinh thần của học sinh, quản lý thời gian, giảm căng thẳng, động từ khuyết thiếu trong câu điều kiện loại 1.',
    vocabularyOverview: ['counsellor', 'well-balanced', 'priority', 'mental health', 'delay', 'due date', 'optimistic', 'stressed out'],
    grammarFocus: ['Modal verbs in first conditional sentences (If + S + V(s/es), S + can/must/should/may/might + V-bare)'],
    pronunciationFocus: 'Sounds: /h/ (healthy) and /r/ (regularly)',
    skillsFocus: {
      reading: 'Đọc về một ngôi sao tuổi teen duy trì cân bằng học tập',
      speaking: 'Thảo luận cách quản lý thời gian và giảm áp lực học tập',
      listening: 'Nghe các học sinh chia sẻ mẹo quản lý thời gian',
      writing: 'Viết đoạn văn ~100 từ về cách quản lý thời gian hiệu quả'
    }
  },
  {
    id: 4,
    title: 'REMEMBERING THE PAST',
    theme: 'Tưởng nhớ quá khứ',
    pageRange: 'Trang 40 - 49',
    description: 'Khám phá lịch sử, di sản văn hóa, món ăn truyền thống, thì Quá khứ tiếp diễn và câu ước với Wish ở hiện tại.',
    vocabularyOverview: ['heritage', 'preserve', 'monument', 'communal house', 'generation', 'takeaway', 'well preserved', 'structure'],
    grammarFocus: ['Past continuous (S + was/were + V-ing)', 'Wish + past simple (S + wish (that) + S + V-ed/V2)'],
    pronunciationFocus: 'Sounds: /m/ (monument) and /l/ (landscape, dark /l/)',
    skillsFocus: {
      reading: 'Đọc về món Fish and Chips - ẩm thực truyền thống nước Anh',
      speaking: 'Nói về món ăn truyền thống Việt Nam (Bánh chưng, Phở...)',
      listening: 'Nghe cuộc nói chuyện giữa Thanh và bà về trường học xưa',
      writing: 'Viết đoạn văn (100-120 từ) về ngày đi học thời xưa'
    }
  },
  {
    id: 5,
    title: 'OUR EXPERIENCES',
    theme: 'Trải nghiệm của chúng ta',
    pageRange: 'Trang 50 - 59',
    description: 'Kể về các chuyến đi, hoạt động ngoại khóa, khoá học hè, cảm xúc bối rối/phấn khích, thì Hiện tại hoàn thành.',
    vocabularyOverview: ['eco-tour', 'gong show', 'safari', 'embarrassing', 'exhilating', 'learn by rote', 'tour a campus', 'helpless'],
    grammarFocus: ['Present perfect (S + have/has + V3/V-ed) - trải nghiệm đã làm/chưa làm'],
    pronunciationFocus: 'Sounds: /j/ (yellow) and /w/ (watching)',
    skillsFocus: {
      reading: 'Đọc bài viết về khoá học hè quân đội & khoá học ở Mỹ',
      speaking: 'Hỏi đáp về trải nghiệm khoá học đã tham gia',
      listening: 'Nghe cuộc đối thoại giữa Minh và bố về kỷ niệm bị bắt nạt',
      writing: 'Viết đoạn văn (100-120 từ) về trải nghiệm đáng nhớ ở trường'
    }
  },
  {
    id: 6,
    title: 'VIETNAMESE LIFESTYLE: THEN AND NOW',
    theme: 'Lối sống người Việt: Xưa và Nay',
    pageRange: 'Trang 60 - 69',
    description: 'So sánh phong cách sống, cách học, quan hệ gia đình xưa và nay; Động từ theo sau bởi to-infinitive và V-ing.',
    vocabularyOverview: ['generation gap', 'extended family', 'nuclear family', 'family-oriented', 'memorise', 'pursue', 'replace', 'privacy'],
    grammarFocus: ['Verbs + to-infinitive (want, decide, agree, promise, plan, learn)', 'Verbs + V-ing (enjoy, fancy, finish, mind, avoid, suggest)'],
    pronunciationFocus: 'Sounds: /fl/ (flute) and /fr/ (frame, fresh)',
    skillsFocus: {
      reading: 'Đọc về phong cách học tập của ông Nam (xưa) và Mai (nay)',
      speaking: 'Thảo luận sự thay đổi trong cách học 5 năm qua',
      listening: 'Nghe bài nói về cuộc sống gia đình người Việt xưa và nay',
      writing: 'Viết email (100-120 từ) cho bạn về sự thay đổi trong gia đình'
    }
  },
  {
    id: 7,
    title: 'NATURAL WONDERS OF THE WORLD',
    theme: 'Kỳ quan thiên nhiên thế giới',
    pageRange: 'Trang 72 - 81',
    description: 'Khám phá các kỳ quan thiên nhiên (Vịnh Hạ Long, Rạn san hô Great Barrier, Rừng Amazon), Câu tường thuật dạng câu hỏi Yes/No.',
    vocabularyOverview: ['natural wonder', 'landscape', 'mountain range', 'flora and fauna', 'habitat', 'preserve', 'urgent', 'biodiversity'],
    grammarFocus: ['Reported speech (Yes/No questions: S + asked/wanted to know + if/whether + S + V-lùi thì)'],
    pronunciationFocus: 'Sounds: /sl/ (sleepy, slope) and /sn/ (snack, snowy)',
    skillsFocus: {
      reading: 'Đọc về dãy núi Dolomites ở Ý',
      speaking: 'Giới thiệu về Rạn san hô Great Barrier Reef',
      listening: 'Nghe bài nói về đa dạng sinh học rừng mưa Amazon',
      writing: 'Viết đoạn văn (100-120 từ) mô tả danh thắng thiên nhiên ở địa phương'
    }
  },
  {
    id: 8,
    title: 'TOURISM',
    theme: 'Du lịch',
    pageRange: 'Trang 82 - 91',
    description: 'Loại hình du lịch (eco-tourism, food tourism, package tour), Đại từ quan hệ (who, which, whose).',
    vocabularyOverview: ['package holiday', 'self-guided tour', 'itinerary', 'homestay', 'destination', 'local speciality', 'smooth trip'],
    grammarFocus: ['Relative pronouns: WHO (người), WHICH (vật/việc), WHOSE (sở hữu)'],
    pronunciationFocus: 'Stress in words ending in -ic (basic, classic) and -ious (curious, delicious)',
    skillsFocus: {
      reading: 'Đọc phân biệt Package tour và Self-guided tour',
      speaking: 'Phỏng vấn bạn học về chuyến du lịch gần đây',
      listening: 'Nghe thông báo tour tham quan quê hương nhà văn Brontë',
      writing: 'Viết đoạn văn giới thiệu tour du lịch nửa ngày ở Huế (5 hours)'
    }
  },
  {
    id: 9,
    title: 'WORLD ENGLISHES',
    theme: 'Tiếng Anh trên thế giới',
    pageRange: 'Trang 92 - 101',
    description: 'Sự đa dạng của tiếng Anh (Anh-Anh, Anh-Mỹ), từ mượn (borrowed words), Mệnh đề quan hệ xác định (Defining relative clauses).',
    vocabularyOverview: ['bilingual', 'fluent', 'official language', 'first language', 'accent', 'dialect', 'borrowed word', 'variety'],
    grammarFocus: ['Defining relative clauses (Mệnh đề quan hệ xác định) & Khi nào lược bỏ đại từ quan hệ (Object)'],
    pronunciationFocus: 'Stress in words ending in -ion (decision) and -ity (ability)',
    skillsFocus: {
      reading: 'Đọc mô hình 3 vòng tròn tiếng Anh của Giáo sư Braj Kachru (Inner, Outer, Expanding)',
      speaking: 'Thảo luận về các từ mượn trong tiếng Anh (sushi, banh mi, robot)',
      listening: 'Nghe chia sẻ của Trang về kinh nghiệm học từ vựng tiếng Anh',
      writing: 'Viết đoạn văn (100-120 từ) về thách thức lớn nhất khi học tiếng Anh'
    }
  },
  {
    id: 10,
    title: 'PLANET EARTH',
    theme: 'Hành tinh Trái Đất',
    pageRange: 'Trang 104 - 113',
    description: 'Hệ sinh thái, môi trường sống, hệ Mặt Trời, loài động thực vật, Mệnh đề quan hệ không xác định (Non-defining relative clauses).',
    vocabularyOverview: ['habitat', 'flora and fauna', 'food chain', 'outer space', 'landform', 'ecosystem', 'threat', 'nature reserve'],
    grammarFocus: ['Non-defining relative clauses (Mệnh đề quan hệ không xác định có dấu phẩy, không dùng THAT)'],
    pronunciationFocus: 'Rhythm in sentences (Nhịp điệu trong câu tiếng Anh)',
    skillsFocus: {
      reading: 'Đọc bài văn về vai trò của động thực vật đối với hệ sinh thái Trái Đất',
      speaking: 'Thảo luận mối đe dọa với động thực vật và biện pháp bảo vệ',
      listening: 'Nghe bài nói của thầy An về ảnh hưởng của sinh vật với môi trường',
      writing: 'Viết đoạn tóm tắt (100-120 từ) nội dung bài nói về bảo vệ Trái Đất'
    }
  },
  {
    id: 11,
    title: 'ELECTRONIC DEVICES',
    theme: 'Thiết bị điện tử',
    pageRange: 'Trang 114 - 123',
    description: 'Các thiết bị công nghệ hiện đại (smartwatch, 3D printer, robotic vacuum cleaner), Cấu trúc với suggest / advise / recommend.',
    vocabularyOverview: ['robotic vacuum cleaner', 'e-reader', 'smartwatch', '3D printer', 'camcorder', 'touchscreen', 'portable', 'wireless'],
    grammarFocus: ['Suggest / advise / recommend + V-ing', 'Suggest / advise / recommend + (that) + S + (should) + V-bare'],
    pronunciationFocus: 'Stress on all words in sentences (Trọng âm từ trong câu)',
    skillsFocus: {
      reading: 'Đọc bài về các thiết bị điện tử thông minh (smartphone, smart window shade)',
      speaking: 'Nói về thiết bị điện tử quan trọng đối với bản thân',
      listening: 'Nghe bài nói của Trang về chiếc máy hút bụi robot hiện tại & tương lai',
      writing: 'Viết đoạn văn (100-120 từ) về thiết bị điện tử yêu thích và tính năng tương lai'
    }
  },
  {
    id: 12,
    title: 'CAREER CHOICES',
    theme: 'Lựa chọn nghề nghiệp',
    pageRange: 'Trang 124 - 133',
    description: 'Nghề nghiệp tương lai, trường học nghề vs đại học, phẩm chất & kỹ năng, Mệnh đề trạng ngữ chỉ sự nhượng bộ, kết quả, lý do.',
    vocabularyOverview: ['assembly worker', 'software engineer', 'tailor', 'surgeon', 'bartender', 'vocational course', 'hands-on', 'well-paid'],
    grammarFocus: ['Adverbial clauses of concession (although/even though/though)', 'Adverbial clauses of result (so/such...that)', 'Adverbial clauses of reason (because/since/as)'],
    pronunciationFocus: 'Intonation in statements used as questions (Lên giọng ở cuối câu hỏi xác nhận)',
    skillsFocus: {
      reading: 'Đọc về thế giới việc làm đang thay đổi khi bước sang tuổi 15',
      speaking: 'Thảo luận về nghề nghiệp mong muốn trong tương lai',
      listening: 'Nghe câu chuyện hướng nghiệp của Minh (nông nghiệp) và Ann (đầu bếp)',
      writing: 'Viết email (100-120 từ) kể cho bạn bè về nghề nghiệp mơ ước'
    }
  }
];

export const ADDITIONAL_UNITS_VOCABULARY: VocabularyItem[] = [
  // Unit 8
  {
    id: 'v8-1',
    word: 'itinerary',
    ipa: '/aɪˈtɪnərəri/',
    partOfSpeech: 'noun',
    meaning: 'lịch trình chuyến đi',
    unit: 8,
    collocations: ['fixed itinerary', 'travel itinerary'],
    example: 'The travel agency provided us with a detailed tour itinerary.',
    examNote: '[THI VÀO 10] Phát âm IPA chú ý trọng âm âm tiết 2 /aɪˈtɪnərəri/.'
  },
  // Unit 9
  {
    id: 'v9-1',
    word: 'bilingual',
    ipa: '/ˌbaɪˈlɪŋɡwəl/',
    partOfSpeech: 'adjective',
    meaning: 'song ngữ (nói thành thạo 2 ngôn ngữ)',
    unit: 9,
    wordFamily: { root: 'lingual', adjective: 'monolingual / multilingual' },
    example: 'She grew up in Wales and became completely bilingual in English and Welsh.',
    examNote: '[THI VÀO 10] Phân biệt: Monolingual (đơn ngữ), Bilingual (song ngữ), Multilingual (đa ngữ).'
  },
  // Unit 11
  {
    id: 'v11-1',
    word: 'portable',
    ipa: '/ˈpɔːtəbl/',
    partOfSpeech: 'adjective',
    meaning: 'có thể mang theo, di động',
    unit: 11,
    collocations: ['portable device', 'portable charger'],
    example: 'This tablet is lightweight and very portable.',
    examNote: '[THI VÀO 10] Dễ nhầm với "potable" (uống được).'
  },
  // Unit 12
  {
    id: 'v12-1',
    word: 'vocational',
    ipa: '/vəʊˈkeɪʃənl/',
    partOfSpeech: 'adjective',
    meaning: 'thuộc về học nghề, hướng nghiệp',
    unit: 12,
    collocations: ['vocational course', 'vocational school', 'vocational training'],
    wordFamily: { root: 'vocation', noun: 'vocation' },
    example: 'Many students choose vocational courses after finishing grade 9.',
    examNote: '[THI VÀO 10] Word form: They attend _____ (vocation) schools to learn mechanics.'
  }
];

export const CORE_VOCABULARY: VocabularyItem[] = [
  ...FULL_VOCABULARY_UNIT_1_TO_6,
  ...ADDITIONAL_UNITS_VOCABULARY
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'g-qwords-toinf',
    title: 'Từ để hỏi đứng trước To-Infinitive (Question words before to-infinitives)',
    unit: 1,
    formula: 'S + V (ask / wonder / know / decide / tell) + WHO / WHAT / WHERE / WHEN / HOW + TO-V',
    usage: 'Dùng để diễn tả một câu hỏi gián tiếp hoặc quyết định cần làm gì mà không cần lặp lại chủ ngữ.',
    signs: ['ask', 'wonder', 'don’t know', 'decide', 'show', 'tell'],
    examples: [
      'I don’t know how to deal with this problem.',
      'She asked where to buy traditional handicrafts.',
      'Could you tell me what to do next?'
    ],
    commonErrors: [
      '❌ Sai: I don’t know how I can to deal with this problem.',
      '✅ Đúng: I don’t know how to deal with this problem. (Hoặc: how I can deal with...)'
    ],
    examTraps: [
      '⚠️ Không dùng WHY trước TO-V (Không bao giờ có "why to do"). Chỉ dùng WHO, WHAT, WHERE, WHEN, HOW + TO-V.'
    ],
    memoryTips: 'Tóm tắt: Động từ nhận biết + [who/what/where/when/how] + TO-V. Tuyệt đối KHÔNG dùng WHY + To-V!'
  },
  {
    id: 'g-double-comp',
    title: 'So sánh kép (Double Comparatives)',
    unit: 2,
    formula: 'The + comparative (adj/adv) + S + V, the + comparative (adj/adv) + S + V',
    usage: 'Càng... thì càng... (Sự thay đổi của một vế kéo theo sự thay đổi của vế kia).',
    signs: ['The more...', 'The busier...', 'The cleaner...'],
    examples: [
      'The more developed the city is, the more crowded it becomes.',
      'The busier the road got, the more stressed I felt.',
      'The harder you study, the better results you will get.'
    ],
    commonErrors: [
      '❌ Quên từ "THE" ở vế thứ hai: More developed the city is, more crowded it becomes.',
      '❌ Dùng nhầm dạng so sánh nhất (the most) thay vì so sánh hơn (the more).'
    ],
    examTraps: [
      '⚠️ Chú ý vị trí của tính từ ngắn (thêm -er) và tính từ dài (dùng MORE/LESS). Ví dụ: The higher the price is, the less affordable the house becomes.'
    ],
    memoryTips: 'Nhớ công thức: Bắt buộc PHẢI CÓ "THE" ở CẢ HAI VẾ + Tính từ/trạng từ dạng so sánh hơn!'
  },
  {
    id: 'g-modals-cond1',
    title: 'Động từ khuyết thiếu trong câu điều kiện loại 1',
    unit: 3,
    formula: 'If + S + V(s/es) (Hiện tại đơn), S + CAN / MUST / SHOULD / MAY / MIGHT + V-bare',
    usage: 'Diễn tả lời khuyên, sự cho phép, khả năng hoặc nghĩa vụ trong tương lai nếu điều kiện xảy ra.',
    signs: ['If clause', 'should (khuyên)', 'can (khả năng)', 'must (bắt buộc)'],
    examples: [
      'If you want to maintain good health, you SHOULD eat a balanced diet.',
      'If she finishes her paper early, she CAN hand it in.',
      'If you don’t want to be punished, you MUST follow the school rules.'
    ],
    commonErrors: [
      '❌ Chia nhầm thì ở mệnh đề IF (dùng WILL ở mệnh đề IF).',
      '✅ Mệnh đề IF luôn chia ở Hiện tại đơn!'
    ],
    examTraps: [
      '⚠️ Mệnh đề chính dùng SHOULD để cho lời khuyên (advice), CAN cho khả năng (ability), MUST cho sự bắt buộc (necessity).'
    ],
    memoryTips: 'Mệnh đề IF = Hiện tại đơn. Mệnh đề chính = Modal verb (can/should/must/may) + V-bare.'
  },
  {
    id: 'g-wish-past',
    title: 'Câu ước ở hiện tại (Wish + Past Simple)',
    unit: 4,
    formula: 'S + wish(es) + (that) + S + V-ed / V2 (To be: WERE cho tất cả các ngôi)',
    usage: 'Diễn tả mong ước một điều KHÔNG CÓ THẬT ở hiện tại hoặc trái ngược với thực tế.',
    signs: ['wish', 'if only', 'at present', 'now'],
    examples: [
      'I wish I HAD enough money to travel around the world. (Thực tế: I don’t have enough money)',
      'She wishes her sister WERE tidier. (Thực tế: Her sister is messy)',
      'We wish we COULD visit Windsor Castle. (Thực tế: We can’t visit)'
    ],
    commonErrors: [
      '❌ Dùng Was thay vì Were trong văn viết chuẩn thi vào 10 (Mặc dù nói có thể gặp was, khi thi nên viết WERE).',
      '❌ Quên lùi thì (dùng thì hiện tại đơn sau wish).'
    ],
    examTraps: [
      '⚠️ Đề thi viết lại câu: "I am sorry that I don’t have a laptop." -> "I wish I HAD a laptop."'
    ],
    memoryTips: 'Ước hiện tại -> LÙI VỀ QUÁ KHỨ ĐƠN! Động từ to-be luôn chọn WERE.'
  },
  {
    id: 'g-relative-clauses',
    title: 'Mệnh đề quan hệ (Relative Clauses - Defining & Non-defining)',
    unit: 8,
    formula: 'WHO (người - S/O), WHICH (vật - S/O), WHOSE (sở hữu + N), THAT (người/vật)',
    usage: 'Dùng để bổ nghĩa cho danh từ đứng trước nó. Phân biệt mệnh đề xác định (không có dấu phẩy) và không xác định (có dấu phẩy, không được dùng THAT).',
    signs: ['danh từ chỉ người', 'danh từ chỉ vật', 'danh từ riêng có phẩy'],
    examples: [
      'The man WHO is talking to the teacher is my father.',
      'The book WHICH I picked up yesterday is fascinating.',
      'Ha Long Bay, WHICH is a UNESCO World Heritage Site, attracts millions of tourists. (Không xác định)'
    ],
    commonErrors: [
      '❌ Dùng THAT trong mệnh đề quan hệ không xác định (có dấu phẩy).',
      '❌ Viết lặp lại tân ngữ: The book which I read IT yesterday (Thừa "it").'
    ],
    examTraps: [
      '⚠️ Sau WHOSE luôn là một Danh từ không có a/an/the (Ví dụ: The girl whose father is a doctor...).',
      '⚠️ Mệnh đề xác định: Lược bỏ đại từ quan hệ khi nó đóng vai trò Tân ngữ (Object).'
    ],
    memoryTips: 'Có dấu phẩy -> KHÔNG dùng THAT! Sau WHOSE + Danh từ!'
  },
  {
    id: 'g-reported-yesno',
    title: 'Câu gián tiếp dạng câu hỏi Yes/No (Reported Speech)',
    unit: 7,
    formula: 'S + asked / wanted to know / wondered + O + IF / WHETHER + S + V (lùi thì)',
    usage: 'Tường thuật lại câu hỏi Yes/No của ai đó.',
    signs: ['asked', 'if/whether', 'lùi thì', 'đổi đại từ & trạng từ'],
    examples: [
      'Direct: "Are you excited about the trip?" Kate asked.',
      'Reported: Kate asked IF/WHETHER we WERE excited about the trip.',
      'Direct: "Will they visit Sa Pa this summer?" he asked.',
      'Reported: He asked IF they WOULD visit Sa Pa that summer.'
    ],
    commonErrors: [
      '❌ Quên bỏ đảo ngữ trợ động từ (Giữ nguyên "did they go" thay vì "they went").',
      '❌ Quên lùi thì hoặc quên đổi từ chỉ thời gian/nơi chốn (this -> that, now -> then).'
    ],
    examTraps: [
      '⚠️ Sau IF/WHETHER là câu KHẲNG ĐỊNH (S + V), không đảo trợ động từ lên trước S!'
    ],
    memoryTips: 'Tường thuật hỏi Yes/No = ASKED + IF/WHETHER + CHỦ NGỮ + ĐỘNG TỪ LÙI THÌ.'
  },
  {
    id: 'g-suggest-ving',
    title: 'Cấu trúc Suggest / Advise / Recommend',
    unit: 11,
    formula: 'S + suggest / advise / recommend + V-ING  |  S + suggest / advise / recommend + (that) + S + (should) + V-bare',
    usage: 'Đưa ra lời gợi ý, khuyên bảo hoặc đề xuất giải pháp.',
    signs: ['suggest', 'advise', 'recommend'],
    examples: [
      'My teacher suggested BUYING a good English dictionary.',
      'The doctor advised that he (SHOULD) NOT STAY up late.',
      'I recommend that you (should) review all grammar points before the exam.'
    ],
    commonErrors: [
      '❌ Chia động từ sai ở mệnh đề sau THAT: "I suggest that he buys..." (Sai - phải là BUY hoặc SHOULD BUY).',
      '❌ Nhầm lẫn giữa "advise sb TO DO sth" và "advise V-ing".'
    ],
    examTraps: [
      '⚠️ Sau THAT, động từ LUÔN LÀ DẠNG NGUYÊN THỂ (V-bare) dù chủ ngữ là he/she/it! Vì ẩn từ "should".'
    ],
    memoryTips: 'Suggest V-ing. Nhớ: Suggest THAT + S + V-nguyên thể!'
  }
];

export const PRONUNCIATION_GUIDES: PronunciationTopic[] = [
  {
    unit: 1,
    title: 'Phát âm Nguyên âm: /æ/, /ɑː/, và /e/',
    sounds: ['/æ/', '/ɑː/', '/e/'],
    rules: [
      '/æ/: Miệng mở rộng, lưỡi hạ thấp. Ví dụ: pack, cat, trash.',
      '/ɑː/: Âm a dài, mở rộng họng. Ví dụ: park, chart, artisan.',
      '/e/: Miệng mở vừa phải, lưỡi nâng nhẹ. Ví dụ: kettle, merry, bread.'
    ],
    examples: [
      { word: 'pack', ipa: '/pæk/' },
      { word: 'park', ipa: '/pɑːk/' },
      { word: 'kettle', ipa: '/ˈketl/' },
      { word: 'chart', ipa: '/tʃɑːt/' },
      { word: 'cattle', ipa: '/ˈkætl/' }
    ],
    commonMistakes: ['Học sinh thường nhầm /æ/ (pack) và /e/ (peck) hoặc đọc sai /ɑː/ thành âm /æ/ ngắt ngắn.']
  },
  {
    unit: 8,
    title: 'Trọng âm từ có đuôi -ic và -ious',
    sounds: ['-ic', '-ious'],
    rules: [
      'Quy tắc vàng: Trọng âm luôn rơi vào ÂM TIẾT NGAY TRƯỚC HẬU TỐ -ic và -ious.',
      'Ví dụ đuôi -ic: bas\'ic, pub\'lic, class\'ic, domes\'tic, his\'toric.',
      'Ví dụ đuôi -ious: cur\'ious, ser\'ious, deli\'cious, hila\'rious, reli\'gious.'
    ],
    examples: [
      { word: 'historic', ipa: '/hɪˈstɒrɪk/' },
      { word: 'delicious', ipa: '/dɪˈlɪʃəs/' },
      { word: 'curious', ipa: '/ˈkjʊəriəs/' },
      { word: 'romantic', ipa: '/rəʊˈmæntɪk/' }
    ],
    commonMistakes: ['Nhấn sai trọng âm lên chính đuôi -ic hay -ious thay vì âm tiết liền trước.']
  },
  {
    unit: 9,
    title: 'Trọng âm từ có đuôi -ion và -ity',
    sounds: ['-ion', '-ity'],
    rules: [
      'Quy tắc vàng: Trọng âm luôn rơi vào ÂM TIẾT NGAY TRƯỚC HẬU TỐ -ion và -ity.',
      'Ví dụ -ion: rela\'tion, deci\'sion, edu\'cation, opera\'tion.',
      'Ví dụ -ity: cha\'rity, qua\'lity, cla\'rity, abi\'lity, obe\'sity.'
    ],
    examples: [
      { word: 'education', ipa: '/ˌedʒuˈkeɪʃn/' },
      { word: 'ability', ipa: '/əˈbɪləti/' },
      { word: 'decision', ipa: '/dɪˈsɪʒn/' },
      { word: 'community', ipa: '/kəˈmjuːnəti/' }
    ],
    commonMistakes: ['Đọc sai trọng âm từ education (nhấn âm 3 /keɪ/).']
  }
];

export const SGK_SAMPLE_EXERCISES: SGKExercise[] = [
  {
    id: 'sgk-u1-ex1',
    unit: 1,
    section: 'A Closer Look 2',
    type: 'fill-blank',
    question: 'I don’t know ________ to deal with this difficult problem. (a suitable question word)',
    correctAnswer: 'how',
    explanation: 'Cấu trúc "Question word + to-infinitive". "deal with a problem" đi với từ để hỏi HOW (như thế nào/cách thức).',
    hints: {
      level1: 'Đọc kĩ ngữ cảnh: bạn đang muốn tìm "cách thức" giải quyết vấn đề.',
      level2: 'Dùng từ để hỏi đứng trước to-infinitive diễn tả phương pháp/cách thức: H...',
      level3: 'Điền từ "how": how to deal with this problem.'
    },
    tag: '[SGK]'
  },
  {
    id: 'sgk-u1-ex2',
    unit: 1,
    section: 'A Closer Look 2',
    type: 'rewrite',
    question: 'Rewrite using question word + to-infinitive: "I don’t know how I can get to the swimming pool."',
    correctAnswer: 'I don’t know how to get to the swimming pool.',
    explanation: 'Rút gọn mệnh đề phụ phụ thuộc có chung chủ ngữ bằng cách thay "I can get" -> "to get".',
    hints: {
      level1: 'Bỏ chủ ngữ "I" và trợ động từ "can", thay bằng dạng TO + V-bare.',
      level2: 'Cấu trúc: S + V + question word + TO-V.',
      level3: 'Đáp án là: I don’t know how to get to the swimming pool.'
    },
    tag: '[SGK]'
  },
  {
    id: 'sgk-u2-ex1',
    unit: 2,
    section: 'A Closer Look 2',
    type: 'multiple-choice',
    question: 'The ________ developed the city is, the ________ crowded it becomes.',
    options: ['A. more / more', 'B. most / most', 'C. much / much', 'D. higher / higher'],
    correctAnswer: 'A. more / more',
    explanation: 'Cấu trúc so sánh kép: The + comparative + S + V, the + comparative + S + V. "developed" là tính từ dài nên dùng "more developed".',
    hints: {
      level1: 'Cả hai vế đều cần từ "The" + dạng so sánh hơn.',
      level2: 'Developed là tính từ dài có 3 âm tiết.',
      level3: 'Đáp án là A: The more developed..., the more crowded...'
    },
    tag: '[SGK]'
  },
  {
    id: 'sgk-u4-ex1',
    unit: 4,
    section: 'A Closer Look 2',
    type: 'rewrite',
    question: 'Rewrite using WISH: "She doesn’t have an iPhone. She’d like to have one."',
    correctAnswer: 'She wishes (that) she had an iPhone.',
    explanation: 'Câu ước ở hiện tại: S + wish + S + V-past. Động từ "don’t have" lùi thì thành "had".',
    hints: {
      level1: 'Sử dụng cấu trúc câu ước với Wish ở hiện tại.',
      level2: 'Lùi động từ "have" về quá khứ đơn.',
      level3: 'Đáp án: She wishes (that) she had an iPhone.'
    },
    tag: '[THI VÀO 10]'
  },
  {
    id: 'sgk-u8-ex1',
    unit: 8,
    section: 'A Closer Look 2',
    type: 'fill-blank',
    question: 'Son Doong is now a world-famous destination for travellers ________ love exploring caves.',
    correctAnswer: 'who',
    explanation: ' travellers là danh từ chỉ người đóng vai trò Chủ ngữ phía trước -> dùng đại từ quan hệ WHO.',
    hints: {
      level1: 'Xác định từ đứng trước là người (travellers) hay vật.',
      level2: 'Phía sau là động từ "love" nên cần đại từ quan hệ chỉ người làm chủ ngữ.',
      level3: 'Điền từ "who".'
    },
    tag: '[THI VÀO 10]'
  },
  {
    id: 'sgk-u11-ex1',
    unit: 11,
    section: 'A Closer Look 2',
    type: 'fill-blank',
    question: 'My teacher suggested ________ (buy) a new laptop for online learning.',
    correctAnswer: 'buying',
    explanation: 'Cấu trúc: suggest + V-ing.',
    hints: {
      level1: 'Nhớ lại động từ đi trực tiếp sau "suggest" không có mệnh đề THAT.',
      level2: 'Suggest + V-ing.',
      level3: 'Chuyển "buy" thành "buying".'
    },
    tag: '[SGK]'
  }
];
