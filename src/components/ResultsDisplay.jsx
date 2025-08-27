import React from 'react';
const ResultsDisplay = ({ result, isLoading, error, subject, preheader }) => {
  if (isLoading) {
    return <div className="loading">Analyzing, please wait...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!result) {
    return <div className="initial-message">Enter a subject line to see the analysis.</div>;
  }

  const subjectLength = subject.length;
  let lengthVerdict = '';
  let lengthColor = '';

  if (subjectLength < 20) {
    lengthVerdict = 'Too Short';
    lengthColor = 'orange';
  } else if (subjectLength > 60) {
    lengthVerdict = 'Too Long';
    lengthColor = 'red';
  } else {
    lengthVerdict = 'Good Length';
    lengthColor = 'green';
  }

  // Spam Score
  const score = result.deliverabilityScore || 0;
  const scoreColor = score <= 3 ? 'red' : score <= 6 ? 'orange' : 'green';

  return (
    <div className="results-container">
      <h2>Analysis Results</h2>
      
      {/* CARD FOR INBOX PREVIEW */}
      <div className="result-card preview-card">
        <h3>Inbox Preview</h3>
        <div className="preview-content">
          <div className="subject-line">
            <span className="subject">{subject}</span>
            <span className="preheader-text"> - {preheader || " "}</span>
          </div>
        </div>
      </div>

      <div className="result-card length-card">
        <h3>Character Count</h3>
        <p className={`length-count ${lengthColor}`}>{subjectLength}</p>
        <p className={`verdict ${lengthColor}`}>{lengthVerdict}</p>
        <p className="recommendation">Recommended length is 20-60 characters.</p>
      </div>

      <div className="result-card score-card">
        <h3>Deliverability Score</h3>
        <p className={`score-badge ${scoreColor}`}>{score} / 10</p>
        <div className="score-bar-container">
          <div className={`score-bar ${scoreColor}`} style={{ width: `${score * 10}%` }}></div>
        </div>
        <p className="score-label">
          {result.riskLevel === "High"
            ? "⚠️ High Spam Risk"
            : result.riskLevel === "Medium"
            ? "🔶 Moderate Risk"
            : "✅ Low Risk"}
        </p>
      </div>

      <div className="result-card">
        <h3>AI Summary</h3>
        <p>{result.summary}</p>
      </div>

      {result.triggers && result.triggers.length > 0 && (
        <div className="result-card">
          <h3>🚨 Potential Spam Triggers</h3>
          <div className="triggers-list">
            {result.triggers.map((trigger, index) => (
              <span key={index} className="trigger-tag">{trigger}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
