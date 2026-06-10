/**
 * Processes mixed Urdu (RTL) and English (LTR) text for LTR-only environments.
 *
 * Rules:
 * 1. English Word Reversal: Continuous runs of English words, numbers, and
 *    bracketed blocks (separated by spaces) are reversed word-by-word
 *    to match the RTL reading sequence.
 * 2. Bracket Isolation: Parenthesized/bracketed expressions are treated
 *    as elements of the LTR runs and stay intact.
 * 3. Punctuation Attachment: Sentence-ending punctuation following Urdu text
 *    receives an RLM marker (\u200F) to lock it to the end of the clause.
 *
 * @param {string} text - The input mixed text.
 * @returns {string} - The processed LTR-safe text.
 */
export function processBiDiText(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  const processedLines = lines.map((line) => {
    if (!line) return "";

    const urduPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const latinPattern = /[a-zA-Z0-9]|\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/;

    // Only process lines that contain both Urdu and English/numeric/bracketed content
    if (urduPattern.test(line) && latinPattern.test(line)) {
      // Regular expression to tokenize the line:
      // Group 1: Urdu/Arabic runs of characters
      // Group 2: English, numbers, and bracketed blocks merged into continuous runs (separated by spaces)
      // Group 3: Sentence-ending and standard punctuation marks
      // Group 4: Whitespace runs separating other elements
      // Group 5: Any other single character
      const tokenRegex = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)|((?:\([^)]*\)|\[[^\]]*\]|\{[^}]*\}|[a-zA-Z0-9]+)(?:\s+(?:\u2068|\u2069)*(?:\([^)]*\)|\[[^\]]*\]|\{[^}]*\}|[a-zA-Z0-9]+))*)|([.,?!;:۔!؟]+)|(\s+)|(.)/g;

      interface Token {
        text: string;
        type: "urdu" | "english" | "punctuation" | "space" | "other";
      }

      const tokens: Token[] = [];
      let match: RegExpExecArray | null;
      tokenRegex.lastIndex = 0;

      // Tokenize the line into typed blocks
      while ((match = tokenRegex.exec(line)) !== null) {
        const tokenText = match[0];
        let type: Token["type"] = "other";

        if (match[1]) type = "urdu";
        else if (match[2]) type = "english";
        else if (match[3]) type = "punctuation";
        else if (match[4]) type = "space";

        tokens.push({ text: tokenText, type });
      }

      // Process tokens
      const processedTokens = tokens.map((token, index) => {
        if (token.type === "english") {
          // Split by spaces, reverse elements (words/brackets), and join back
          const words = token.text.split(/\s+/);
          const reversedText = words.reverse().join(" ");
          // Wrap in FSI (U+2068) and PDI (U+2069)
          return `\u2068${reversedText}\u2069`;
        }

        if (token.type === "punctuation") {
          // Find the preceding non-space token
          let isPrecedingUrdu = false;
          for (let j = index - 1; j >= 0; j--) {
            if (tokens[j].type !== "space") {
              if (tokens[j].type === "urdu") {
                isPrecedingUrdu = true;
              }
              break;
            }
          }

          // If preceded by Urdu, append RLM (U+200F)
          if (isPrecedingUrdu) {
            return `${token.text}\u200F`;
          }
        }

        return token.text;
      });

      return processedTokens.join("");
    }

    return line;
  });

  return processedLines.join("\n");
}
