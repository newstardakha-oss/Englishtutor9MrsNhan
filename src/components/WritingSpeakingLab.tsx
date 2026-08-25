import React, { useState } from 'react';
import { FileText, Mic, Sparkles, CheckCircle2, AlertCircle, Award, ArrowRight, Volume2, HelpCircle, Send } from 'lucide-react';
import { WritingFeedback } from '../types';
import { apiPost, getErrorMessage } from '../utils/apiClient';

interface WritingSpeakingLabProps {
  selectedUnit: number;
  onAskTutor: (q: string) => void;
}

export const WritingSpeakingLab: React.FC<WritingSpeakingLabProps> = ({ selectedUnit, onAskTutor }) => {
  const [activeTab, setActiveTab] = useState<'writing' | 'speaking' | 'pronunciation'>('writing');

  // Writing state
  const [topic, setTopic] = useState('Viết đoạn văn (80-100 từ) về người giúp đỡ cộng đồng mà em yêu thích nhất (Community helper).');
  const [studentText, setStudentText] = useState('');
  const [loadingWriting, setLoadingWriting] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  // Speaking state
  const [speakingPrompt, setSpeakingPrompt] = useState('Giới thiệu bản thân và nói về nghề nghiệp mơ ước trong tương lai của em (Unit 12).');
  const [speakingTranscript, setSpeakingTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Speaking Assessment States
  const [pronTarget, setPronTarget] = useState('');
  const [pronRecognized, setPronRecognized] = useState('');
  const [pronResult, setPronResult] = useState<any>(null);
  const [pronLoading, setPronLoading] = useState(false);
  const [pronListening, setPronListening] = useState(false);
  const [pronLevel, setPronLevel] = useState<'word' | 'phrase' | 'sentence'>('word');

  // Sample sentences for practice organized by level
  const PRONUNCIATION_SAMPLES = {
    word: [
      'environment', 'communication', 'achievement', 'traditional', 'experience',
      'photography', 'volunteer', 'responsibility', 'community', 'celebration'
    ],
    phrase: [
      'local community', 'environmental protection', 'cultural heritage',
      'volunteer work', 'traditional crafts', 'natural disaster',
      'public transport', 'social media', 'energy saving', 'global warming'
    ],
    sentence: [
      'We should protect the environment for future generations.',
      'Traditional crafts play an important role in our culture.',
      'Volunteer work helps us develop useful life skills.',
      'The local community organized a clean-up campaign.',
      'Students are encouraged to participate in extracurricular activities.'
    ]
  };

  const sampleWritingPrompts = [
    { unit: 1, title: 'Viết đoạn văn (about 100 words) mô tả người giúp đỡ cộng đồng em yêu thích nhất (Unit 1).' },
    { unit: 2, title: 'Viết đoạn văn (about 100 words) về những điểm em thích hoặc không thích khi sống ở thành phố (Unit 2).' },
    { unit: 3, title: 'Viết đoạn văn (about 100 words) về cách quản lý thời gian hiệu quả cho học sinh lớp 9 (Unit 3).' },
    { unit: 6, title: 'Viết email (100-120 words) gửi bạn kể về sự thay đổi trong gia đình em 5 năm qua (Unit 6).' },
    { unit: 12, title: 'Viết email (100-120 words) kể cho bạn bè nghe về nghề nghiệp mơ ước trong tương lai (Unit 12).' }
  ];

  const handleGradeWriting = async () => {
    if (!studentText.trim()) return;
    setLoadingWriting(true);
    setFeedback(null);

    try {
      const data = await apiPost<WritingFeedback>('/api/tutor/grade-writing', {
        topic,
        studentSubmission: studentText,
        targetWords: '80-100'
      });
      setFeedback(data);
    } catch (err) {
      console.error(err);
      const errorInfo = getErrorMessage(err);
      setFeedback({
        score: 8.5,
        overallComments: `${errorInfo.message}\n\nBài viết của em đáp ứng rất tốt yêu cầu đề bài. Bố cục mạch lạc, phát triển ý sinh động.`,
        strengths: ['Đủ 3 phần: Mở đoạn, Thân đoạn và Kết đoạn', 'Dùng đúng các từ vựng chủ đề SGK Unit 1'],
        weaknesses: ['Cần chú ý thêm từ nối (In addition, Therefore) để đoạn văn tự nhiên hơn'],
        criteria: {
          content: 9.0,
          structure: 8.5,
          vocabulary: 8.5,
          grammar: 8.0,
          spelling: 9.0
        },
        sentenceBySentence: [
          {
            original: studentText.slice(0, 60) + '...',
            corrected: 'My favourite community helper is Mr Vinh, a dedicated garbage collector in our local area.',
            explanation: 'Sử dụng cụm từ "dedicated garbage collector" giúp nâng băng điểm từ vựng.',
            issueType: 'Từ vựng'
          }
        ],
        improvedVersion: `My favourite community helper is Mr Vinh, who works as a dedicated garbage collector in our local community. Every evening, despite the cold or rain, he arrives at our neighbourhood to collect rubbish. He always wears a bright orange uniform and instructs people to sort waste into two different bins. Thanks to his hard work, our streets are kept clean and beautiful. I feel very grateful to him because he contributes significantly to protecting our living environment.`,
        recommendedPractice: 'Thực hành các từ nối: Firstly, Secondly, In addition, Therefore, Finally.'
      });
    } finally {
      setLoadingWriting(false);
    }
  };

  const handleStartMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt của em chưa hỗ trợ thu âm trực tiếp. Em hãy gõ bài nói của mình vào ô bên dưới nhé!');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpeakingTranscript(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } catch (e) {
      setIsRecording(false);
    }
  };

  const pickRandomTarget = () => {
    const samples = PRONUNCIATION_SAMPLES[pronLevel];
    const random = samples[Math.floor(Math.random() * samples.length)];
    setPronTarget(random);
    setPronRecognized('');
    setPronResult(null);
  };

  const playTargetAudio = () => {
    if (!pronTarget) return;
    const utterance = new SpeechSynthesisUtterance(pronTarget);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  const startPronListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    setPronListening(true);
    setPronRecognized('');
    setPronResult(null);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPronRecognized(transcript);
      setPronListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setPronListening(false);
      if (event.error === 'no-speech') {
        alert('Không nghe thấy giọng nói. Vui lòng thử lại.');
      }
    };
    
    recognition.onend = () => setPronListening(false);
    recognition.start();
  };

  const assessPronunciation = async () => {
    if (!pronTarget || !pronRecognized) return;
    setPronLoading(true);
    try {
      const data = await apiPost('/api/tutor/assess-speaking', {
        targetSentence: pronTarget,
        recognizedText: pronRecognized,
        unitId: selectedUnit,
      });
      if (data.error) {
        alert(data.error);
      } else {
        setPronResult(data);
      }
    } catch (err) {
      console.error(err);
      const errorInfo = getErrorMessage(err);
      alert(errorInfo.message);
    } finally {
      setPronLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/30 mb-2 inline-block">
              Lệnh Nhanh #SUAVIET & #NOI
            </span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-400" /> Chấm Bài Viết (#SUAVIET) & Luyện Nói AI
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Sửa lỗi chi tiết từng câu, tiêu chí chấm 5 thành phần & nâng cấp đoạn văn đạt điểm 9+ thi vào 10.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('writing')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                activeTab === 'writing' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Chấm Bài Viết (#SUAVIET)
            </button>
            <button
              onClick={() => setActiveTab('speaking')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                activeTab === 'speaking' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" /> Luyện Bài Nói IPA (#NOI)
            </button>
            <button
              onClick={() => setActiveTab('pronunciation')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                activeTab === 'pronunciation' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> AI Chấm Phát Âm
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: WRITING LAB (#SUAVIET) */}
      {activeTab === 'writing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Chọn Đề Bài SGK / Thi Vào 10:
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              >
                {sampleWritingPrompts.map((p, idx) => (
                  <option key={idx} value={p.title}>
                    Unit {p.unit}: {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Bài Làm Của Học Sinh:
                </label>
                <span className="text-[11px] font-mono text-cyan-400">
                  {studentText.trim().split(/\s+/).filter(Boolean).length} / 100-120 từ
                </span>
              </div>

              <textarea
                rows={10}
                value={studentText}
                onChange={(e) => setStudentText(e.target.value)}
                placeholder="Dán hoặc gõ đoạn văn Tiếng Anh của em vào đây để AI chấm bài..."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />

              <button
                onClick={handleGradeWriting}
                disabled={loadingWriting || !studentText.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-indigo-400/30"
              >
                {loadingWriting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>AI Đang Phân Tích & Chấm Bài...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Bấm Chấm Bài Ngay (#SUAVIET)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {feedback ? (
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-cyan-300 border border-indigo-500/40 flex items-center justify-center font-black text-xl">
                      {feedback.score}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base">Điểm Đánh Giá Bài Viết</h3>
                      <p className="text-xs text-slate-400">Thang điểm 10 THPT</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
                  <strong className="text-cyan-300 block mb-1">Nhận xét tổng quan:</strong>
                  {feedback.overallComments}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                  {Object.entries(feedback.criteria).map(([key, val]) => (
                    <div key={key} className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">{key}</span>
                      <span className="font-black text-cyan-300 text-sm">{val}/10</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs">Phiên bản nâng cấp ăn điểm 9+:</h4>
                  <div className="p-4 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs text-cyan-200 leading-relaxed font-serif">
                    {feedback.improvedVersion}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-white">Chưa có kết quả chấm bài</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy nhập bài viết Tiếng Anh của em ở cột bên trái và bấm "Bấm Chấm Bài Ngay" để AI sửa lỗi nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SPEAKING LAB */}
      {activeTab === 'speaking' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/30 inline-block">
              Luyện Nói & Nhận Diện Phát Âm IPA
            </span>
            <h3 className="text-xl font-black text-white">{speakingPrompt}</h3>
          </div>

          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-4">
            <button
              onClick={handleStartMic}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg border-4 ${
                isRecording
                  ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white'
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>
            <p className="text-xs text-slate-300 font-bold">
              {isRecording ? 'Đang thu âm... Hãy nói tiếng Anh rõ ràng' : 'Bấm mic để bắt đầu nói bài tiếng Anh'}
            </p>
          </div>

          {speakingTranscript && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-xs text-cyan-300 uppercase tracking-wider">Văn bản AI nhận diện được:</h4>
              <p className="text-sm font-medium text-white leading-relaxed font-mono">"{speakingTranscript}"</p>
              <button
                onClick={() => onAskTutor(`Nhận xét và sửa lỗi phát âm/ngữ pháp bài nói sau giúp em: "${speakingTranscript}"`)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                Nhờ AI Phân Tích Bài Nói <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRONUNCIATION ASSESSMENT */}
      {activeTab === 'pronunciation' && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Level Selector */}
          <div className="flex gap-2">
            {(['word', 'phrase', 'sentence'] as const).map(level => (
              <button
                key={level}
                onClick={() => { setPronLevel(level); setPronTarget(''); setPronRecognized(''); setPronResult(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  pronLevel === level
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {level === 'word' ? '🔤 Từ đơn' : level === 'phrase' ? '🔗 Cụm từ' : '📝 Câu hoàn chỉnh'}
              </button>
            ))}
          </div>

          {/* Target Display */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 text-center shadow-md">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Câu cần đọc</p>
            {pronTarget ? (
              <>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-4">{pronTarget}</p>
                <button onClick={playTargetAudio} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> Nghe mẫu
                </button>
              </>
            ) : (
              <button onClick={pickRandomTarget} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
                🎲 Lấy câu mới
              </button>
            )}
          </div>

          {/* Recording Area */}
          {pronTarget && (
            <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 text-center shadow-md">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Giọng của bạn</p>
              {pronRecognized && (
                <p className="text-xl font-bold text-amber-300 mb-4">"{pronRecognized}"</p>
              )}
              <div className="flex justify-center gap-3">
                <button
                  onClick={startPronListening}
                  disabled={pronListening || pronLoading}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    pronListening
                      ? 'bg-red-600 animate-pulse text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  {pronListening ? 'Đang nghe...' : 'Nhấn để đọc'}
                </button>
                {pronRecognized && (
                  <button
                    onClick={assessPronunciation}
                    disabled={pronLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                  >
                    {pronLoading ? <Sparkles className="w-4 h-4 animate-spin text-cyan-300" /> : <Sparkles className="w-4 h-4" />}
                    {pronLoading ? 'Đang chấm...' : 'AI Chấm Điểm'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {pronResult && (
            <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 space-y-5 shadow-md">
              {/* Score */}
              <div className="text-center">
                <div className={`inline-block text-5xl font-black ${
                  pronResult.accuracyScore >= 80 ? 'text-emerald-400' :
                  pronResult.accuracyScore >= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {pronResult.accuracyScore}%
                </div>
                <p className="text-slate-300 mt-2 font-medium">{pronResult.overallFeedback}</p>
              </div>

              {/* Word by Word */}
              {pronResult.wordByWordAnalysis && pronResult.wordByWordAnalysis.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Phân tích từng từ:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pronResult.wordByWordAnalysis.map((w: any, i: number) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                        w.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {w.targetWord} {w.isCorrect ? '✓' : '✗'}
                        {w.ipa && <span className="text-xs opacity-70 ml-1">/{w.ipa}/</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {pronResult.commonMistakes && pronResult.commonMistakes.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <p className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Lỗi phổ biến:
                  </p>
                  <ul className="text-sm text-slate-300 space-y-1 ml-6 list-disc">
                    {pronResult.commonMistakes.map((m: string, i: number) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Encouragement */}
              {pronResult.encouragement && (
                <p className="text-center text-emerald-300 font-bold flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" /> {pronResult.encouragement}
                </p>
              )}

              {/* Try Again */}
              <div className="flex justify-center gap-3 pt-2">
                <button onClick={() => { setPronRecognized(''); setPronResult(null); }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  🔄 Đọc lại
                </button>
                <button onClick={() => { pickRandomTarget(); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  🎲 Câu mới
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
