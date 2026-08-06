---
name: skill-multi-game-app
description: Quy trình tích hợp nhiều game vào cùng một ứng dụng React/TypeScript. Bao gồm kiến trúc component, data flow, registry pattern, settings, âm thanh, và checklist thêm game mới. Gọi skill này khi cần thêm game mới hoặc tạo ứng dụng multi-game từ đầu.
---

# Multi-Game App Architecture — Tích hợp nhiều game vào 1 ứng dụng

## Tổng quan

Skill này mô tả **kiến trúc đã được kiểm chứng** để tích hợp N game (hiện tại 15) vào cùng một ứng dụng React/TypeScript. Mỗi game là một component độc lập, chia sẻ chung hệ thống câu hỏi, cài đặt, bảng xếp hạng và âm thanh.

---

## Kiến trúc tổng thể

```
src/
├── App.tsx              ← Router chính + Game Registry
├── GameSetup.tsx         ← Màn hình chuẩn bị chung cho mọi game
├── Manage.tsx            ← Quản lý câu hỏi, cài đặt, import/export
├── types.ts              ← Type definitions + GameSettings + defaults
├── store.ts              ← localStorage persistence + migration
├── MathContent.tsx       ← Component render LaTeX (MathJax)
├── utils/
│   ├── audio.ts          ← Hiệu ứng âm thanh (correct/wrong/bell)
│   └── bgMusic.ts        ← Nhạc nền procedural mỗi game 1 theme
└── games/
    ├── Millionaire.tsx   ← Game 1
    ├── Obstacle.tsx      ← Game 2
    ├── FlipCard.tsx      ← Game 3
    ├── ...               ← Game N
    └── SurvivalIsland.tsx
```

---

## 5 lớp cần thay đổi khi thêm game mới

### Lớp 1: Game Component (`src/games/NewGame.tsx`)

Mỗi game là **React component tự chứa**, nhận cùng interface props:

```typescript
export default function NewGame({
  questions,           // Question[] — danh sách câu hỏi đã lọc
  teamCount = 2,       // number — số đội (2-4), chỉ game đội
  timePerQuestion = 20,// number — giây, 0 = không giới hạn
  onReplay,            // () => void — callback chơi lại
  onGameEnd,           // (score, correct, total) => void — ghi điểm
}: {
  questions: Question[];
  teamCount?: number;
  timePerQuestion?: number;
  onReplay?: () => void;
  onGameEnd?: (score: number, correct: number, total: number) => void;
}) {
  // Game logic here
}
```

**Pattern bắt buộc trong mỗi game:**

```typescript
// 1. Import chuẩn
import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import { playSound } from '../utils/audio';
import { MathContent } from '../MathContent';

// 2. State cơ bản
const [qIndex, setQIndex] = useState(0);
const [selected, setSelected] = useState<number | null>(null);
const [showResult, setShowResult] = useState(false);
const [timeLeft, setTimeLeft] = useState(timePerQuestion);
const [gameOver, setGameOver] = useState(false);
const [totalCorrect, setTotalCorrect] = useState(0);
const [totalAsked, setTotalAsked] = useState(0);

const q = questions[qIndex];

// 3. Timer (copy-paste pattern)
useEffect(() => {
  if (gameOver || showResult || !timePerQuestion) return;
  if (timeLeft <= 0) { handleAnswer(-1); return; }
  const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
  return () => clearTimeout(t);
}, [timeLeft, gameOver, showResult]);

// 4. Game Over check — KHI HẾT CÂU HỎI
useEffect(() => {
  if (qIndex >= questions.length && !gameOver) {
    setGameOver(true);
    onGameEnd?.(maxScore, totalCorrect, totalAsked);
  }
}, [qIndex]);

// 5. Answer handler
const handleAnswer = useCallback((ansIdx: number) => {
  if (showResult || gameOver) return;
  setSelected(ansIdx);
  setShowResult(true);
  setTotalAsked(p => p + 1);
  
  if (ansIdx === q.answer) {
    playSound('correct');
    setTotalCorrect(p => p + 1);
    // Game-specific reward logic
  } else {
    playSound('wrong');
    // Game-specific penalty logic
  }
  
  setTimeout(() => {
    setShowResult(false);
    setSelected(null);
    setTimeLeft(timePerQuestion);
    setQIndex(p => p + 1);  // next question
  }, 1500);
}, [dependencies]);

// 6. Render — 3 states
if (gameOver) return <GameOverScreen />;
if (!q) return null;  // safety
return <GamePlayScreen />;
```

**Hiển thị câu hỏi — PHẢI dùng MathContent:**

