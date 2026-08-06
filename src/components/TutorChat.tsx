import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Volume2, HelpCircle, FileText, Image, RefreshCw, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';
import { UNITS_DATA, SGK_SAMPLE_EXERCISES } from '../data/sgkData';

interface TutorChatProps {
  selectedUnit: number;
  setSelectedUnit: (unit: number) => void;
  ttsEnabled: boolean;
}

export const TutorChat: React.FC<TutorChatProps> = ({ selectedUnit, setSelectedUnit, ttsEnabled }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'tutor',
      text: `Chào em! Thầy là **Gia Sư Tiếng Anh Lớp 9** đây! 👋\n\nThầy đồng hành cùng em học bám sát **SGK Global Success 9** và hướng tới mục tiêu **đạt điểm cao trong kì thi tuyển sinh vào lớp 10 THPT**.\n\nHôm nay chúng ta cùng học **Unit ${selectedUnit}: ${UNITS_DATA.find(u => u.id === selectedUnit)?.title}** nhé!\n\nEm muốn thầy hỗ trợ nội dung nào ngay bây giờ? Em có thể dùng các **lệnh nhanh** bên dưới hoặc gõ câu hỏi cho thầy nhé! 😊`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: '[SGK Global Success 9]'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [attachment, setAttachment] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Clean markdown symbols for natural TTS reading
    const cleanText = text.replace(/[*_#`[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN'; // or en-US for English parts
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() && !attachment) return;

    let fullUserText = textToSend;
    if (attachment) {
      fullUserText += `\n[Tải kèm hình ảnh/tài liệu bài tập: ${attachment}]`;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: fullUserText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!customMessage) setInput('');
    setAttachment(null);
    setLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: fullUserText,
          unitContext: selectedUnit,
          conversationHistory: updatedHistory.slice(-8)
        })
      });

      if (!response.ok) throw new Error('Không thể kết nối với server gia sư');

      const data = await response.json();
      const tutorReply = data.reply || 'Thầy gặp chút gián đoạn kết nối. Em thử nhắn lại nhé!';

      const tutorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: tutorReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, tutorMsg]);

      if (ttsEnabled) {
        speakText(tutorReply.slice(0, 200)); // Speak opening of tutor reply
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: 'Thầy vừa gặp sự cố kết nối AI. Em hãy thử bấm gửi lại nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    { cmd: `#HOCUNIT ${selectedUnit}`, label: `Học Unit ${selectedUnit}`, icon: Sparkles, color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { cmd: `#TUVUNG Unit ${selectedUnit}`, label: 'Hỏi từ vựng & Collocations', icon: Zap, color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
    { cmd: `#NGUPHAP Unit ${selectedUnit}`, label: 'Giải thích ngữ pháp & Cấu trúc', icon: HelpCircle, color: 'bg-purple-600 hover:bg-purple-700 text-white' },
    { cmd: '#GOIY', label: 'Gợi ý 3 mức giải bài', icon: HelpCircle, color: 'bg-amber-600 hover:bg-amber-700 text-white' },
    { cmd: '#SUAVIET', label: 'Sửa bài viết / Đoạn văn', icon: FileText, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    { cmd: '#LUYENDE Thi Vào 10', label: 'Luyện câu thi vào 10', icon: CheckCircle2, color: 'bg-rose-600 hover:bg-rose-700 text-white' },
    { cmd: '#LOHONG', label: 'Phát hiện lỗ hổng', icon: RefreshCw, color: 'bg-cyan-600 hover:bg-cyan-700 text-white' },
  ];

  const currentUnitInfo = UNITS_DATA.find(u => u.id === selectedUnit);

  const formatTutorMarkdown = (content: string) => {
    // Format special badges and markdown for friendly reading
    return content.split('\n').map((line, idx) => {
      let styledLine = line;

      const badgeReplacements: Record<string, string> = {
        '[SGK]': '<span class="inline-block bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-300 mr-1.5">[SGK]</span>',
        '[THI VÀO 10]': '<span class="inline-block bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded border border-rose-300 mr-1.5">[THI VÀO 10]</span>',
        '[TÀI LIỆU]': '<span class="inline-block bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded border border-indigo-300 mr-1.5">[TÀI LIỆU]</span>',
        '[BỔ TRỢ]': '<span class="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-300 mr-1.5">[BỔ TRỢ]</span>',
        '[MỞ RỘNG]': '<span class="inline-block bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded border border-purple-300 mr-1.5">[MỞ RỘNG]</span>',
        '[LUYỆN TẬP MỚI]': '<span class="inline-block bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-300 mr-1.5">[LUYỆN TẬP MỚI]</span>',
        '[NÂNG CAO]': '<span class="inline-block bg-fuchsia-100 text-fuchsia-800 text-[11px] font-bold px-2 py-0.5 rounded border border-fuchsia-300 mr-1.5">[NÂNG CAO]</span>',
      };

      Object.entries(badgeReplacements).forEach(([key, val]) => {
        styledLine = styledLine.replace(key, val);
      });

      // Simple bold replace
      styledLine = styledLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');

      return (
        <p key={idx} className="min-h-[1.2rem] mb-1.5 text-slate-800 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: styledLine }} />
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-5rem)]">
      {/* Left Sidebar: Unit Context & SGK Quick Practice */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              Unit {selectedUnit} SGK 9
            </span>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(Number(e.target.value))}
              className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
            >
              {UNITS_DATA.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.id}: {u.title}
                </option>
              ))}
            </select>
          </div>
          <h2 className="text-lg font-bold text-white">{currentUnitInfo?.title}</h2>
          <p className="text-xs text-slate-300 mt-1">{currentUnitInfo?.theme}</p>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Summary Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900">
            <h3 className="font-bold text-blue-950 flex items-center gap-1.5 mb-1 text-sm">
              <Zap className="w-4 h-4 text-blue-600" /> Trọng Tâm Bài Học Unit {selectedUnit}
            </h3>
            <p className="text-slate-700 mb-2">{currentUnitInfo?.description}</p>
            <div className="space-y-1 text-slate-600">
              <p><strong>Từ vựng chính:</strong> {currentUnitInfo?.vocabularyOverview.slice(0, 4).join(', ')}...</p>
              <p><strong>Ngữ pháp:</strong> {currentUnitInfo?.grammarFocus[0]}</p>
              <p><strong>Phát âm:</strong> {currentUnitInfo?.pronunciationFocus}</p>
            </div>
          </div>

          {/* SGK Practice Exercises with Hints */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" /> Bài Tập SGK Luyện Tập
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Gợi ý 3 Mức</span>
            </div>

            <div className="space-y-3">
              {SGK_SAMPLE_EXERCISES.filter(ex => ex.unit === selectedUnit || selectedUnit === 1).slice(0, 3).map((ex, index) => (
                <div key={ex.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {ex.section}
                    </span>
                    <span className="text-slate-400 font-medium text-[10px]">{ex.type}</span>
                  </div>
                  <p className="font-medium text-slate-800 mb-2 leading-relaxed">{ex.question}</p>
                  
                  {ex.options && (
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {ex.options.map((opt, oIdx) => (
                        <span key={oIdx} className="bg-white border border-slate-200 p-1.5 rounded text-slate-700 font-mono text-[11px]">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setActiveExerciseIndex(index);
                        setShowHintModal(true);
                      }}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold px-2.5 py-1 rounded text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3" /> Xem Gợi Ý 3 Mức
                    </button>
                    <button
                      onClick={() => handleSendMessage(`Em muốn giải bài tập này: "${ex.question}". Nhờ thầy hướng dẫn từng bước ạ!`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-2.5 py-1 rounded text-[11px] flex items-center gap-1 ml-auto transition-colors"
                    >
                      Hỏi Thầy <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Main Chat Area */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Chat Header Bar */}
        <div className="bg-slate-900 text-white p-3.5 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                Gia Sư AI Tiếng Anh Lớp 9
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Online 24/7
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Phương pháp Socratic: Gợi mở • Sửa lỗi chi tiết • Thi vào 10</p>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: Date.now().toString(),
                  sender: 'tutor',
                  text: `Chào em! Thầy đã làm mới cuộc hội thoại. Chúng ta tiếp tục học **Unit ${selectedUnit}** nhé! Em cần thầy giúp gì nào?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>
        </div>

        {/* Quick Command Ribbon */}
        <div className="bg-slate-100 border-b border-slate-200 p-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 ml-1">Lệnh nhanh:</span>
          {quickCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(cmd.cmd)}
              className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-transform active:scale-95 flex items-center gap-1 shadow-xs ${cmd.color}`}
            >
              <cmd.icon className="w-3 h-3" />
              <span>{cmd.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-xs ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-amber-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
                  <span className={`text-[11px] font-bold ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-600'}`}>
                    {msg.sender === 'user' ? 'Học Sinh' : 'Thầy Gia Sư AI'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                    {msg.sender === 'tutor' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
                        title="Nghe đọc"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="prose prose-xs max-w-none">
                  {msg.sender === 'tutor' ? formatTutorMarkdown(msg.text) : <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs italic bg-white p-3 rounded-xl border border-slate-200 max-w-xs shadow-xs animate-pulse">
              <Bot className="w-4 h-4 text-blue-600 animate-spin" />
              Thầy đang phân tích và chuẩn bị câu trả lời...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview if selected */}
        {attachment && (
          <div className="bg-amber-50 border-t border-amber-200 p-2 px-4 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-amber-600" /> Tải kèm bài tập: <strong>{attachment}</strong>
            </span>
            <button
              onClick={() => setAttachment(null)}
              className="text-amber-700 hover:text-amber-900 font-bold text-sm px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setAttachment(`Bài tập SGK Unit ${selectedUnit} (Hình ảnh)`)}
              title="Tải lên ảnh bài tập / phiếu bài tập"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <Image className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi, câu bài tập hoặc gõ #SUAVIET, #GOIY, #LUYENDE..."
              className="flex-1 bg-slate-100 text-slate-800 placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />

            <button
              type="submit"
              disabled={loading || (!input.trim() && !attachment)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold p-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Mẹo: Gõ <strong>#GOIY</strong> để nhận 3 mức gợi ý trước khi xem đáp án.</span>
            <span>SGK Global Success 9</span>
          </div>
        </div>
      </div>

      {/* Modal 3 Level Hints */}
      {showHintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" /> Gợi Ý 3 Mức Cho Bài Tập SGK
              </h3>
              <button
                onClick={() => setShowHintModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800">
                <strong>Câu hỏi:</strong> {SGK_SAMPLE_EXERCISES[activeExerciseIndex]?.question}
              </div>

              {/* Level 1 */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <div className="font-bold text-amber-950 mb-1 flex items-center gap-1">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
                  Mức 1: Nhắc Lại Kiến Thức Nền
                </div>
                <p>{SGK_SAMPLE_EXERCISES[activeExerciseIndex]?.hints.level1}</p>
              </div>

              {/* Level 2 */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <div className="font-bold text-blue-950 mb-1 flex items-center gap-1">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">2</span>
                  Mức 2: Chỉ Ra Cấu Trúc Trọng Tâm
                </div>
                <p>{SGK_SAMPLE_EXERCISES[activeExerciseIndex]?.hints.level2}</p>
              </div>

              {/* Level 3 */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <div className="font-bold text-emerald-950 mb-1 flex items-center gap-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">3</span>
                  Mức 3: Gần Đáp Án
                </div>
                <p>{SGK_SAMPLE_EXERCISES[activeExerciseIndex]?.hints.level3}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowHintModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowHintModal(false);
                  handleSendMessage(`Em đã đọc gợi ý bài "${SGK_SAMPLE_EXERCISES[activeExerciseIndex]?.question}". Đáp án của em là... Nhờ thầy kiểm tra giúp ạ!`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Thử Làm Bài Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
