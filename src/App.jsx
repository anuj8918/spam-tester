// src/App.jsx

import { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeEmailContent } from './services/geminiServices';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedSubject, setSubmittedSubject] = useState('');
  const [submittedPreheader, setSubmittedPreheader] = useState(''); // <-- ADD THIS LINE

  const handleAnalyze = async (subject, preheader) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSubmittedSubject(subject);
    setSubmittedPreheader(preheader); // <-- ADD THIS LINE

    try {
      const result = await analyzeEmailContent(subject, preheader);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Subject Line & Spam Tester</h1>
      </header>
      <main>
        <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        <ResultsDisplay
          result={analysisResult}
          isLoading={isLoading}
          error={error}
          subject={submittedSubject}
          preheader={submittedPreheader} 
        />
      </main>
    </div>
  );
}

export default App;