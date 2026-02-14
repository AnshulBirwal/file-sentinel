export interface FileType {
  extension: string;
  mime: string;
  description?: string;
}

// Map of 4-byte file signatures (8 hex chars).
export const MAGIC_NUMBERS: Record<string, FileType> = {
  // Images
  "89504e47": { extension: "png", mime: "image/png", description: "PNG Image" },
  "47494638": { extension: "gif", mime: "image/gif", description: "GIF Image" },
  "00000100": { extension: "ico", mime: "image/x-icon", description: "Icon File" },
  "49492a00": { extension: "tiff", mime: "image/tiff", description: "TIFF Image (Little Endian)" },
  "4d4d002a": { extension: "tiff", mime: "image/tiff", description: "TIFF Image (Big Endian)" },
  // JPEG can start with different valid signatures.
  "ffd8ffe0": { extension: "jpg", mime: "image/jpeg", description: "JPEG Image (JFIF)" },
  "ffd8ffe1": { extension: "jpg", mime: "image/jpeg", description: "JPEG Image (EXIF)" },
  "ffd8ffe2": { extension: "jpg", mime: "image/jpeg", description: "JPEG Image (CANNON)" },
  "ffd8ffe3": { extension: "jpg", mime: "image/jpeg", description: "JPEG Image (SAMSUNG)" },
  "ffd8ffe8": { extension: "jpg", mime: "image/jpeg", description: "JPEG Image (SPIFF)" },
  "ffd8ffdb": { extension: "jpg", mime: "image/jpeg", description: "JPEG Image" },
  "ffd8ffee": { extension: "jpg", mime: "image/jpeg", description: "JPEG Image" },

  // Documents
  "25504446": { extension: "pdf", mime: "application/pdf", description: "PDF Document" },
  "d0cf11e0": { extension: "doc", mime: "application/msword", description: "Legacy MS Office (DOC, XLS, PPT)" },
  "7b5c7274": { extension: "rtf", mime: "application/rtf", description: "Rich Text Format" },
  
  // Archives and modern docs
  // DOCX/XLSX/PPTX and APK files are ZIP-based.
  "504b0304": { extension: "zip", mime: "application/zip", description: "ZIP Archive / Modern MS Office" },
  "504b0506": { extension: "zip", mime: "application/zip", description: "ZIP Archive (Empty)" },
  "504b0708": { extension: "zip", mime: "application/zip", description: "ZIP Archive (Spanned)" },
  "52617221": { extension: "rar", mime: "application/x-rar-compressed", description: "RAR Archive" },
  "377abcaf": { extension: "7z", mime: "application/x-7z-compressed", description: "7-Zip Archive" },
  "1f8b0800": { extension: "gz", mime: "application/gzip", description: "GZIP Archive" },
  "1f8b0808": { extension: "gz", mime: "application/gzip", description: "GZIP Archive (with filename)" },
  "425a6839": { extension: "bz2", mime: "application/x-bzip2", description: "BZIP2 Archive" },

  // Audio and video
  // MP3 files often begin with an ID3v2 tag.
  "49443303": { extension: "mp3", mime: "audio/mpeg", description: "MP3 Audio (ID3v2.3)" },
  "49443304": { extension: "mp3", mime: "audio/mpeg", description: "MP3 Audio (ID3v2.4)" },
  "4f676753": { extension: "ogg", mime: "audio/ogg", description: "OGG Media" },
  "664c6143": { extension: "flac", mime: "audio/flac", description: "FLAC Audio" },
  "1a45dfa3": { extension: "mkv", mime: "video/x-matroska", description: "Matroska Media (MKV/WEBM)" },
  "464c5601": { extension: "flv", mime: "video/x-flv", description: "Flash Video" },
  // RIFF is a container; bytes 8-11 identify the real type.
  "52494646": { extension: "riff", mime: "application/octet-stream", description: "RIFF Container (WAV/AVI/WEBP)" },

  // Executables and system files
  // "MZ" marks Windows executables; "9000" is the usual DOS stub.
  "4d5a9000": { extension: "exe", mime: "application/x-msdownload", description: "Windows Executable/DLL" },
  "7f454c46": { extension: "elf", mime: "application/x-elf", description: "Linux Executable (ELF)" },
  "cafebabe": { extension: "class", mime: "application/java-vm", description: "Java Class File" },
  "53514c69": { extension: "sqlite", mime: "application/vnd.sqlite3", description: "SQLite Database" },
  "25215053": { extension: "ps", mime: "application/postscript", description: "PostScript File" },
};
