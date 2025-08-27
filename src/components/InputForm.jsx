import { useState } from 'react';

const InputForm = ({ onAnalyze, isLoading }) => {
  const [subject, setSubject] = useState('');
  // const [preheader, setPreheader] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      alert("Please enter a subject line.");
      return;
    }
    onAnalyze(subject);
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="form-group">
        <label htmlFor="subject">Subject Line</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Exciting news about your account"
          disabled={isLoading}
        />
      </div>
      {/* <div className="form-group">
        <label htmlFor="preheader">Pre-header Text (Optional)</label>
        <textarea
          id="preheader"
          value={preheader}
          onChange={(e) => setPreheader(e.target.value)}
          placeholder="e.g., A preview of what's inside the email..."
          rows="3"
          disabled={isLoading}
        />
      </div> */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Now'}
      </button>
    </form>
  );
};

export default InputForm;