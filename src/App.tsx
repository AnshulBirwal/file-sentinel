import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { InfoCard } from './components/InfoCard';
import { analyzeFile, type DetectionResult } from './utils/detector';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysis = await analyzeFile(file);
      setResult(analysis);
    } catch (error) {
      console.error("Error analyzing file:", error);
      alert("Something went wrong while reading the file.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>File Sentinel</h1>
        <p>Choose a file to verify its true format securely in your browser.</p>
      </header>

      <main className="app-main">
        <FileUploader onFileSelect={handleFile} isLoading={isAnalyzing} />
        
        {isAnalyzing && <p className="loading-text">Analyzing bytes...</p>}
        
        {result && selectedFile && (
          <ResultDisplay file={selectedFile} result={result} />
        )}
      </main>

      <hr className="divider" />
      <InfoCard /> 
    </div>
  );
}

export default App;