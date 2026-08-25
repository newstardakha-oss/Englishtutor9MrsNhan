import React, { useState, useEffect } from 'react';
import { Settings, Key, ExternalLink, Check, X, Eye, EyeOff, Zap, Trash2 } from 'lucide-react';
import {
  getStoredApiKey, setStoredApiKey, clearStoredApiKey, hasStoredApiKey,
  getSelectedModel, setSelectedModel, AVAILABLE_MODELS
} from '../utils/apiKeyManager';

interface ApiKeySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  forceOpen?: boolean; // Khi chưa có key → không cho đóng
}

export const ApiKeySettingsModal: React.FC<ApiKeySettingsModalProps> = ({ isOpen, onClose, forceOpen }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModelState] = useState(getSelectedModel());
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedKey = getStoredApiKey();
      if (storedKey) setApiKey(storedKey);
      setSelectedModelState(getSelectedModel());
      setSaved(false);
      setTestStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
    }
    setSelectedModel(selectedModel);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (!forceOpen) onClose();
    }, 1000);
  };

  const handleClearKey = () => {
    clearStoredApiKey();
    setApiKey('');
    setTestStatus('idle');
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) return;
    setTestStatus('testing');
    setTestMessage('');

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey.trim(),
          'x-gemini-model': selectedModel,
        },
        body: JSON.stringify({
          message: 'Xin chào, thầy có nghe thấy em không?',
          unitContext: 1,
          conversationHistory: [],
        }),
      });

      if (res.ok) {
        setTestStatus('success');
        setTestMessage('Key hoạt động tốt!');
      } else {
        const errData = await res.json().catch(() => ({}));
        setTestStatus('error');
        setTestMessage(errData.error || 'Key không hợp lệ hoặc đã hết quota');
      }
    } catch {
      setTestStatus('error');
      setTestMessage('Không thể kết nối server');
    }
  };

  const canClose = !forceOpen || hasStoredApiKey();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={canClose ? onClose : undefined}
      >
        {/* Modal */}
        <div
          className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Thiết Lập API Key</h2>
                <p className="text-xs text-white/80">Cấu hình Gemini AI cho Gia Sư</p>
              </div>
            </div>
            {canClose && (
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* Hướng dẫn lấy key */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs">
              <p className="font-bold text-amber-300 mb-1.5">📌 Hướng dẫn lấy API Key miễn phí:</p>
              <ol className="text-amber-200/90 space-y-1 list-decimal list-inside">
                <li>Truy cập Google AI Studio bằng tài khoản Gmail</li>
                <li>Bấm "Create API Key" → chọn project → Copy key</li>
                <li>Dán key vào ô bên dưới và bấm Lưu</li>
              </ol>
              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors border border-amber-500/30"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Mở Google AI Studio lấy Key
              </a>
            </div>

            {/* Input API Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Key className="w-3.5 h-3.5 inline mr-1.5" />
                API Key Gemini
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setTestStatus('idle'); }}
                  placeholder="Dán API Key của em vào đây..."
                  className="w-full bg-slate-950 text-white text-sm px-4 py-3 pr-20 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none font-mono placeholder:text-slate-600"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {apiKey && (
                    <button
                      onClick={handleClearKey}
                      className="p-1.5 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Xóa Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Test key + status */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestKey}
                  disabled={!apiKey.trim() || testStatus === 'testing'}
                  className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {testStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra Key'}
                </button>
                {testStatus === 'success' && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {testMessage}
                  </span>
                )}
                {testStatus === 'error' && (
                  <span className="text-xs text-rose-400 font-medium">{testMessage}</span>
                )}
              </div>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                🤖 Chọn Model AI
              </label>
              <div className="grid grid-cols-1 gap-2">
                {AVAILABLE_MODELS.map((model) => {
                  const isSelected = selectedModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelState(model.id)}
                      className={`p-3 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold">{model.name}</span>
                          {model.badge && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${
                              model.isDefault
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            }`}>
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5">{model.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={forceOpen && !apiKey.trim()}
              className={`w-full py-3 rounded-xl font-black text-sm transition-all border active:scale-95 ${
                saved
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-indigo-400/30 shadow-md'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {saved ? '✅ Đã lưu thành công!' : '💾 Lưu Cài Đặt'}
            </button>

            {forceOpen && !hasStoredApiKey() && (
              <p className="text-xs text-rose-400 text-center font-medium">
                ⚠️ Vui lòng nhập API Key để sử dụng các tính năng Gia Sư AI
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
