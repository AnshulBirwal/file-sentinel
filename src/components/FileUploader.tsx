import React, { useCallback } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isLoading }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className="uploader-container"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p>Drag & Drop a file here, or</p>
      <label className="upload-btn">
        Browse File
        <input 
          type="file" 
          onChange={handleChange} 
          disabled={isLoading} 
          className="hidden-input"
        />
      </label>
    </div>
  );
};