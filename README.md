# LTR URDU-AMIK

**LTR URDU-AMIK** is a specialized bidirectional (BiDi) text processing system designed to resolve rendering issues when mixing Urdu (RTL) and English (LTR) text in Left-to-Right (LTR) environments (such as text editors, terminals, and word processors).

Historically, mixed Urdu/English text renders incorrectly in strictly LTR containers. Punctuation jumps to the wrong side of clauses, numbers flip order, and the reading sequence gets scrambled. LTR URDU-AMIK solves this by injecting precise, invisible Unicode control characters that lock the visual order.

---

## Key Features

- **Directional Isolation**: Uses Unicode 6.3+ isolation control characters (FSI/PDI) to isolate English words and numbers.
- **Punctuation Correction**: Injects Right-to-Left Marks (RLM) after English punctuation that follows Urdu text to keep them correctly aligned.
- **Strict LTR UI**: The web processor UI textareas are configured with `dir="ltr"` to prove the processed text renders flawlessly in LTR containers.
- **Zero Dependencies**: Core processor logic is written in lightweight, pure Vanilla JavaScript.
- **Real-Time Interface**: A clean React + Vite application for converting text on the fly.

---

## Core Algorithm (`processor.js`)

The utility processes mixed text line-by-line using a two-step approach:

1. **Punctuation Adjustment**:
   It detects Urdu text immediately followed by English/neutral punctuation (like `.` `,` `?` `!` `(` `)` etc.) and injects a strong Right-to-Left Mark (`\u200F`) right after it. This forces the BiDi layout engine to keep the punctuation on the natural end (left side) of the Urdu clause.
   
2. **Latin Segment Isolation**:
   It identifies contiguous runs of Latin characters (English words, numbers, and internal spaces/punctuation) and wraps them in a First Strong Isolate (`\u2068`) and Pop Directional Isolate (`\u2069`). This shields the English text from leaking its directionality to adjacent Urdu characters.

---

## Web Interface Tool (`WEBISTE`)

The Phase 1 Web Interface Tool is located in the `WEBISTE/` folder. It is built as a minimal React + Vite application focusing purely on functionality and clean light/dark mode aesthetics.

### Setup and Running Locally

To run the web interface tool on your machine, follow these steps:

1. Navigate to the `WEBISTE` directory:
   ```bash
   cd WEBISTE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## License

This project is open-source and available under the MIT License.
