/**
 * Processes mixed Urdu (RTL) and English (LTR) text for LTR-only environments.
 *
 * Rules:
 * 1. Bracket Isolation & Reversal: Bracketed expressions like (code write) are
 *    isolated. The words inside are reversed, but the brackets stay in their
 *    natural positions at the start and end of the block.
 * 2. English Word Reversal: Continuous runs of English words, numbers, and
 *    placeholders (separated by spaces) are reversed word-by-word
 *    to match the RTL reading sequence.
 * 3. Punctuation Attachment: Sentence-ending punctuation following Urdu text
 *    receives an RLM marker (\u200F) to lock it to the end of the clause.
 *
 * @param {string} text - The input mixed text.
 * @returns {string} - The processed LTR-safe text.
 */

function cleanDoubleMarkers(text: string): string {
  return text
    .replace(/\u2068\u2068/g, '\u2068')
    .replace(/\u2069\u2069/g, '\u2069');
}

function restorePlaceholders(text: string, placeholdersMap: Map<string, string>): string {
  let result = text;
  const entries = Array.from(placeholdersMap.entries());
  for (let i = entries.length - 1; i >= 0; i--) {
    const [placeholder, original] = entries[i];
    result = result.replace(placeholder, original);
  }
  return result;
}

export function processBiDiText(text: string): string {
  if (!text) return "";

  // Phase 1: Pre-processing (Replace code blocks, URLs, HTML tags, links with placeholders)
  const placeholdersMap = new Map<string, string>();
  let placeholderCounter = 0;

  function createPlaceholder(content: string, type: string): string {
    const placeholder = `__${type.toUpperCase()}_PLACEHOLDER_${placeholderCounter}__`;
    placeholdersMap.set(placeholder, content);
    placeholderCounter++;
    return placeholder;
  }

  let tempText = text;
  // 1. Code blocks
  tempText = tempText.replace(/```[\s\S]*?```|`[^`]+`/g, (match) => createPlaceholder(match, 'code'));
  // 2. HTML tags
  tempText = tempText.replace(/<\/?[a-z][\s\S]*?>/gi, (match) => createPlaceholder(match, 'html'));
  // 3. Markdown links
  tempText = tempText.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match) => createPlaceholder(match, 'link'));
  // 4. URLs
  tempText = tempText.replace(/https?:\/\/[^\s)]+/g, (match) => createPlaceholder(match, 'url'));

  // Phase 2: Check Idempotency
  const hasExistingBidi = tempText.includes('\u2068') || tempText.includes('\u2069');
  if (hasExistingBidi) {
    tempText = cleanDoubleMarkers(tempText);
    return restorePlaceholders(tempText, placeholdersMap);
  }

  // Proceed with normal BiDi processing line-by-line
  const lines = tempText.split("\n");
  const processedLines = lines.map((line) => {
    if (!line) return "";

    const urduPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const latinPattern = /[a-zA-Z0-9]|\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/;

    if (urduPattern.test(line) && latinPattern.test(line)) {
      // Step 1: Find innermost brackets and extract them recursively
      const innerBracketRegex = /\([^()\[\]{}]*\)|\[[^()\[\]{}]*\]|\{[^()\[\]{}]*\}/;
      const bracketPlaceholdersMap = new Map<string, string>();
      let bracketPlaceholderCounter = 0;

      let tempLine = line;
      while (innerBracketRegex.test(tempLine)) {
        tempLine = tempLine.replace(innerBracketRegex, (match) => {
          const placeholder = `__BRACKET_PLACEHOLDER_${bracketPlaceholderCounter}__`;
          bracketPlaceholdersMap.set(placeholder, match);
          bracketPlaceholderCounter++;
          return placeholder;
        });
      }

      // Step 2: Tokenize and process the remaining text (including placeholders)
      const tokenRegex = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)|((?:[a-zA-Z0-9_]+)(?:\s+(?:\u2068|\u2069)*(?:[a-zA-Z0-9_]+))*)|([.,?!;:۔!؟]+)|(\s+)|(.)/g;

      interface Token {
        text: string;
        type: "urdu" | "english" | "punctuation" | "space" | "other";
      }

      const tokens: Token[] = [];
      let match: RegExpExecArray | null;
      tokenRegex.lastIndex = 0;

      while ((match = tokenRegex.exec(tempLine)) !== null) {
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
          // If it's a single placeholder, do not wrap in FSI/PDI during this pass
          const isSinglePlaceholder = /^__BRACKET_PLACEHOLDER_\d+__$/.test(token.text) ||
                                      /^__[A-Z]+_PLACEHOLDER_\d+__$/.test(token.text);
          if (isSinglePlaceholder) {
            return token.text;
          }

          const words = token.text.split(/\s+/);
          const reversedText = words.reverse().join(" ");
          return `\u2068${reversedText}\u2069`;
        }

        if (token.type === "punctuation") {
          let isPrecedingUrdu = false;
          for (let j = index - 1; j >= 0; j--) {
            if (tokens[j].type !== "space") {
              if (tokens[j].type === "urdu") {
                isPrecedingUrdu = true;
              }
              break;
            }
          }

          if (isPrecedingUrdu) {
            return `${token.text}\u200F`;
          }
        }

        return token.text;
      });

      const reconstructedLine = processedTokens.join("");

      // Step 3: Process bracketed content independently (inside-out)
      const processedBracketMap = new Map<string, string>();
      for (let i = 0; i < bracketPlaceholderCounter; i++) {
        const placeholder = `__BRACKET_PLACEHOLDER_${i}__`;
        const originalBracket = bracketPlaceholdersMap.get(placeholder);
        if (!originalBracket) continue;

        const firstChar = originalBracket[0];
        const lastChar = originalBracket[originalBracket.length - 1];
        const insideText = originalBracket.slice(1, -1);

        const words = insideText.split(/\s+/).filter((w) => w.length > 0);
        const reversedInsideText = words.reverse().join(" ");
        const processedInsideText = `${firstChar}${reversedInsideText}${lastChar}`;

        processedBracketMap.set(placeholder, `\u2068${processedInsideText}\u2069`);
      }

      // Step 4: Recursively replace inner placeholders inside outer placeholders
      for (let i = 0; i < bracketPlaceholderCounter; i++) {
        const innerPlaceholder = `__BRACKET_PLACEHOLDER_${i}__`;
        const innerValue = processedBracketMap.get(innerPlaceholder);
        if (!innerValue) continue;

        for (let j = i + 1; j < bracketPlaceholderCounter; j++) {
          const outerPlaceholder = `__BRACKET_PLACEHOLDER_${j}__`;
          const outerValue = processedBracketMap.get(outerPlaceholder);
          if (outerValue && outerValue.includes(innerPlaceholder)) {
            processedBracketMap.set(outerPlaceholder, outerValue.replace(innerPlaceholder, innerValue));
          }
        }
      }

      // Step 5: Replace placeholders in reconstructed line
      let finalLine = reconstructedLine;
      for (let i = 0; i < bracketPlaceholderCounter; i++) {
        const placeholder = `__BRACKET_PLACEHOLDER_${i}__`;
        const value = processedBracketMap.get(placeholder);
        if (value) {
          finalLine = finalLine.replace(placeholder, value);
        }
      }

      return finalLine;
    }

    return line;
  });

  const resultText = processedLines.join("\n");

  // Phase 3: Post-processing (Restore placeholders)
  return restorePlaceholders(resultText, placeholdersMap);
}
