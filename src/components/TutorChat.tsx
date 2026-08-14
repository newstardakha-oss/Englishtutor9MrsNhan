import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Volume2, HelpCircle, FileText, Image, RefreshCw, Zap, CheckCircle2, ArrowRight, ShieldAlert, BookOpen } from 'lucide-react';
import { ChatMessage } from '../types';
import { UNITS_DATA, SGK_SAMPLE_EXERCISES } from '../data/sgkData';

interface TutorChatProps {
  selectedUnit: number;
  setSelectedUnit: (unit: number) => void;
  ttsEnabled: boolean;
  pendingQuery?: string;
  onPendingQueryConsumed?: () => void;
}

export const TutorChat: React.FC<TutorChatProps> = ({ selectedUnit, setSelectedUnit, ttsEnabled, pendingQuery, onPendingQueryConsumed }) => {
  const currentUnitInfo = UNITS_DATA.find(u => u.id === selectedUnit);

  const defaultMessage: ChatMessage = {
    id: 'welcome-1',
    sender: 'tutor',
    text: `Chào em! Thầy là **Gia Sư Tiếng Anh Lớp 9** đây! 👋\n\nThầy đồng hành cùng em học bám sát **SGK Global Success 9** và luyện các **bẫy đề trọng tâm thi vào lớp 10 THPT**.\n\nHôm nay chúng ta học **Unit ${selectedUnit}: ${currentUnitInfo?.title}** (${currentUnitInfo?.theme}) nhé!\n\nEm cần thầy hỗ trợ nội dung nào ngay bây giờ? Em có thể dùng các **lệnh nhanh** phía trên hoặc gõ câu hỏi bài tập trực tiếp cho thầy nhé! 😊`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tag: '[SGK Global Success 9]'
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('english9_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { console.error(e); }
    return [defaultMessage];
  });

  useEffect(() => {
    localStorage.setItem('english9_chat_history', JSON.stringify(messages.slice(-50)));
  }, [messages]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [activeExercise, setActiveExercise] = useState<typeof SGK_SAMPLE_EXERCISES[0] | null>(null);
  const [attachment, setAttachment] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const detectLanguage = (text: string): string => {
    const latinCharCount = (text.match(/[a-zA-Z]/g) || []).length;
    const totalCharCount = text.replace(/\s/g, '').length;
    if (totalCharCount === 0) return 'vi-VN';
    return (latinCharCount / totalCharCount > 0.6) ? 'en-US' : 'vi-VN';
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = detectLanguage(cleanText);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() && !attachment) return;

    let fullUserText = textToSend;
    if (attachment) {
      fullUserText += `\n[Đã đính kèm ảnh bài tập: ${attachment}]`;
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

      if (!response.ok) throw new Error('Không thể kết nối với server gia sư AI');

      const data = await response.json();
      const tutorReply = data.reply || 'Thầy gặp chút gián đoạn kết nối AI. Em thử gửi lại câu hỏi nhé!';

      const tutorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: tutorReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, tutorMsg]);

      if (ttsEnabled) {
        speakText(tutorReply.slice(0, 200));
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: 'Thầy vừa gặp sự cố kết nối mạng. Em hãy bấm nút gửi lại câu hỏi giúp thầy nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pendingQuery) {
      handleSendMessage(pendingQuery);
      onPendingQueryConsumed?.();
    }
  }, [pendingQuery]);

  const quickCommands = [
    { cmd: `#HOCUNIT ${selectedUnit}`, label: `Học Unit ${selectedUnit}`, icon: Sparkles, color: 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/30' },
    { cmd: `#TUVUNG Unit ${selectedUnit}`, label: 'Từ vựng & Collocations', icon: Zap, color: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/30' },
    { cmd: `#NGUPHAP Unit ${selectedUnit}`, label: 'Giải thích Ngữ Pháp', icon: HelpCircle, color: 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400/30' },
    { cmd: '#GOIY', label: 'Gợi Ý 3 Mức Socratic', icon: HelpCircle, color: 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400/30' },
    { cmd: '#SUAVIET', label: 'Chấm Sửa Bài Viết', icon: FileText, color: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/30' },
    { cmd: '#LUYENDE Thi Vào 10', label: 'Luyện Đề Bẫy Vào 10', icon: CheckCircle2, color: 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400/30' },
    { cmd: '#LOHONG', label: 'Phát Hiện Lỗ Hổng', icon: RefreshCw, color: 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400/30' },
  ];

  const sanitizeHtml = (html: string) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/ on\w+="[^"]*"/g, '')
      .replace(/ on\w+='[^']*'/g, '')
      .replace(/ on\w+=\w+/g, '');
  };

  const formatTutorMarkdown = (content: string) => {
    return content.split('\n').map((line, idx) => {
      let styledLine = line;

      const badgeReplacements: Record<string, string> = {
        '[SGK]': '<span class="inline-block bg-blue-500/20 text-blue-300 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-500/40 mr-1.5">[SGK]</span>',
        '[THI VÀO 10]': '<span class="inline-block bg-rose-500/20 text-rose-300 text-[11px] font-bold px-2 py-0.5 rounded border border-rose-500/40 mr-1.5">[THI VÀO 10]</span>',
        '[TÀI LIỆU]': '<span class="inline-block bg-indigo-500/20 text-indigo-300 text-[11px] font-bold px-2 py-0.5 rounded border border-indigo-500/40 mr-1.5">[TÀI LIỆU]</span>',
        '[BỔ TRỢ]': '<span class="inline-block bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 mr-1.5">[BỔ TRỢ]</span>',
        '[BẪY ĐỀ]': '<span class="inline-block bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-500/40 mr-1.5">[BẪY ĐỀ]</span>',
        '[LUYỆN TẬP MỚI]': '<span class="inline-block bg-cyan-500/20 text-cyan-300 text-[11px] font-bold px-2 py-0.5 rounded border border-cyan-500/40 mr-1.5">[LUYỆN TẬP MỚI]</span>',
        '[NÂNG CAO]': '<span class="inline-block bg-fuchsia-500/20 text-fuchsia-300 text-[11px] font-bold px-2 py-0.5 rounded border border-fuchsia-500/40 mr-1.5">[NÂNG CAO]</span>',
      };

      Object.entries(badgeReplacements).forEach(([key, val]) => {
        styledLine = styledLine.replace(key, val);
      });

      styledLine = styledLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

      return (
        <p key={idx} className="min-h-[1.2rem] mb-1.5 text-slate-200 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(styledLine) }} />
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-6rem)]">
      {/* Left Sidebar: Unit Knowledge & SGK Sample Exercises */}
      <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800/90 shadow-lg flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
              Unit {selectedUnit} SGK 9
            </span>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(Number(e.target.value))}
              className="bg-slate-800 text-cyan-300 text-xs px-2.5 py-1 rounded-xl border border-slate-700 font-bold outline-none cursor-pointer"
            >
              {UNITS_DATA.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.id}: {u.title}
                </option>
              ))}
            </select>
          </div>
          <h2 className="text-base font-black text-white">{currentUnitInfo?.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentUnitInfo?.theme}</p>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4 no-scrollbar">
          {/* Summary Box */}
          <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-3.5 text-xs text-slate-300">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1.5 text-sm">
              <Zap className="w-4 h-4 text-cyan-400" /> Trọng Tâm Bài Học Unit {selectedUnit}
            </h3>
            <p className="text-slate-300 mb-2 leading-relaxed">{currentUnitInfo?.description}</p>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <p><strong className="text-slate-200">Từ vựng:</strong> {currentUnitInfo?.vocabularyOverview.slice(0, 4).join(', ')}...</p>
              <p><strong className="text-slate-200">Ngữ pháp:</strong> {currentUnitInfo?.grammarFocus[0]}</p>
              <p><strong className="text-slate-200">Phát âm:</strong> {currentUnitInfo?.pronunciationFocus}</p>
            </div>
          </div>

          {/* SGK Practice Exercises */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Bài Tập SGK Mẫu
              </h3>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Gợi ý 3 Mức
              </span>
            </div>

            <div className="space-y-2.5">
              {SGK_SAMPLE_EXERCISES.filter(ex => ex.unit === selectedUnit).slice(0, 3).map((ex, index) => (
                <div key={ex.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/30 text-[10px]">
                      {ex.section}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{ex.type}</span>
                  </div>
                  <p className="font-semibold text-slate-200 leading-relaxed text-xs">{ex.question}</p>

                  {ex.options && (
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {ex.options.map((opt, oIdx) => (
                        <span key={oIdx} className="bg-slate-900 border border-slate-800 p-1.5 rounded text-slate-300 font-mono">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setActiveExercise(ex);
                        setShowHintModal(true);
                      }}
                      className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3 text-amber-400" /> Xem Gợi Ý
                    </button>
                    <button
                      onClick={() => handleSendMessage(`Em muốn giải bài tập SGK này: "${ex.question}". Nhờ thầy hướng dẫn từng bước ạ!`)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 ml-auto transition-colors shadow-sm"
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
      <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800/90 shadow-lg flex flex-col overflow-hidden">
        {/* Chat Top Header */}
        <div className="bg-slate-950 p-3.5 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
            </div>
            <div>
              <h2 className="font-black text-sm text-white flex items-center gap-2">
                Gia Sư AI Tiếng Anh 9
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  Socratic AI 24/7
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Phương pháp gợi mở • Sửa lỗi chi tiết • Ôn thi vào 10 THPT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([])}
              className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 px-2.5 py-1.5 rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-colors font-bold"
            >
              ✕ Xóa lịch sử
            </button>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: 'tutor',
                    text: `Thầy đã làm mới cuộc hội thoại. Chúng ta tiếp tục học **Unit ${selectedUnit}** nhé! Em cần thầy giúp đỡ bài tập nào?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Làm Mới
            </button>
          </div>
        </div>

        {/* Quick Commands Ribbon */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 ml-1">Lệnh Nhanh:</span>
          {quickCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(cmd.cmd)}
              className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-xl transition-all active:scale-95 flex items-center gap-1 border shadow-xs ${cmd.color}`}
            >
              <cmd.icon className="w-3 h-3" />
              <span>{cmd.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-md ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-cyan-300 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none border border-indigo-400/30'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-800/80">
                  <span className={`text-[11px] font-extrabold ${msg.sender === 'user' ? 'text-indigo-200' : 'text-cyan-400'}`}>
                    {msg.sender === 'user' ? 'Học Sinh' : 'Thầy Gia Sư AI'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {msg.timestamp}
                    </span>
                    {msg.sender === 'tutor' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-slate-400 hover:text-cyan-400 p-0.5 rounded transition-colors"
                        title="Nghe đọc giọng AI"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="prose prose-invert prose-xs max-w-none">
                  {msg.sender === 'tutor' ? formatTutorMarkdown(msg.text) : <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-cyan-300 text-xs italic bg-slate-900 p-3 rounded-xl border border-slate-800 max-w-xs shadow-md animate-pulse">
              <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              Thầy đang phân tích bối cảnh và chuẩn bị phản hồi...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview */}
        {attachment && (
          <div className="bg-indigo-950/80 border-t border-indigo-500/30 p-2 px-4 flex items-center justify-between text-xs text-cyan-300">
            <span className="flex items-center gap-1.5 font-bold">
              <FileText className="w-4 h-4 text-cyan-400" /> Tải kèm bài tập: <strong>{attachment}</strong>
            </span>
            <button
              onClick={() => setAttachment(null)}
              className="text-slate-400 hover:text-white font-bold text-sm px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              disabled={true}
              onClick={() => {}}
              title="Tính năng đang phát triển"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
            >
              <Image className="w-4 h-4 text-slate-600" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi bài tập hoặc gõ #SUAVIET, #GOIY, #LUYENDE..."
              className="flex-1 bg-slate-900 text-white placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all font-medium"
            />

            <button
              type="submit"
              disabled={loading || (!input.trim() && !attachment)}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold p-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-md border border-indigo-400/30 shrink-0"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1 font-medium">
            <span>Mẹo: Gõ <strong>#GOIY</strong> để nhận 3 mức gợi ý Socratic trước khi xem đáp án.</span>
            <span>SGK Global Success 9</span>
          </div>
        </div>
      </div>

      {/* Modal 3 Level Hints */}
      {showHintModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" /> Gợi Ý 3 Mức Socratic Bài Tập
              </h3>
              <button
                onClick={() => setShowHintModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-slate-200">
                <strong className="text-cyan-300">Câu hỏi:</strong> {activeExercise?.question}
              </div>

              {/* Level 1 */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">1</span>
                  Mức 1: Remind Knowledge (Nhắc Lại Lý Thuyết)
                </div>
                <p className="leading-relaxed">{activeExercise?.hints.level1}</p>
              </div>

              {/* Level 2 */}
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-200 space-y-1">
                <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">2</span>
                  Mức 2: Structure Pattern (Chỉ Ra Cấu Trúc Trọng Tâm)
                </div>
                <p className="leading-relaxed">{activeExercise?.hints.level2}</p>
              </div>

              {/* Level 3 */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px]">3</span>
                  Mức 3: Near Answer (Gợi Ý Gần Đáp Án)
                </div>
                <p className="leading-relaxed">{activeExercise?.hints.level3}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowHintModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowHintModal(false);
                  handleSendMessage(`Em đã đọc gợi ý bài "${activeExercise?.question}". Nhờ thầy kiểm tra giúp em ạ!`);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md border border-indigo-400/30"
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
