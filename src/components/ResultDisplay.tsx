import React from 'react';
import type { DetectionResult } from '../utils/detector';

interface ResultDisplayProps {
  file: File;
  result: DetectionResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ file, result }) => {
  const isDanger = result.isSpoofed;
  const isUnknown = result.realExtension === 'Unknown';

  let statusClass = 'status-safe';
  let statusText = 'Safe (Matches)';

  if (isDanger) {
    statusClass = 'status-danger';
    statusText = '🚨 SPOOFED FILE DETECTED!';
  } else if (isUnknown) {
    statusClass = 'status-warning';
    statusText = 'Unknown File Type';
  }

  return (
    <div className="result-card">
      <h3>Analysis: <span className="highlight">{file.name}</span></h3>
      
      <div className={`status-badge ${statusClass}`}>
        {statusText}
      </div>

      <div className="result-grid">
        <div className="result-item">
          <span>Claimed Extension:</span>
          <strong>.{result.claimedExtension.toUpperCase()}</strong>
        </div>
        <div className="result-item">
          <span>Actual Signature:</span>
          <strong>{isUnknown ? 'Unrecognized' : `.${result.realExtension.toUpperCase()}`}</strong>
        </div>
      </div>
      
      {isDanger && (
        <p className="danger-text">
          <b>Warning:</b> This file claims to be a <b>{result.claimedExtension.toUpperCase()}</b> but its internal signature matches a <b>{result.realExtension.toUpperCase()}</b>. Do not open or execute this file!
        </p>
      )}
    </div>
  );
};