```tsx
{/* Câu hỏi — hỗ trợ LaTeX */}
<MathContent html={q.text} className="text-white font-bold text-center" />

{/* Đáp án — cũng hỗ trợ LaTeX */}
{q.options.map((opt, i) => (
  <button key={i} onClick={() => handleAnswer(i)}>
    <span>{String.fromCharCode(65 + i)}</span>
    <MathContent html={opt} />
  </button>
))}
```

---

### Lớp 2: Type System (`src/types.ts`)

Thêm game mới vào `GameSettings` và `DEFAULT_GAME_SETTINGS`:

```typescript
export type GameSettings = {
  // ... existing games ...
  newGame: GameTimeConfig;            // ← THÊM
  teamCount: number;
};

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  // ... existing ...
  newGame: { timePerQuestion: 20 },   // ← THÊM
  teamCount: 2,
};
```

---

### Lớp 3: Data Migration (`src/store.ts`)

Thêm migration để user cũ không bị crash:

```typescript
const migrateData = (data: any): AppData => {
  // ... existing migrations ...
  const gs = data.gameSettings;
  if (!gs.newGame) gs.newGame = { timePerQuestion: 20 };  // ← THÊM
  return data as AppData;
};
```

> **Quan trọng**: Migration đảm bảo user đã dùng app trước khi game mới được thêm sẽ tự động có settings mặc định, tránh lỗi `undefined`.

---

### Lớp 4: App Router (`src/App.tsx`)

3 chỗ cần sửa:

```typescript
// 1. Import component
import NewGame from './games/NewGame';

// 2. Thêm vào Games Registry array
const games = [
  // ... existing ...
  {
    id: 'newGame',
    name: 'Tên Game',
    icon: '🎮',
    desc: 'Mô tả ngắn...',
    color: 'bg-blue-500',
    iconBg: 'bg-blue-100'
  },
];

// 3. Thêm route render
{screen === 'newGame' && (
  <NewGame
    questions={gameQuestions}
    teamCount={data.gameSettings?.teamCount || 2}
    timePerQuestion={data.gameSettings?.newGame?.timePerQuestion}
    onReplay={() => { stopBgMusic(); setSelectedGame('newGame'); setScreen('home'); }}
    onGameEnd={(s, c, t) => recordScore(s, c, t)}
  />
)}
```

---

### Lớp 5: Settings UI (`src/Manage.tsx`)

Thêm card cài đặt thời gian:

```typescript
// Trong grid cài đặt game, thêm entry:
{ key: 'newGame' as const, name: '🎮 Tên Game', desc: 'Mô tả thời gian', defaultTime: 20 },
```

---

## Hệ thống hỗ trợ chung

### Âm thanh (`src/utils/audio.ts`)

Tất cả game dùng chung:

```typescript
playSound('correct');  // Ding ding — trả lời đúng
playSound('wrong');    // Buzz — trả lời sai
playSound('bell');     // Chuông vàng
playSound('flip');     // Lật thẻ
playSound('tick');     // Tick đồng hồ
```

### Nhạc nền (`src/utils/bgMusic.ts`)

Mỗi game có theme nhạc riêng bằng Web Audio API procedural:

```typescript
// Thêm theme cho game mới vào THEMES object:
const THEMES: Record<string, ThemeConfig> = {
  // ... existing ...
  newGame: {
    bpm: 120,            // Nhịp/phút  
    scale: SCALES.major, // Thang âm: major/minor/pentatonic/dramatic/epic
    baseOctave: 4,       // Quãng tám cơ bản
    waveType: 'sine',    // Loại sóng: sine/square/triangle/sawtooth
    volume: 0.05,        // Âm lượng (0-0.15)
    bassLine: true,      // Có bass không
    rhythm: 'march',     // Nhịp: march/swing/pulse/waltz/chase/calm
  },
};
```

| Rhythm | Cảm giác | Phù hợp |
|--------|---------|---------|
| `chase` | Nhanh, hồi hộp | Đua, countdown |
| `march` | Hùng tráng | Battle, chiến thuật |
| `dramatic` | Căng thẳng | Triệu phú, đấu giá |
| `calm` | Nhẹ nhàng | Ghép hình, ô chữ |
| `swing` | Vui tươi | Vòng quay, xây tháp |
| `pulse` | Đều đặn | Sinh tồn, bắn tàu |

### MathContent (`src/MathContent.tsx`)

Render LaTeX qua MathJax — **mọi game PHẢI dùng** cho `q.text` và `opt`:

```tsx
<MathContent html={q.text} tag="p" className="..." />
```

Hỗ trợ: `\(...\)`, `$...$`, `\[...\]`, `$$...$$`

### GameSetup (`src/GameSetup.tsx`)

