import React, { useState, useEffect } from "react";
import { processBiDiText } from "./processor";
import { useTranslation } from "./i18n/useTranslation";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

interface Sample {
  key: string;
  text: string;
}

const SAMPLES: Sample[] = [
  {
    key: "samples.test1",
    text: "یہ میرا id card ہے",
  },
  {
    key: "samples.test2",
    text: "یہ ایک simple test جملہ ہے۔",
  },
  {
    key: "samples.test3",
    text: "کیا آپ (test) کر رہے ہیں؟",
  },
  {
    key: "samples.test4",
    text: "یہ ایک test ہے!",
  },
  {
    key: "samples.test5",
    text: "میرا فون number 03001234567 ہے۔",
  },
];

export const App: React.FC = () => {
  const { t, language } = useTranslation();
  const [inputText, setInputText] = useState<string>("");
  const [processedText, setProcessedText] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<boolean>(false);

  // Process text in real-time when input changes
  useEffect(() => {
    setProcessedText(processBiDiText(inputText));
  }, [inputText]);

  const handleCopy = async () => {
    if (!processedText) return;
    try {
      await navigator.clipboard.writeText(processedText);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const loadSample = (sampleText: string) => {
    setInputText(sampleText);
  };

  return (
    <div className="app-container" dir="ltr" lang={language} style={{ direction: "ltr", unicodeBidi: "isolate" }}>
      <header className="app-header" dir="ltr">
        <div className="header-top">
          <h1>{t("title")}</h1>
          <LanguageSwitcher />
        </div>
        <p className="app-subtitle">{t("subtitle")}</p>
      </header>

      <main className="workspace">
        <section className="workspace-panel">
          <div className="panel-header">
            <label htmlFor="input-area">{t("inputLabel")}</label>
            <div className="sample-controls-container">
              <span className="samples-label">{t("samplesTitle")}</span>
              <div className="sample-controls">
                {SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadSample(sample.text)}
                    className="btn-sample"
                    title={sample.text}
                  >
                    {t(sample.key)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <textarea
            id="input-area"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("inputPlaceholder")}
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
          />
        </section>

        <section className="workspace-panel">
          <div className="panel-header">
            <label htmlFor="output-area">{t("outputLabel")}</label>
            <button
              onClick={handleCopy}
              className={`btn-action ${copyStatus ? "copied" : ""}`}
              disabled={!processedText}
            >
              {copyStatus ? t("copiedBtn") : t("copyBtn")}
            </button>
          </div>
          <textarea
            id="output-area"
            value={processedText}
            readOnly
            placeholder={t("outputPlaceholder")}
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
          />
        </section>
      </main>
    </div>
  );
};
export default App;
