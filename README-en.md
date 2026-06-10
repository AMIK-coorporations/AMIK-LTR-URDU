<div align="center">

# 🌍 LTR URDU-AMIK

### Bidirectional Text Processor for LTR-only Environments

[![Language - Urdu](https://img.shields.io/badge/Language-Urdu-orange?style=flat-square)](README.md)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](#)
[![License - MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#)

---

[📖 Urdu Version / اردو ترجمہ کے لیے یہاں کلک کریں](README.md)

</div>

---

> [!NOTE]
> **LTR URDU-AMIK** is a specialized bidirectional (BiDi) text processing system designed to resolve rendering issues when mixing Urdu (RTL) and English (LTR) text in Left-to-Right (LTR) environments (such as text editors, terminals, and word processors).

Historically, mixed Urdu/English text renders incorrectly in strictly LTR containers. Punctuation jumps to the wrong side of clauses, numbers flip order, and the reading sequence gets scrambled. LTR URDU-AMIK solves this by injecting precise, invisible Unicode control characters that lock the visual order.

---

## 🚀 Key Features

* **`Directional Isolation`**: Uses Unicode 6.3+ isolation control characters (FSI/PDI) to isolate English words and numbers.
* **`Punctuation Correction`**: Injects Right-to-Left Marks (RLM) after English punctuation that follows Urdu text to keep them correctly aligned.
* **`Strict LTR UI`**: The web processor UI textareas are configured with `dir="ltr"` to prove the processed text renders flawlessly in LTR containers.
* **`TypeScript Support`**: Fully typed using TypeScript and managed with React Context API.

---

## 🛠️ Core Algorithm (`processor.ts`)

The utility processes mixed text line-by-line using a two-step approach:

> [!IMPORTANT]
> 1. **Punctuation Adjustment**:
>    It detects Urdu text immediately followed by English/neutral punctuation (like `.` `,` `?` `!` `(` `)` etc.) and injects a strong Right-to-Left Mark (`\u200F`) right after it. This forces the BiDi layout engine to keep the punctuation on the natural end (left side) of the Urdu clause.
> 
> 2. **Latin Segment Isolation**:
>    It identifies contiguous runs of Latin characters (English words, numbers, and internal spaces/punctuation) and wraps them in a First Strong Isolate (`\u2068`) and Pop Directional Isolate (`\u2069`). This shields the English text from leaking its directionality to adjacent Urdu characters.

---

## 📂 Web Interface Tool (`WEBISTE`)

To run the local development server:

| Step | Command | Description |
| :---: | :--- | :--- |
| **1** | `cd WEBISTE` | Navigate to the project folder |
| **2** | `npm install` | Install all dependencies |
| **3** | `npm run dev` | Launch the local server |
| **4** | `npm run build` | Compile the production build |

---

## 📄 License

This project is open-source and available under the MIT License.