Màn hình chuẩn bị **chung cho tất cả game**:
- Chọn môn học, chủ đề, độ khó
- Chọn số câu hỏi
- Chọn số đội (cho game đội)
- Chọn/random học sinh
- Shuffle câu hỏi

**Không cần sửa GameSetup khi thêm game mới** — nó tự detect game đội qua list `TEAM_GAMES`.

---

## Checklist thêm game mới (7 bước)

```
□ 1. Tạo src/games/NewGame.tsx (implement game logic + UI)
     - Props: questions, teamCount?, timePerQuestion?, onReplay, onGameEnd
     - Import: MathContent, playSound, Question type
     - 3 states: playing → result → gameOver
     - Dùng MathContent cho q.text và opt

□ 2. types.ts: Thêm `newGame: GameTimeConfig` vào GameSettings + DEFAULT

□ 3. store.ts: Thêm migration `if (!gs.newGame) gs.newGame = {...}`

□ 4. App.tsx:
     - Import component
     - Thêm vào games[] array (id, name, icon, desc, color)
     - Thêm route {screen === 'newGame' && <NewGame ... />}

□ 5. Manage.tsx: Thêm vào grid cài đặt thời gian

□ 6. bgMusic.ts: Thêm theme nhạc (bpm, scale, rhythm)

□ 7. Build & Test: npm run build (exit code 0)
```

---

## Anti-patterns — Những lỗi HAY MẮC

### ❌ Sai 1: Quên xử lý hết câu hỏi
```typescript
// SAI — khi qIndex >= questions.length, q = undefined → crash
const q = questions[qIndex]; // undefined!
return <div>{q.text}</div>;  // 💥 TypeError

// ĐÚNG — thêm useEffect check + guard
useEffect(() => {
  if (qIndex >= questions.length && !gameOver) {
    setGameOver(true);
    onGameEnd?.(score, correct, total);
  }
}, [qIndex]);

if (!q) return null; // safety guard
```

### ❌ Sai 2: Quên stopBgMusic
```typescript
// SAI — nhạc vẫn phát khi quay về home
onReplay={() => { setSelectedGame('x'); setScreen('home'); }}

// ĐÚNG
onReplay={() => { stopBgMusic(); setSelectedGame('x'); setScreen('home'); }}
```

### ❌ Sai 3: Dùng text thuần thay MathContent
```tsx
// SAI — công thức toán hiện raw: \(x^2\)
<p>{q.text}</p>
<span>{opt}</span>

// ĐÚNG — MathJax render đẹp: x²
<MathContent html={q.text} />
<MathContent html={opt} />
```

### ❌ Sai 4: Quên data migration
```typescript
// SAI — user cũ mở app → gameSettings.newGame = undefined → crash
data.gameSettings.newGame.timePerQuestion  // 💥

// ĐÚNG — migration đảm bảo default
if (!gs.newGame) gs.newGame = { timePerQuestion: 20 };
```

### ❌ Sai 5: Game đội không giới hạn team count
```typescript
// SAI — user nhập teamCount = 99
const numTeams = teamCount;

// ĐÚNG — clamp 2-4
const numTeams = Math.min(Math.max(teamCount, 2), 4);
```

---

## Data Flow tổng thể

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Manage.tsx │────▶│  store.ts    │────▶│ localStorage │
│ (câu hỏi,   │     │ (save/load)  │     │ (persist)    │
│  settings)   │     └──────┬───────┘     └──────────────┘
└─────────────┘            │
                           │ AppData
                           ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   App.tsx   │────▶│ GameSetup.tsx │────▶│ Game screen  │
│ (router +   │     │ (lọc câu hỏi,│     │ (play +      │
│  registry)  │     │  chọn đội)   │     │  score)      │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │ onGameEnd
                                                ▼
                                         ┌──────────────┐
                                         │ Leaderboard  │
                                         │ (bảng xếp    │
                                         │  hạng)       │
                                         └──────────────┘
```

---

## Công nghệ & Dependencies

| Thư viện | Mục đích |
|----------|---------|
| React + TypeScript | Framework UI |
| Vite | Build tool |
| Tailwind CSS (inline) | Styling |
| MathJax 3 (CDN) | Render LaTeX |
| Web Audio API | Âm thanh + nhạc nền procedural |
| mammoth | Parse DOCX → HTML + WMF→PNG |
| Gemini API | AI tạo/phân tích câu hỏi |
| localStorage | Lưu trữ dữ liệu |

---

## Khi nào gọi skill này?

- Khi cần **thêm game mới** vào app đã có
- Khi **tạo ứng dụng multi-game** từ đầu
- Khi **debug lỗi** liên quan đến game (trắng màn hình, thiếu settings, không có nhạc)
- Khi cần **review kiến trúc** game app
- Khi cần tham khảo **pattern chuẩn** cho game component
