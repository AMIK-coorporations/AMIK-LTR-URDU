# AGENT BUILD.md

## Build Strategy
The system will be built in phases. The immediate focus is Phase 1: The Web Interface Tool.

### Phase 1: WEBISTE (Web Interface Tool)
**Goal**: Create a standalone, responsive web tool for converting mixed text.

#### Tech Stack
- **HTML5**: Semantic structure.
- **CSS3**: Flexbox/Grid for layout, strict LTR direction (`dir="ltr"`), dark/light mode support.
- **JavaScript (ES6+)**: Core BiDi processing logic, DOM manipulation, Clipboard API. No frameworks.

#### Directory Structure
```text
WEBISTE/
├── index.html          # Main interface
├── css/
│   └── style.css       # LTR-first styling
└── js/
    ├── processor.js    # Core BiDi algorithm
    └── app.js          # UI event listeners and logic


Implementation Steps
UI Layout: Build a split-screen interface. Left side: Input (RTL text area). Right side: Output (LTR text area with live preview).
Core Algorithm (processor.js):
Implement a function processBiDiText(text).
Parse text to identify Urdu/Arabic script blocks vs. Latin script blocks.
Inject FSI (First Strong Isolate) at the start of mixed segments and PDI (Pop Directional Isolate) at the end.
Inject RLM (Right-to-Left Mark) after punctuation that follows Urdu text to prevent it from jumping to the wrong side in LTR.
Live Preview: Ensure the output textarea is set to dir="ltr", but the visual preview container uses CSS unicode-bidi: isolate; to demonstrate the fix.
Clipboard Integration: Add a "Copy Processed Text" button using the modern Clipboard API.

Phase 2: LTR URDU CLI (Future)
Port processor.js logic to a Node.js CLI tool.
Support file input/output and stdin/stdout piping.

Phase 3: WEB_DOCS (Future)
Build a documentation site explaining the BiDi algorithm and how to use the tools.