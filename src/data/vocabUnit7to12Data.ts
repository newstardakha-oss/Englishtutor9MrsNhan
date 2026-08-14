/**
 * VOCABULARY DATA - UNIT 7 to 12 (Global Success 9 - HK2)
 * 
 * SKELETON FILE: Cấu trúc sẵn sàng để import dữ liệu từ vựng khi có file DOCX.
 * Hiện đang sử dụng dữ liệu mẫu tối thiểu cho mỗi Unit.
 * 
 * Format tương thích với vocabUnit1to6Data.ts
 */

import { VocabularyItem } from '../types';

// ============================================================
// UNIT 7 - [Chủ đề sẽ được cập nhật khi có DOCX]
// ============================================================
export const VOCAB_UNIT_7: VocabularyItem[] = [
  // TODO: Import từ file GS9 - Book 2 - Unit 7 - Vocabulary.docx
  // Placeholder data để app không bị lỗi khi chọn Unit 7
];

// ============================================================
// UNIT 8 - [Chủ đề sẽ được cập nhật khi có DOCX]
// ============================================================
export const VOCAB_UNIT_8: VocabularyItem[] = [
  // TODO: Import từ file GS9 - Book 2 - Unit 8 - Vocabulary.docx
];

// ============================================================
// UNIT 9 - [Chủ đề sẽ được cập nhật khi có DOCX]
// ============================================================
export const VOCAB_UNIT_9: VocabularyItem[] = [
  // TODO: Import từ file GS9 - Book 2 - Unit 9 - Vocabulary.docx
];

// ============================================================
// UNIT 10 - [Chủ đề sẽ được cập nhật khi có DOCX]
// ============================================================
export const VOCAB_UNIT_10: VocabularyItem[] = [
  // TODO: Import từ file GS9 - Book 2 - Unit 10 - Vocabulary.docx
];

// ============================================================
// UNIT 11 - [Chủ đề sẽ được cập nhật khi có DOCX]
// ============================================================
export const VOCAB_UNIT_11: VocabularyItem[] = [
  // TODO: Import từ file GS9 - Book 2 - Unit 11 - Vocabulary.docx
];

// ============================================================
// UNIT 12 - [Chủ đề sẽ được cập nhật khi có DOCX]
// ============================================================
export const VOCAB_UNIT_12: VocabularyItem[] = [
  // TODO: Import từ file GS9 - Book 2 - Unit 12 - Vocabulary.docx
];

// ============================================================
// AGGREGATE: Toàn bộ từ vựng Unit 7-12
// ============================================================
export const FULL_VOCABULARY_UNIT_7_TO_12: VocabularyItem[] = [
  ...VOCAB_UNIT_7,
  ...VOCAB_UNIT_8,
  ...VOCAB_UNIT_9,
  ...VOCAB_UNIT_10,
  ...VOCAB_UNIT_11,
  ...VOCAB_UNIT_12,
];

/**
 * Lấy từ vựng theo Unit ID (7-12)
 */
export const getVocabByUnit = (unitId: number): VocabularyItem[] => {
  switch (unitId) {
    case 7: return VOCAB_UNIT_7;
    case 8: return VOCAB_UNIT_8;
    case 9: return VOCAB_UNIT_9;
    case 10: return VOCAB_UNIT_10;
    case 11: return VOCAB_UNIT_11;
    case 12: return VOCAB_UNIT_12;
    default: return [];
  }
};

/**
 * Kiểm tra Unit có dữ liệu từ vựng chưa
 */
export const hasVocabData = (unitId: number): boolean => {
  return getVocabByUnit(unitId).length > 0;
};
