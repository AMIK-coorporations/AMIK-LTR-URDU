export const en = {
  title: "LTR URDU-AMIK",
  subtitle: "Bidirectional Text Processor for LTR-only Environments (Mixed Urdu & English)",
  inputLabel: "Input Text (Mixed Urdu & English)",
  outputLabel: "Processed Output (LTR Valid)",
  inputPlaceholder: "Enter mixed Urdu and English text here...",
  outputPlaceholder: "Processed LTR-safe text will appear here...",
  copyBtn: "Copy Processed",
  copiedBtn: "Copied! ✓",
  samplesTitle: "Load Test Cases:",
  samples: {
    test1: "Test 1 (Word Reversal)",
    test2: "Test 2 (Multi-Word Reversal)",
    test3: "Test 3 (Parentheses)",
    test4: "Test 4 (End Punctuation)",
    test5: "Test 5 (Numbers)",
  }
};

export type TranslationKeys = typeof en;
export type TranslationKey = keyof TranslationKeys | string;
