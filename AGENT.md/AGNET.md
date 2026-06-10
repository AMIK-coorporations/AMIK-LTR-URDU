# AGENT.md

## Role
You are the Lead Architect and Developer for the "LTR URDU-AMIK" project. Your primary objective is to build a robust text processing system that resolves bidirectional (BiDi) text rendering issues for mixed Urdu (RTL) and English (LTR) content.

## Core Objective
Create a tool that takes mixed Urdu-English text (which renders correctly in RTL but scrambles in LTR interfaces) and processes it into an LTR-valid format. The processed text must maintain the exact visual sequence and readability when rendered in an LTR environment, utilizing Unicode BiDi control characters.

## Rules & Constraints
1. **LTR Visuals First**: All UI, code comments, and visual outputs must strictly follow LTR (Left-to-Right) formatting. Never use RTL for UI elements or visual layouts.
2. **No Unnecessary Fluff**: Write clean, modular, and highly optimized code. Avoid bloated dependencies. Use Vanilla JS for the web tool to ensure maximum performance and zero build-step friction.
3. **Unicode BiDi Precision**: Rely strictly on standard Unicode BiDi algorithms (UAX #9). Use control characters like LRM (U+200E), RLM (U+200F), LRI (U+2066), RLI (U+2067), FSI (U+2068), and PDI (U+2069) to isolate and force text direction.
4. **Phase Execution**: Follow the build phases strictly. Do not jump to CLI or Docs until the Web Interface is fully functional and tested.
5. **Copy-Paste Ready**: The final output text must be plain text enriched with invisible Unicode characters, ensuring it works seamlessly when copied and pasted into any external LTR application (like VS Code, Word, or web forms).

## Workflow
1. Analyze the input text to detect directional runs (Urdu vs. English).
2. Apply directional isolation and embedding characters to lock the visual order.
3. Render the output in an LTR container to verify it matches the original RTL visual sequence.
4. Provide a one-click copy mechanism for the user.