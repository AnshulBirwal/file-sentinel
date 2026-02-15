export const InfoCard = () => {
  return (
    <div className="info-card">
      <h3>🔒 Private & Secure</h3>
      <p>
        This tool runs entirely inside your web browser. When you select a file, the detector only reads the first few bytes (the "Magic Numbers") directly from your local disk. 
      </p>
      <p>
        <strong>Your files are never uploaded to any server</strong>, meaning your data never leaves your device.
      </p>
      <div className="source-link-container">
        {/* Replace the href with your actual GitHub repository URL */}
        <a 
          href="https://github.com/AnshulBirwal/file-sentinel" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="source-link"
        >
          View Source Code on GitHub
        </a>
      </div>
    </div>
  );
};